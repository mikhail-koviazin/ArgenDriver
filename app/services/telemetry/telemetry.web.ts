import { FirebaseApp, getApps, initializeApp } from "firebase/app"
import {
  Analytics,
  getAnalytics,
  isSupported,
  logEvent as firebaseLogEvent,
  setAnalyticsCollectionEnabled,
  setConsent,
} from "firebase/analytics"
import { AnalyticsEvents, ErrorType } from "./types"
import { firebaseWebConfig } from "./webConfig"

export * from "./types"

/**
 * Telemetry is opt-in: nothing is sent until the user enables it in settings.
 * Until then `enabled` stays false and every logging call is a no-op.
 */
let enabled = false
let app: FirebaseApp | undefined
let analytics: Analytics | undefined

/** Without a linked Google Analytics property there is no measurement id and nothing to send to. */
const isConfigured = Boolean(firebaseWebConfig.appId && firebaseWebConfig.measurementId)

async function safe(action: () => Promise<unknown> | unknown) {
  try {
    await action()
  } catch (error) {
    if (__DEV__) console.warn("[telemetry]", error)
  }
}

/**
 * Creates the Analytics instance on first use.
 *
 * `getAnalytics` injects the gtag script and starts writing cookies, so it is deliberately
 * not called until the user has opted in.
 */
async function getInstance(): Promise<Analytics | undefined> {
  if (analytics) return analytics
  if (!isConfigured) return undefined
  if (!(await isSupported())) return undefined

  app = getApps()[0] ?? initializeApp(firebaseWebConfig)
  analytics = getAnalytics(app)
  return analytics
}

/**
 * Applies the user's choice. On web there is no Crashlytics, so this only covers analytics.
 */
export async function setTelemetryEnabled(value: boolean) {
  enabled = value

  await safe(async () => {
    setConsent({
      analytics_storage: value ? "granted" : "denied",
      // The app carries no advertising and is not linked to Google Ads, so the ad consents
      // buy nothing and are never granted.
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    })

    // Opting out must not spin up the SDK just to switch it off again.
    const instance = value ? await getInstance() : analytics
    if (instance) setAnalyticsCollectionEnabled(instance, value)
  })
}

export async function logEvent<K extends keyof AnalyticsEvents>(
  name: K,
  params?: AnalyticsEvents[K],
) {
  if (!enabled) return
  await safe(async () => {
    const instance = await getInstance()
    // The SDK reserves overloads for its own GA4 event names; ours are all custom.
    if (instance) firebaseLogEvent(instance, name as string, params)
  })
}

export async function logScreenView(screenName: string) {
  if (!enabled) return
  await safe(async () => {
    const instance = await getInstance()
    if (instance) {
      firebaseLogEvent(instance, "screen_view", {
        firebase_screen: screenName,
        firebase_screen_class: screenName,
      })
    }
  })
}

/**
 * Crashlytics has no web SDK. Errors stay in the browser console until the web build gets
 * its own reporter.
 */
export function reportCrash(error: Error, type: ErrorType = ErrorType.FATAL) {
  console.error(`[${type}]`, error)
}

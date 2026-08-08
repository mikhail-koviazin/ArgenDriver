import { firebase } from "@react-native-firebase/analytics"
import crashlytics from "@react-native-firebase/crashlytics"
import { AnalyticsEvents, ErrorType } from "./types"

export * from "./types"

/**
 * Telemetry is opt-in: nothing is sent until the user enables it in settings.
 * Until then `enabled` stays false and every logging call is a no-op.
 */
let enabled = false

/**
 * Firebase throws if the native app was built without google-services.json, and there is
 * no reason to take the whole screen down over a missed analytics event. Everything that
 * touches the SDK goes through here.
 */
async function safe(action: () => Promise<unknown> | unknown) {
  try {
    await action()
  } catch (error) {
    if (__DEV__) console.warn("[telemetry]", error)
  }
}

/**
 * Applies the user's choice to both Firebase Analytics and Crashlytics. Call it once after
 * the store is rehydrated and again whenever the setting changes.
 */
export async function setTelemetryEnabled(value: boolean) {
  enabled = value

  await safe(async () => {
    const analytics = firebase.analytics()
    await analytics.setConsent({
      analytics_storage: value,
      // The app carries no advertising and is not linked to Google Ads, so the ad consents
      // buy nothing. Granting them would drag iOS into App Tracking Transparency territory.
      ad_storage: false,
      ad_user_data: false,
      ad_personalization: false,
    })
    await analytics.setAnalyticsCollectionEnabled(value)
  })

  await safe(() => crashlytics().setCrashlyticsCollectionEnabled(value))
}

export async function logEvent<K extends keyof AnalyticsEvents>(
  name: K,
  params?: AnalyticsEvents[K],
) {
  if (!enabled) return
  await safe(() => firebase.analytics().logEvent(name, params))
}

export async function logScreenView(screenName: string) {
  if (!enabled) return
  await safe(() =>
    firebase.analytics().logScreenView({ screen_name: screenName, screen_class: screenName }),
  )
}

/**
 * Reports a handled or fatal error. In development it only reaches the console, so that
 * Reactotron and the red screen stay the primary signal.
 */
export function reportCrash(error: Error, type: ErrorType = ErrorType.FATAL) {
  if (__DEV__) {
    console.error(`[${type}]`, error)
    return
  }
  if (!enabled) return

  safe(() => {
    crashlytics().log(type)
    return crashlytics().recordError(error)
  })
}

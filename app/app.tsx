/* eslint-disable import/first */
if (__DEV__) {
  // Load Reactotron in development only.
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require("./devtools/ReactotronConfig.ts")
}
import "./utils/gestureHandler"
import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import React from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import { TelemetryConsentPrompt } from "./components"
import { useInitialRootStore, useStores } from "./models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import * as storage from "./utils/storage"
import { customFontsToLoad } from "./theme"
import Config from "./config"
import { setLanguage } from "./i18n"
import { setTelemetryEnabled } from "./services/telemetry"
import { initWebAnalytics } from "./services/webAnalytics"

// Runs once per page load, outside React: the visit counter carries no consent and no stored
// state, so it has nothing to wait for.
initWebAnalytics()

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

const prefix = Linking.createURL("/")
const config = {
  screens: {
    Main: {
      screens: {
        StartTest: "start",
        Changelog: "changelog",
        Settings: "settings",
      },
    },
    Test: "test",
  },
}

interface AppProps {
  hideSplashScreen: () => Promise<boolean>
}

function App(props: AppProps) {
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    onNavigationStateChange,
    onNavigationReady,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)

  const { settingsStore } = useStores()
  const { rehydrated } = useInitialRootStore(() => {
    setLanguage(settingsStore.language)
    // Anyone already opted in did so from the settings toggle, before the prompt existed.
    // They have made their choice and should not be asked again.
    if (settingsStore.analyticsEnabled) settingsStore.markAnalyticsChoiceMade()
    // Applied here rather than in an effect: the navigator must not mount before the stored
    // choice is known, or the first screen view of the session races the consent and is dropped.
    setTelemetryEnabled(settingsStore.analyticsEnabled)
    setTimeout(hideSplashScreen, 500)
  })

  if (!rehydrated || !isNavigationStateRestored || (!areFontsLoaded && !fontLoadError)) {
    return null
  }

  const linking = {
    prefixes: [prefix],
    config,
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppNavigator
          linking={linking}
          initialState={initialNavigationState}
          onReady={onNavigationReady}
          onStateChange={onNavigationStateChange}
        />
        <TelemetryConsentPrompt />
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App

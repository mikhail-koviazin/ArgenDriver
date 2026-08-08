import fs from "fs"
import path from "path"
import { ExpoConfig, ConfigContext } from "@expo/config"

/**
 * Use ts-node here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript
 */
require("ts-node/register")

/**
 * Firebase config files are gitignored, because the repository is public. That leaves two
 * cases this has to cope with:
 *
 * - EAS builds, which only get the committed files. The files are uploaded as file-type
 *   environment variables, and EAS exposes the path it wrote them to
 * - a fresh clone with no Firebase set up at all, which must still prebuild
 *
 * `@react-native-firebase/app` throws when its config file is missing, so the Firebase
 * plugins are only added once the file is actually there. Without it the app builds and
 * runs exactly as before, with telemetry switched off.
 */
function resolveConfigFile(envVar: string | undefined, fallback: string): string | undefined {
  const candidate = envVar ?? path.resolve(__dirname, fallback)
  return fs.existsSync(candidate) ? candidate : undefined
}

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 *
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? []

  const googleServicesJson = resolveConfigFile(
    process.env.GOOGLE_SERVICES_JSON,
    "./google-services.json",
  )
  const googleServicesPlist = resolveConfigFile(
    process.env.GOOGLE_SERVICES_PLIST,
    "./GoogleService-Info.plist",
  )
  const firebaseConfigured = Boolean(googleServicesJson || googleServicesPlist)

  if (!firebaseConfigured) {
    console.warn(
      "[app.config] No Firebase config file found, building without analytics and Crashlytics. " +
        "See docs/telemetry.md.",
    )
  }

  return {
    ...config,
    android: { ...config.android, googleServicesFile: googleServicesJson },
    ios: { ...config.ios, googleServicesFile: googleServicesPlist },
    plugins: [
      ...existingPlugins,
      ...(firebaseConfigured
        ? ["@react-native-firebase/app", "@react-native-firebase/crashlytics"]
        : []),
      require("./plugins/withSplashScreen").withSplashScreen,
    ],
  }
}

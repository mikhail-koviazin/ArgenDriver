/**
 * Firebase config for the web app.
 *
 * The values end up in the JS bundle either way - the Firebase JS SDK hands them to every
 * browser that loads the page, and access is controlled by the API key's HTTP referrer
 * restrictions, not by keeping the config private. They are kept out of this public
 * repository anyway, so that scrapers do not get a set of live keys for free.
 *
 * Supplied through `.env` (gitignored, see `.env.example`). Expo inlines any variable
 * prefixed with `EXPO_PUBLIC_` at build time, so each one has to be written out in full
 * here: Metro substitutes the literal `process.env.EXPO_PUBLIC_X` text and cannot follow
 * destructuring or computed access.
 *
 * `measurementId` only exists once Google Analytics is linked to the project. Without it,
 * or without a `.env` at build time, web telemetry stays switched off.
 */
export const firebaseWebConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
}

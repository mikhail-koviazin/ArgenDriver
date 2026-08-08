/**
 * Firebase config for the web app.
 *
 * These values are not secrets: the Firebase JS SDK ships them to every browser that loads
 * the page, and access is controlled by the project's security rules and the API key's
 * HTTP referrer restrictions, not by keeping the config private.
 *
 * Taken from Firebase console -> Project settings -> Your apps -> Web app -> SDK setup.
 * `measurementId` is only present once Google Analytics is linked to the project; without
 * it the web telemetry stays disabled.
 */
export const firebaseWebConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
}

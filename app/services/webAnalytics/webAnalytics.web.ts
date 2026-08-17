/**
 * Vercel Web Analytics: a visit counter that does not depend on the telemetry prompt.
 *
 * It is deliberately not wired to `settingsStore.analyticsEnabled`. Firebase already answers
 * "how many consenting users are there"; the question this answers is "does anyone open the
 * site at all", which a consent gate would make unanswerable again. Vercel sets no cookies,
 * stores no identifier and keeps no personal data, so there is nothing here to consent to.
 *
 * The script comes from the deployment origin, injected by Vercel itself, so there is no npm
 * package to keep in sync. Custom events are a Pro feature and are not used; on Hobby the
 * quota is 50k events per month with 30 days of history.
 */
const SCRIPT_SRC = "/_vercel/insights/script.js"

let injected = false

/**
 * Adds the counter script once per page load. A no-op in development, where the path is not
 * served and would only put a 404 in the console.
 */
export function initWebAnalytics() {
  if (injected || __DEV__) return
  if (typeof document === "undefined") return

  injected = true
  const script = document.createElement("script")
  script.src = SCRIPT_SRC
  script.defer = true
  document.head.appendChild(script)
}

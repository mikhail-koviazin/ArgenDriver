/**
 * Metro resolves this to `webAnalytics.web.ts` on web and to `webAnalytics.ts` everywhere else.
 * TypeScript only ever sees the native file, so the two must keep the same exports.
 */
export * from "./webAnalytics"

/**
 * Metro resolves this to `telemetry.web.ts` on web and to `telemetry.ts` everywhere else.
 * TypeScript only ever sees the native file, so the two must keep the same exports.
 */
export * from "./telemetry"

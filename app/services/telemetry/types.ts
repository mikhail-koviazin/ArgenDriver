/**
 * Shared contract for the telemetry service.
 *
 * The implementation is platform-split: `telemetry.ts` uses `@react-native-firebase`
 * on Android/iOS, `telemetry.web.ts` uses the Firebase JS SDK on web. Both files must
 * export everything declared here.
 */

/** Result of answering a single question. */
export type AnswerResult = "correct" | "incorrect" | "passed"

/**
 * Every analytics event the app can send, with its parameters.
 *
 * GA4 constraints: event and parameter names must be snake_case, start with a letter
 * and stay under 40 characters; string values must stay under 100 characters.
 * `screen_view` is reserved and is sent through `logScreenView` instead.
 */
export interface AnalyticsEvents {
  /** User started a test from StartTestScreen. */
  test_started: { questions_count: number }
  /** User answered the last question and opened the result modal. */
  test_completed: {
    questions_count: number
    correct: number
    incorrect: number
    passed: number
  }
  /** User left the test before reaching the last question. */
  test_abandoned: { questions_count: number; answered: number }
  /**
   * A single answer, including passes. `question_num` is the index in questions.json; it is
   * absent for questions opened directly by number, which carry no index.
   */
  question_answered: { question_num?: number; result: AnswerResult }
  /** User revealed the translation of a question. */
  translation_shown: { language: string }
  /** User picked a bug kind in the report modal and the mail composer opened. */
  bug_report_started: { kind: string; question_num?: number }
  /** User changed the interface language in settings. */
  language_changed: { language: string }
  /** User turned telemetry on. There is no opt-out counterpart: nothing may be sent after opting out. */
  telemetry_opt_in: Record<string, never>
}

export type AnalyticsEventName = keyof AnalyticsEvents

/** Error classification used to group reports in Crashlytics. */
export enum ErrorType {
  /** An error that would normally cause a red screen in dev and force a restart. */
  FATAL = "Fatal",
  /** An error caught by a try/catch that the app recovered from. */
  HANDLED = "Handled",
}

import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const SettingsStoreModel = types
  .model("SettingsStore")
  .props({
    language: types.optional(types.enumeration(["en", "ru"] as const), "en"),
    analyticsEnabled: types.optional(types.boolean, false),
    /** False until the user has answered the telemetry question one way or the other. */
    analyticsChoiceMade: types.optional(types.boolean, false),
  })
  .actions((store) => ({
    setLanguage(value: "en" | "ru") {
      store.language = value
    },
    setAnalyticsEnabled(value: boolean) {
      store.analyticsEnabled = value
      // Reaching either the prompt or the settings toggle counts as answering.
      store.analyticsChoiceMade = true
    },
    /** For users who opted in before the prompt existed: they have already chosen. */
    markAnalyticsChoiceMade() {
      store.analyticsChoiceMade = true
    },
  }))

export interface SettingsStore extends Instance<typeof SettingsStoreModel> {}
export interface SettingsStoreSnapshot extends SnapshotOut<typeof SettingsStoreModel> {}

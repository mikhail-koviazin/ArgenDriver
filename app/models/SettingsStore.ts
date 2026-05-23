import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const SettingsStoreModel = types
  .model("SettingsStore")
  .props({
    language: types.optional(types.enumeration(["en", "ru"]), "en"),
    analyticsEnabled: types.optional(types.boolean, false),
  })
  .actions((store) => ({
    setLanguage(value: "en" | "ru") {
      store.language = value
    },
    setAnalyticsEnabled(value: boolean) {
      store.analyticsEnabled = value
    },
  }))

export interface SettingsStore extends Instance<typeof SettingsStoreModel> {}
export interface SettingsStoreSnapshot extends SnapshotOut<typeof SettingsStoreModel> {}

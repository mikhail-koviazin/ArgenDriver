import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { SettingsStoreModel } from "./SettingsStore"

export const RootStoreModel = types.model("RootStore").props({
  settingsStore: types.optional(SettingsStoreModel, {}),
})

export interface RootStore extends Instance<typeof RootStoreModel> {}
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

import React, { FC, useEffect, useState } from "react"
import { Platform, TextStyle, ViewStyle } from "react-native"
import { Screen, Text, Toggle } from "../../components"
import { MainTabScreenProps } from "../../navigators/MainNavigator"
import { spacing } from "../../theme"
import { setLanguage } from "app/i18n"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { Picker } from "@react-native-picker/picker"
import { logEvent, setTelemetryEnabled } from "app/services/telemetry"

export const SettingsScreen: FC<MainTabScreenProps<"Settings">> = observer(function SettingsScreen(
  _props,
) {
  const { settingsStore } = useStores()
  const [, setCounter] = useState(0)

  useEffect(() => {
    setLanguage(settingsStore.language)
    setCounter((c) => c + 1)
  }, [settingsStore.language])

  const handleAnalyticsToggle = async (value: boolean) => {
    settingsStore.setAnalyticsEnabled(value)
    await setTelemetryEnabled(value)
    // Only the opt-in can be recorded: after opting out nothing may be sent any more.
    if (value) logEvent("telemetry_opt_in")
  }

  const handleLanguageChange = (value: "en" | "ru") => {
    settingsStore.setLanguage(value)
    logEvent("language_changed", { language: value })
  }

  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <Text preset="heading" tx="settingsScreen.title" style={$title} />

      <Text tx="settingsScreen.languageLabel" style={$label} />
      <Picker
        selectedValue={settingsStore.language}
        onValueChange={handleLanguageChange}
        mode="dropdown"
        style={[$picker, Platform.OS === "web" && $pickerWebOnly]}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Русский" value="ru" />
      </Picker>

      <Toggle
        variant="switch"
        value={settingsStore.analyticsEnabled}
        onValueChange={handleAnalyticsToggle}
        labelTx="settingsScreen.analyticsLabel"
        helperTx="settingsScreen.analyticsDescription"
        containerStyle={$toggleRow}
      />
    </Screen>
  )
})

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  gap: spacing.md,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}

const $label: TextStyle = {
  marginBottom: spacing.xs,
}

const $picker: TextStyle = {
  marginBottom: spacing.sm,
}

const $pickerWebOnly: TextStyle = {
  height: 40,
  color: "rgb(25, 16, 21)",
  fontSize: 16,
  lineHeight: 20,
  fontFamily: "spaceGroteskMedium",
  paddingHorizontal: 10,
  paddingVertical: 5,
}

const $toggleRow: ViewStyle = {
  marginTop: spacing.sm,
}

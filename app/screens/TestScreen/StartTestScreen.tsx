import React, { FC } from "react"
import { Platform, TextStyle, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../../components"
import { MainTabScreenProps } from "../../navigators/MainNavigator"
import { spacing } from "../../theme"
import { Picker } from "@react-native-picker/picker"
import { useState } from "react"
import { logEvent } from "app/services/telemetry"

export const StartTestScreen: FC<MainTabScreenProps<"StartTest">> = function StartTestScreen(
  _props,
) {
  const [questionsCount, setQuestionsCount] = useState(20)

  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <Text preset="heading" tx="startTestScreen.title" style={$title} />
      <Text tx="startTestScreen.subtitle" style={$tagline} />

      <Picker
        selectedValue={questionsCount}
        // Web hands back the option's string value, native hands back the number. Normalise
        // here so the route param and the analytics parameter are numeric on both.
        onValueChange={(value) => setQuestionsCount(Number(value))}
        mode="dropdown"
        style={[$picker, Platform.OS === "web" && $pickerWebOnly]}
      >
        <Picker.Item label="20" value={20} />
        <Picker.Item label="40" value={40} />
        <Picker.Item label="80" value={80} />
      </Picker>

      <Button
        tx="startTestScreen.startButton"
        onPress={() => {
          logEvent("test_started", { questions_count: questionsCount })
          _props.navigation.push("Test", { questionsCount })
        }}
      />
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}

const $tagline: TextStyle = {
  marginBottom: spacing.sm,
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

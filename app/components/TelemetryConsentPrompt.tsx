import React from "react"
import { Modal, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useStores } from "app/models"
import { logEvent, setTelemetryEnabled } from "app/services/telemetry"
import { colors, spacing } from "app/theme"
import { Button } from "./Button"
import { Text } from "./Text"

/**
 * Asked once, on the first launch. A buried settings toggle is found by almost nobody, and
 * turning telemetry on by default would collect from people who never agreed to it.
 *
 * Both answers are one tap and the same size. "Allow" carries more visual weight, but
 * refusing must stay just as easy, or the consent it collects is not worth having.
 */
export const TelemetryConsentPrompt = observer(function TelemetryConsentPrompt() {
  const { settingsStore } = useStores()

  if (settingsStore.analyticsChoiceMade) return null

  const choose = async (value: boolean) => {
    settingsStore.setAnalyticsEnabled(value)
    await setTelemetryEnabled(value)
    if (value) logEvent("telemetry_opt_in")
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      // Android back dismisses without collecting, the same as declining.
      onRequestClose={() => choose(false)}
    >
      <View style={$backdrop}>
        <View style={$card}>
          <Text preset="subheading" tx="telemetryPrompt.title" />
          <Text tx="telemetryPrompt.body" />
          <Text tx="telemetryPrompt.details" size="xs" style={$details} />

          <View style={$actions}>
            <Button tx="telemetryPrompt.accept" onPress={() => choose(true)} style={$accept} />
            <Button
              tx="telemetryPrompt.decline"
              onPress={() => choose(false)}
              style={$decline}
              textStyle={$declineText}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
})

const $backdrop: ViewStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.lg,
}

const $card: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 8,
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.lg,
  maxWidth: 420,
  gap: spacing.md,
}

const $details: TextStyle = {
  color: colors.textDim,
}

const $actions: ViewStyle = {
  gap: spacing.sm,
  marginTop: spacing.xs,
}

const $accept: ViewStyle = {
  backgroundColor: colors.palette.accent300,
  borderColor: colors.palette.accent500,
}

const $decline: ViewStyle = {
  backgroundColor: colors.transparent,
  borderColor: colors.palette.neutral300,
}

const $declineText: TextStyle = {
  color: colors.textDim,
}

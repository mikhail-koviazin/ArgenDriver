import React, { FC, useState } from "react"
import { Platform, TextStyle, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../../components"
import { DemoTabScreenProps } from "../../navigators/DemoNavigator"
import { spacing } from "../../theme"
import { Picker } from "@react-native-picker/picker"

export const StartTestScreen: FC<DemoTabScreenProps<"StartTest">> = function StartTestScreen(
  _props,
) {
  const [questionsCount, setQuestionsCount] = useState(20)

  // function onQuestionCountChanged (text: string) {
  //   const numberTxt = text.replace(/[^0-9]/g, '');
  //   try {
  //     const number = parseInt(numberTxt);
  //     if (number < 10) {
  //       setQuestionsCount('10');
  //       return;
  //     }
  //     if (number > 100) {
  //       setQuestionsCount('100');
  //       return;
  //     }
  //     setQuestionsCount(number.toString());
  //   } catch (e) {
  //
  //   }
  // }

  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <Text preset="heading" tx="startTestScreen.title" style={$title} />
      <Text tx="startTestScreen.subtitle" style={$tagline} />

      <Picker
        selectedValue={questionsCount}
        onValueChange={(value) => setQuestionsCount(value)}
        mode="dropdown"
        style={[$picker, Platform.OS === "web" && $pickerWebOnly]}
      >
        <Picker.Item label="20" value={20} />
        <Picker.Item label="40" value={40} />
        <Picker.Item label="80" value={80} />
      </Picker>

      {/* <TextField */}
      {/*   value={questionsCount} */}
      {/*   onChangeText={onQuestionCountChanged} */}
      {/*   status="error" */}
      {/*   label="Questions" */}
      {/*   keyboardType="numeric" */}
      {/*   labelTx="login.nameLabel" */}
      {/*   labelTxOptions={{ name: "John" }} */}
      {/*   LabelTextProps={{ style: { color: "#FFFFFF" } }} */}
      {/*   RightAccessory={() => <Icon icon="check" />} */}
      {/*   LeftAccessory={() => <Icon icon="bell" />} */}
      {/* /> */}

      <Button
        tx="startTestScreen.startButton"
        onPress={() => _props.navigation.push("Test", { questionsCount })}
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

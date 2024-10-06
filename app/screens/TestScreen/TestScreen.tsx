import { openComposer } from "react-native-email-link";
import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, Modal, Platform, Linking } from "react-native"
import { Button, Header, Icon, Screen, Text } from "app/components"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { colors, spacing } from "app/theme"
import questions from "../../questions.json"
import { Question } from "app/models/Question"
import { questionImages } from "app/screens/TestScreen/question_images/questionImages"
import { i18n, translate } from "app/i18n"
import { navigate } from "app/navigators"

enum Answer {
  CORRECT = "CORRECT",
  INCORRECT = "INCORRECT",
  PASS = "PASS",
}

export const TestScreen: FC<DemoTabScreenProps<"Test">> = function TestScreen({
  navigation,
  route,
}) {
  const { questionsCount, forceQuestion } = route.params

  const [lang, setLang] = useState<"ru" | "en" | "es">("es")
  const [modalVisible, setModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
  const [curQuestionNum, setCurQuestionNum] = useState(0)
  const [answer, setAnswer] = useState<number | undefined>(undefined);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    // setSelectedQuestions([questions[77], questions[6]]);
    // return;
    if (forceQuestion) {
      setSelectedQuestions([questions[forceQuestion]]);
      return;
    }
    const selectedQuestions = questions
      .map((question, index) => (question ? { ...question, num: index } : question))
      .sort(() => Math.random() - 0.5)
      .slice(0, questionsCount)
    setSelectedQuestions(selectedQuestions)
  }, [forceQuestion])

  useEffect(() => {
    setLang("es")
    setAnswer(undefined)
  }, [curQuestionNum])

  const curQuestion = selectedQuestions[curQuestionNum]

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <Header
          title={translate("testScreen.header", {
            curQuestion: curQuestionNum + 1,
            count: selectedQuestions.length,
            num: curQuestion?.num
          })}
          leftIcon="back"
          onLeftPress={() => navigation.pop()}
        />
      ),
      gestureEnabled: false,
    })
  }, [curQuestionNum, curQuestion, selectedQuestions])

  useEffect(() =>
    navigation.addListener("beforeRemove", (e: any) => {
      if (curQuestionNum === 0 && !answer) {
        return;
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      setModalVisible(true)
    }),
    [navigation, curQuestionNum, answer]
  );

  if (!curQuestion) {
    return;
  }

  const imageLocalUri = curQuestion.img
    // @ts-ignore
    ? questionImages[curQuestion.img.split("/").pop()?.split(".")[0] as string]
    : ""

  return (
    <Screen preset="scroll" style={$container} contentContainerStyle={$innerContainer} safeAreaEdges={["bottom"]} ScrollViewProps={{alwaysBounceVertical: false}}>
      <Text preset="default" text={curQuestion.text[lang]} size="md" style={$question} />

      <View style={$questionImageContainer}>
        {imageLocalUri ? <Image source={imageLocalUri} style={$questionImage} /> : undefined}
      </View>


      <View style={$prevNextContainer}>
        <Button
            tx="testScreen.openErrorModalButton"
            LeftAccessory={(props) => (
                <Icon containerStyle={props.style} icon="ladybug" />
            )}
            onPress={() => {
              setErrorModalVisible(true);
            }}
            style={$prevNextBtn}
        />
        <Button
            tx={lang !== "es" ? "testScreen.hideTranslationButton" : undefined}
            LeftAccessory={(props) => (
                <Icon containerStyle={props.style} icon="translation" />
            )}
            onPress={() => {
              setLang(
                  lang === "es"
                      ? (i18n.locale.includes("ru") ? "ru" : "en")
                      : "es")
            }}
            style={$prevNextBtn}
        />
      </View>

      <View style={$answersContainer}>
        {curQuestion.responses.map((response, index) => (
          <Button
            key={index}
            text={response.text[lang]}
            onPress={() => {
              setAnswer(index);
              setAnswers((answers) => [...answers, response.correct ? Answer.CORRECT : Answer.INCORRECT]);
            }}
            disabled={answer !== undefined}
            style={
              answer === index
                ? response.correct
                  ? $correctAnswerBtn
                  : $incorrectAnswerBtn
                : typeof answer === "number" && response.correct
                ? $correctAnswerBtn
                : {}
            }
          />
        ))}
      </View>

      {/* <View style={$prevNextContainer}> */}
      {/*   <Button */}
      {/*     tx="testScreen.prevButton" */}
      {/*     onPress={() => setCurQuestionNum((val) => val - 1)} */}
      {/*     disabled={curQuestionNum === 0} */}
      {/*     style={$prevNextBtn} */}
      {/*   /> */}

      {/*   <Button */}
      {/*     tx="testScreen.nextButton" */}
      {/*     onPress={() => setCurQuestionNum((val) => val + 1)} */}
      {/*     disabled={curQuestionNum === Math.min(questionsCount - 1, questions.length)} */}
      {/*     style={$prevNextBtn} */}
      {/*   /> */}
      {/* </View> */}


      {typeof answer === "undefined" && (
        <Button
          tx="testScreen.passButton"
          onPress={() => {
            setAnswer(-1);
            setAnswers((answers) => [...answers, Answer.PASS]);
          }}
          style={{
            backgroundColor: colors.palette.accent100,
            borderColor: colors.palette.accent300,
          }}
        />
      )}

      {typeof answer === "number" &&
        (curQuestionNum < selectedQuestions.length - 1 ? (
          <Button
            tx="testScreen.nextButton"
            RightAccessory={(props) => <Icon containerStyle={props.style} icon="caretRight" />}
            onPress={() => setCurQuestionNum((val) => val + 1)}
            disabled={curQuestionNum === Math.min(questionsCount - 1, questions.length)}
            style={{
              backgroundColor: colors.palette.neutral300,
              borderColor: colors.palette.neutral500,
            }}
          />
        ) : (
          <Button
            tx="testScreen.finishTestButton"
            onPress={() => setModalVisible(true)}
            style={{
              backgroundColor: colors.palette.secondary100,
              borderColor: colors.palette.secondary300,
            }}
          />
        ))}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          navigate("StartTest")
        }}>
        <View style={$centeredView}>
          <View style={$modalView}>
            <Text preset="subheading" tx="testScreen.resultModalTitle" />
            <View style={$resultsView}>
              <View style={$resultBlock}>
                <Text tx="testScreen.resultModalCorrectAnswersLabel" />
                <Text>
                  {answers.filter((answer) => answer === Answer.CORRECT).length}
                </Text>
              </View>
              <View style={$resultBlock}>
                <Text tx="testScreen.resultModalIncorrectAnswersLabel" />
                <Text>
                  {answers.filter((answer) => answer === Answer.INCORRECT).length}
                </Text>
              </View>
              <View style={$resultBlock}>
                <Text tx="testScreen.resultModalPassedAnswersLabel" />
                <Text>
                  {answers.filter((answer) => answer === Answer.PASS).length}
                </Text>
              </View>
              <View style={$resultBlock}>
                <Text tx="testScreen.resultModalTotalAnswersLabel" />
                <Text>
                  {selectedQuestions.length}
                </Text>
              </View>
            </View>
            <Button
              onPress={() =>
                navigate("StartTest")
              }
            >
              <Text tx="testScreen.resultModalCloseButton" />
            </Button>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => {
          setErrorModalVisible(false)
        }}>
        <View style={$centeredView}>
          <View style={$modalView}>
            <Text preset="subheading" tx="testScreen.errorModalTitle" />
            {
              ([
                    [
                        "testScreen.errorModalIncorrectTranslation",
                        "[ArgenDriver-BUG]",
                        `[${curQuestion.num}] Incorrect translation\r\n\r\nQuestion:\r\n - ${curQuestion.text.es}\r\n - ${curQuestion.text[lang]}\r\n\r\n${curQuestion.responses.map((response) => ` - ${response.text.es}\r\n - ${response.text[lang]}`).join("\r\n\r\n")}\r\n\r\nYou may write more details here...`
                    ],
                    [
                        "testScreen.errorModalIncorrectImage",
                        "[ArgenDriver-BUG]",
                        `[${curQuestion.num}] Incorrect image\r\n\r\nQuestion:\r\n - ${curQuestion.text.es}\r\n\r\nImage: ${curQuestion.img}\r\n\r\nYou may write more details here...`
                    ],
                    [
                        "testScreen.errorModalIncorrectCorrectAnswerSpanish",
                        "[ArgenDriver-BUG]",
                        `[${curQuestion.num}] Incorrect correct answer (Spanish)\r\n\r\nQuestion:\r\n - ${curQuestion.text.es}\r\n\r\n${curQuestion.responses.map((response) => ` - ${response.text.es}\r\n - ${response.correct ? "correct" : "incorrect"}`).join("\r\n\r\n")}\r\n\r\nYou may write more details here...`
                    ],
                    [
                        "testScreen.errorModalIncorrectOther",
                        "[ArgenDriver-BUG]",
                        `[${curQuestion.num}] Other\r\n\r\nPlease describe the issue here (don't delete question number above)`
                    ],
              ] as const).map(([tx, subject, body], i) => (
                <Button
                  key={i}
                  tx={tx}
                  onPress={() => {
                    if (Platform.OS === "web") {
                        // const hiddenElement = document.createElement('a');
                        // hiddenElement.href = `mailto:mikhail.koviazin+argen-driver-bug@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replaceAll(/\?/g, "¿"))}`;
                        // console.log(hiddenElement.href);
                        // hiddenElement.target = '_blank';
                        // hiddenElement.click();
                        Linking.openURL(`mailto:mikhail.koviazin+argen-driver-bug@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replaceAll(/\?/g, "¿"))}`);
                    } else {
                      openComposer({
                        to: "mikhail.koviazin+argen-driver-bug@gmail.com",
                        subject,
                        body: body.replaceAll(/\?/g, "¿")
                      });
                    }
                    setErrorModalVisible(false);
                  }}
                />
              ))
            }
            <Button
                tx="testScreen.errorModalCloseButton"
                onPress={() => {
                  setErrorModalVisible(false);
                }}
            />
          </View>
        </View>
      </Modal>

    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1
}

const $innerContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  display: "flex",
  gap: spacing.md,
  flexGrow: 1
}

const $question: TextStyle = {
  textAlign: "center",
}

const $questionImageContainer: ImageStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 200,
}

const $questionImage: ImageStyle = {
  width: "100%",
  height: "100%",
  resizeMode: "contain",
}

const $prevNextContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
}

const $prevNextBtn: ViewStyle = {
  width: "48%"
}

const $answersContainer: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: spacing.sm,
}

const $correctAnswerBtn: ViewStyle = {
  backgroundColor: "rgba(21,115,71,0.3)",
}

const $incorrectAnswerBtn: ViewStyle = {
  backgroundColor: "rgba(220,53,69,0.3)",
}

const $centeredView: ViewStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}

const $modalView: ViewStyle = {
  backgroundColor: 'white',
  borderRadius: 8,
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.lg,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xl,
}

const $resultsView: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
}

const $resultBlock: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: spacing.sm,
}

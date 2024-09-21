const en = {
  errorScreen: {
    title: "Something went wrong!",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  demoNavigator: {
    startTestTab: "Test",
  },
  startTestScreen: {
    title: "Start test",
    subtitle: "Choose amount of questions and start the test.",
    questionsCount: "Questions:",
    startButton: "Start test",
  },
  testScreen: {
    header: "Question %{curQuestion}/%{count} (#%{num})",
    showTranslationButton: "show translation",
    hideTranslationButton: "hide translation",
    prevButton: "Prev",
    nextButton: "Next",
    passButton: "Pass",
    stopButton: "Stop test",
    finishTestButton: "Finish test",
    resultModalTitle: "Test results",
    resultModalCorrectAnswersLabel: "Correct answers:",
    resultModalIncorrectAnswersLabel: "Incorrect answers:",
    resultModalPassedAnswersLabel: "Passed:",
    resultModalTotalAnswersLabel: "Total answers:",
    resultModalCloseButton: "close",
    openErrorModalButton: "Report an issue",
    errorModalTitle: "Select type of issue",
    errorModalIncorrectTranslation: "Incorrect translation",
    errorModalIncorrectImage: "Incorrect image",
    errorModalIncorrectCorrectAnswerSpanish: "Incorrect correct answer (only for Spanish)",
    errorModalIncorrectOther: "Other",
    errorModalCloseButton: "close",
  },
}

export default en
export type Translations = typeof en

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
  },
}

export default en
export type Translations = typeof en

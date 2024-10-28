export type ChangelogEntry = {
    version: string
    date: string
    list: string[]
}

const en = {
  errorScreen: {
    title: "Something went wrong!",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  demoNavigator: {
    startTestTab: "Test",
    changeLogTab: "Changelog",
  },
  startTestScreen: {
    title: "Start test",
    subtitle: "Choose amount of questions and start the test.",
    questionsCount: "Questions:",
    startButton: "Start test",
  },
  changelogScreen: {
    title: "Changelog",
    changes: [
      {
        version: "0.0.1",
        date: "20.09.2024",
        list: [
          "Implemented test passing"
        ]
      },
      {
        version: "0.0.2",
        date: "20.09.2024",
        list: [
          "Set up deploy to Vercel and bind domain"
        ]
      },
      {
        version: "0.0.3",
        date: "21.09.2024",
        list: [
          "Added statistics after passing the test",
          "Added feedback",
          "Added language switch for test translation",
        ]
      },
      {
        version: "0.0.4",
        date: "22.09.2024",
        list: [
          "Feedback fixes",
        ]
      },
      {
        version: "1.0.0",
        date: "23.09.2024",
        list: [
          "Release",
          "Translation fixes",
        ]
      },
      {
        version: "1.0.1",
        date: "06.10.2024",
        list: [
          "Fix images on small screens",
          "Added changelog",
          "Translation fixes",
        ]
      },
      {
        version: "1.0.2",
        date: "28.10.2024",
        list: [
          "Translation fixes",
        ]
      },
    ] as ChangelogEntry[],
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

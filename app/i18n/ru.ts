import { Translations } from "app/i18n/en"

const ru: Translations = {
  errorScreen: {
    title: "Что-то пошло не так!",
    reset: "Перезапустить приложение",
    traceTitle: "Error from %{name} stack",
  },
  demoNavigator: {
    startTestTab: "Тест",
  },
  startTestScreen: {
    title: "Начать тест",
    subtitle: "Выберите количество вопросов и начните тест.",
    questionsCount: "Количество вопросов:",
    startButton: "Начать тест",
  },
  testScreen: {
    header: "Вопрос %{curQuestion}/%{count} (№%{num})",
    showTranslationButton: "показать",
    hideTranslationButton: "скрыть",
    prevButton: "предыдущий",
    nextButton: "следующий",
    passButton: "пропустить",
    stopButton: "прервать тест",
    finishTestButton: "завершить тест",
    resultModalTitle: "Результаты теста",
    resultModalCorrectAnswersLabel: "Верных ответов:",
    resultModalIncorrectAnswersLabel: "Неверных ответов:",
    resultModalPassedAnswersLabel: "Пропущено:",
    resultModalTotalAnswersLabel: "Всего вопросов:",
    resultModalCloseButton: "закрыть",
    openErrorModalButton: "Сообщить о проблеме",
    errorModalTitle: "Выберите тип проблемы",
    errorModalIncorrectTranslation: "Неверный перевод",
    errorModalIncorrectImage: "Неверная картинка",
    errorModalIncorrectCorrectAnswerSpanish: "Неверный правильный ответ (только для испанского)",
    errorModalIncorrectOther: "Другое",
    errorModalCloseButton: "закрыть",
  },
}

export default ru;

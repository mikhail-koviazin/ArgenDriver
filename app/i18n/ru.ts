import { Translations } from "app/i18n/en"

const ru: Translations = {
  errorScreen: {
    title: "Что-то пошло не так!",
    reset: "Перезапустить приложение",
    traceTitle: "Error from %{name} stack",
  },
  demoNavigator: {
    startTestTab: "Тест",
    changeLogTab: "История изменений",
  },
  startTestScreen: {
    title: "Начать тест",
    subtitle: "Выберите количество вопросов и начните тест.",
    questionsCount: "Количество вопросов:",
    startButton: "Начать тест",
  },
  changelogScreen: {
    title: "История изменений",
    changes: [
        {
            version: "0.0.1",
            date: "20.09.2024",
            list: [
                "Реализовано прохождение теста"
            ]
        },
        {
            version: "0.0.2",
            date: "20.09.2024",
            list: [
                "Настроен деплой на Vercel и привязан домен"
            ]
        },
        {
            version: "0.0.3",
            date: "21.09.2024",
            list: [
                "Добавлена статистика после прохождения теста",
                "Добавлена обратная связь",
                "Добавлено переключение языка перевода теста",
            ]
        },
        {
            version: "0.0.4",
            date: "22.09.2024",
            list: [
                "Фиксы по обратной связи",
            ]
        },
        {
            version: "1.0.0",
            date: "23.09.2024",
            list: [
                "Релиз",
                "Исправления в переводах",
            ]
        },
        {
            version: "1.0.1",
            date: "06.10.2024",
            list: [
                "Фикс картинок на маленьких экранах",
                "Исправления в переводах",
            ]
        },
        {
            version: "1.0.2",
            date: "06.10.2024",
            list: [
                "Исправления в переводах",
            ]
        },
    ]
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

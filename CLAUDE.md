# ArgenDriver

Приложение для подготовки к экзамену по ПДД Аргентины (React Native + Expo). Вопросы на испанском с переводом на русский/английский. Деплоится как веб-приложение (Vercel) и как мобильное приложение (Android/iOS).

## Стек

- **React Native + Expo ~51** - web, Android, iOS
- **React Navigation** - bottom tabs (`MainNavigator`) + native stack (`AppNavigator`)
- **MobX State Tree** - персистентное состояние через AsyncStorage (язык интерфейса, настройки)
- **Firebase** - аналитика и crashlytics. На Android/iOS через `@react-native-firebase`, на web через Firebase JS SDK
- **i18n-js** - UI на EN/RU; контент вопросов на ES/EN/RU
- **Vercel** - деплой веба на push в master

## Запуск

```bash
yarn start          # Expo dev server (web/Android/iOS)
yarn web            # Веб в браузере
yarn android        # Android
yarn ios            # iOS

# Веб деплоится Vercel'ом автоматически на push в master.
# Скрипт yarn deploy (gh-pages) и ветка origin/gh-pages - легаси, не использовать.
```

## Структура

```
app/
  components/        # UI-компоненты (Button, Text, Screen, Icon, TelemetryConsentPrompt, ...)
  config/            # Конфиги dev/prod
  i18n/
    en.ts            # Английские переводы UI
    ru.ts            # Русские переводы UI
    i18n.ts          # Инициализация i18n-js, setLanguage()
  models/
    RootStore.ts     # Корневой MST-стор
    SettingsStore.ts # Язык интерфейса, согласие на телеметрию
    helpers/         # setupRootStore (AsyncStorage persistence), useStores
  navigators/
    AppNavigator.tsx # Корневой стек-навигатор
    MainNavigator.tsx# Bottom-tabs (StartTest, Changelog, Settings)
  screens/
    TestScreen/
      StartTestScreen.tsx     # Экран выбора кол-ва вопросов и запуска теста
      TestScreen.tsx          # Основной экран теста
    Changelog/
      ChangelogScreen.tsx     # История изменений
    SettingsScreen/
      SettingsScreen.tsx      # Язык интерфейса + тоггл аналитики
    ErrorScreen/              # Обработка ошибок (ErrorBoundary)
  services/
    telemetry/       # Обёртка над Firebase, platform-split .ts/.web.ts
  theme/             # Цвета, шрифты, отступы
  utils/             # AsyncStorage, openLinkInBrowser, useSafeArea и др.
  app.tsx            # Корневой компонент (шрифты, навигация, MST init)
App.tsx              # Expo entry point (SplashScreen)
docs/
  telemetry.md       # Схема событий, согласие, настройка Firebase
```

## Данные

- Вопросы и картинки живут в отдельном репозитории и подключены пакетом `argendriver-data` (`github:mikhail-koviazin/ArgenDriver-Data`)
- Всё бандлится локально для офлайн-работы
- Вопросы: `{ num, text: {es,en,ru}, img?, responses: [{text:{es,en,ru}, correct?}], explanation: {text:{es,en,ru}}, citation? }`

## Экраны

| Экран | Описание |
|-------|----------|
| StartTestScreen | Выбор кол-ва вопросов (20/40/80), старт теста |
| TestScreen | Вопрос, картинка, ответы, перевод (ES↔EN/RU), баг-репорт |
| ChangelogScreen | История версий |
| SettingsScreen | Язык интерфейса (EN/RU), тоггл аналитики Firebase |

## Телеметрия

Аналитика и Crashlytics работают на всех платформах и включаются только по согласию пользователя. Приложение спрашивает один раз при первом запуске, ответ меняется в SettingsScreen. Рекламные согласия не выдаются никогда. Подробности, схема событий и настройка - в `docs/telemetry.md`.

## Планы / известные вещи

- Испанский UI не реализован (контент тестов только на ES)
- Ключи Firebase не ограничены в Google Cloud Console
- Нативные сборки с Firebase ни разу не собирались

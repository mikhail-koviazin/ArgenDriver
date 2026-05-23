# ArgenDriver

Приложение для подготовки к экзамену по ПДД Аргентины (React Native + Expo). Вопросы на испанском с переводом на русский/английский. Деплоится как веб-приложение (GitHub Pages) и как мобильное приложение (Android/iOS).

## Стек

- **React Native + Expo ~51** — web, Android, iOS
- **React Navigation** — bottom tabs (`MainNavigator`) + native stack (`AppNavigator`)
- **MobX State Tree** — персистентное состояние через AsyncStorage (язык интерфейса, настройки)
- **Firebase (RN)** — аналитика, crashlytics (только нативные платформы, не web)
- **i18n-js** — UI на EN/RU; контент вопросов на ES/EN/RU
- **Expo + gh-pages** — деплой веба

## Запуск

```bash
yarn start          # Expo dev server (web/Android/iOS)
yarn web            # Веб в браузере
yarn android        # Android
yarn ios            # iOS
yarn deploy         # Деплой на GitHub Pages
```

## Структура

```
app/
  components/        # UI-компоненты (Button, Text, Screen, Icon, ...)
  config/            # Конфиги dev/prod
  i18n/
    en.ts            # Английские переводы UI
    ru.ts            # Русские переводы UI
    i18n.ts          # Инициализация i18n-js, setLanguage()
  models/
    RootStore.ts     # Корневой MST-стор
    SettingsStore.ts # Язык интерфейса, флаг аналитики
    helpers/         # setupRootStore (AsyncStorage persistence), useStores
  navigators/
    AppNavigator.tsx # Корневой стек-навигатор
    MainNavigator.tsx# Bottom-tabs (StartTest, Changelog, Settings)
  screens/
    TestScreen/
      StartTestScreen.tsx     # Экран выбора кол-ва вопросов и запуска теста
      TestScreen.tsx          # Основной экран теста
      question_images/        # 275+ локальных JPG (b1.jpg ... b275.jpg)
      question_images/questionImages.ts  # Маппинг key → require()
    Changelog/
      ChangelogScreen.tsx     # История изменений
    SettingsScreen/
      SettingsScreen.tsx      # Язык интерфейса + тоггл аналитики
    ErrorScreen/              # Обработка ошибок (ErrorBoundary)
  theme/             # Цвета, шрифты, отступы
  utils/             # AsyncStorage, openLinkInBrowser, useSafeArea и др.
app.tsx              # Корневой компонент (шрифты, навигация, MST init)
App.tsx              # Expo entry point (SplashScreen)
app/questions.json   # Все вопросы (~275 шт., es/en/ru, с картинками)
```

## Данные

- **questions.json** — весь контент бандлится локально для офлайн-работы
- **question_images/** — 275+ JPG бандлятся через require() для офлайн-работы
- Вопросы: `{ num, text: {es,en,ru}, img?, responses: [{text:{es,en,ru}, correct?}], explanation: {text:{es,en,ru}}, citation? }`

## Экраны

| Экран | Описание |
|-------|----------|
| StartTestScreen | Выбор кол-ва вопросов (20/40/80), старт теста |
| TestScreen | Вопрос, картинка, ответы, перевод (ES↔EN/RU), баг-репорт |
| ChangelogScreen | История версий |
| SettingsScreen | Язык интерфейса (EN/RU), тоггл аналитики Firebase |

## Аналитика

Firebase Analytics используется только на нативных платформах. На web недоступна. Пользователь явно включает её в SettingsScreen (opt-in, по умолчанию отключена).

## Планы / известные вещи

- Вопросы и картинки планируется вынести в отдельный GitHub-репозиторий как зависимость (чтобы коммиты с правками вопросов не засоряли основной репо)
- Испанский UI не реализован (контент тестов только на ES)

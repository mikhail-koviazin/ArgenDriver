# Телеметрия

Аналитика и отчеты о падениях. Общий принцип: **opt-in**. По умолчанию не отправляется ничего, включается тумблером в SettingsScreen ("Помочь улучшить приложение").

## Устройство

Весь SDK спрятан за одним модулем `app/services/telemetry`. Экраны импортируют только его и никогда не трогают Firebase напрямую.

| Файл | Назначение |
|------|-----------|
| `types.ts` | Контракт: список событий с параметрами, `ErrorType`. Общий для обеих платформ |
| `telemetry.ts` | Реализация для Android/iOS на `@react-native-firebase` |
| `telemetry.web.ts` | Реализация для веба на Firebase JS SDK |
| `webConfig.ts` | Публичный Firebase-конфиг веб-приложения |
| `index.ts` | Точка входа, Metro сам подставляет `.web.ts` на вебе |

Metro резолвит `./telemetry` в `telemetry.web.ts` при сборке под web и в `telemetry.ts` в остальных случаях. TypeScript всегда видит только нативный файл, поэтому **экспорты двух реализаций обязаны совпадать**: расхождение TS не поймает, оно проявится только на вебе в рантайме.

### API

```ts
setTelemetryEnabled(value: boolean): Promise<void>   // применить выбор пользователя
logEvent(name, params?): Promise<void>               // имена и параметры типизированы через AnalyticsEvents
logScreenView(screenName: string): Promise<void>
reportCrash(error: Error, type?: ErrorType): void
```

Ни один из них не бросает исключений: Firebase падает, если нативная сборка собрана без `google-services.json`, и ронять из-за этого приложение незачем. Ошибки SDK логируются в консоль только в `__DEV__`.

Согласие применяется в двух местах:

- `app/app.tsx` - один раз за запуск, после регидратации стора
- `SettingsScreen` - при переключении тумблера

## Что отправляется

Экраны, `screen_view` через `onNavigationStateChange` в `navigationUtilities.ts`, плюс события:

| Событие | Параметры | Когда |
|---------|-----------|-------|
| `test_started` | `questions_count` | Нажата кнопка старта теста |
| `test_completed` | `questions_count`, `correct`, `incorrect`, `passed` | Отвечены все вопросы, открыт модал результата |
| `test_abandoned` | `questions_count`, `answered` | Пользователь вышел из теста, не дойдя до конца |
| `question_answered` | `question_num`, `result` (`correct`/`incorrect`/`passed`) | Ответ на вопрос, включая пропуск |
| `translation_shown` | `language` | Показан перевод вопроса |
| `bug_report_started` | `kind`, `question_num` | Выбран тип бага в модале репорта |
| `language_changed` | `language` | Смена языка интерфейса |
| `telemetry_opt_in` | - | Включена телеметрия |

Симметричного `telemetry_opt_out` нет намеренно: после отключения отправлять уже ничего нельзя.

Персональных данных нет: ни идентификаторов, ни текста, введенного пользователем. `question_num` - индекс вопроса в `questions.json`, он отсутствует, если вопрос открыт напрямую по номеру.

Ограничения GA4, которых надо держаться: имена событий и параметров в snake_case, до 40 символов, начинаются с буквы; строковые значения до 100 символов. Имя `screen_view` зарезервировано, для него есть `logScreenView`.

## Crashlytics

Только на нативных платформах и только в проде: в `__DEV__` `reportCrash` пишет в консоль, чтобы красный экран и Reactotron оставались основным сигналом. Вызывается из `ErrorBoundary`. Сбор включается тем же тумблером, что и аналитика.

На вебе Crashlytics нет, `reportCrash` пишет в консоль браузера.

## Настройка Firebase

Автосбор выключен в `firebase.json` (`analytics_auto_collection_enabled: false`), иначе Firebase начал бы слать события до того, как пользователь дал согласие.

Нативные сборки требуют файлов конфигурации в корне репозитория, они прописаны в `app.json`:

- `google-services.json` - Android
- `GoogleService-Info.plist` - iOS

Без них приложение соберется и запустится, но телеметрия будет молча выключена. Файлы не секретные (Google явно это документирует), но у публичного репозитория стоит ограничить API-ключи по package name и SHA-1 в Google Cloud Console.

Конфиг веба лежит в `webConfig.ts` и попадает в JS-бандл в открытом виде - это нормально по дизайну Firebase JS SDK. Без `measurementId` (появляется только после привязки Google Analytics к проекту) веб-телеметрия остается выключенной.

Плагины `@react-native-firebase/app` и `@react-native-firebase/crashlytics` подключены в `app.json`; для iOS там же выставлен `useFrameworks: "static"`, без него Firebase не собирается. После изменения этих настроек нужен `yarn prebuild:clean`.

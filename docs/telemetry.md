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

Проект: **`argendriver-81b35`** (аккаунт mikhail.koviazin@gmail.com). Приложения: Android и iOS с идентификатором `com.argendriver`, плюс web.

Автосбор выключен в `firebase.json` (`analytics_auto_collection_enabled: false`), иначе Firebase начал бы слать события до того, как пользователь дал согласие.

### Ключи не в репозитории

Репозиторий публичный, поэтому ни один файл с конфигом Firebase в него не коммитится. Формально эти значения не секреты (Google это документирует, а веб-конфиг вообще уезжает в JS-бандл к каждому посетителю), но отдавать ботам-скреперам живые ключи незачем.

Что нужно разложить локально, чтобы собрать с работающей телеметрией:

| Файл | Откуда взять | Для чего |
|------|--------------|----------|
| `google-services.json` | Firebase console -> Project settings -> Your apps -> Android | Android-сборка |
| `GoogleService-Info.plist` | там же, iOS-приложение | iOS-сборка |
| `.env` | скопировать `.env.example`, заполнить из Web app -> SDK setup | веб-сборка |

Все три в `.gitignore`. Веб читает `.env` через `EXPO_PUBLIC_*` (Expo подставляет их на этапе сборки, см. `webConfig.ts`), нативные пути разрешает `app.config.ts`.

Быстрый способ достать заново, если CLI авторизован:

```bash
firebase apps:list --project argendriver-81b35
firebase apps:sdkconfig ANDROID <appId> --out google-services.json
firebase apps:sdkconfig IOS <appId> --out GoogleService-Info.plist
firebase apps:sdkconfig WEB <appId>          # значения для .env
```

### Как это разрешается при сборке

`app.config.ts` ищет нативный конфиг сначала в переменных `GOOGLE_SERVICES_JSON` и `GOOGLE_SERVICES_PLIST`, потом в корне репозитория. Плагины `@react-native-firebase/app` и `@react-native-firebase/crashlytics` подключаются **только если файл нашелся**: сам плагин падает на отсутствующем конфиге, а свежий клон репозитория должен собираться без всякого Firebase. Если файла нет, в лог уходит предупреждение и сборка идет дальше с выключенной телеметрией.

Поэтому же плагины и пути живут в `app.config.ts`, а не в `app.json`: в статическом конфиге их не сделать условными. В `app.json` остался только `useFrameworks: "static"` для iOS, без него Firebase не собирается. После правок в этих настройках нужен `yarn prebuild:clean`.

### EAS

EAS отдает сборщику только закоммиченные файлы, поэтому нативные конфиги надо завести как переменные типа file, а веб-значения как обычные переменные:

```bash
eas env:create --scope project --name GOOGLE_SERVICES_JSON  --type file --value ./google-services.json
eas env:create --scope project --name GOOGLE_SERVICES_PLIST --type file --value ./GoogleService-Info.plist
```

EAS кладет файл во временный путь и передает этот путь в переменной, что `app.config.ts` и ожидает. Веб через EAS не собирается (он едет в Vercel), так что `EXPO_PUBLIC_*` там не нужны.

### Vercel

Веб-прод собирается в Vercel, а `.env` в репозиторий не попадает, поэтому те же семь `EXPO_PUBLIC_FIREBASE_*` заведены в переменных окружения проекта `argen-driver` (Production). Значения подставляются на этапе сборки, так что после их изменения нужен redeploy - сам по себе Vercel не пересоберет. Preview-окружение намеренно оставлено без них: тестовые заходы не пачкают статистику.

### Ограничение ключей

Стоит ограничить сами ключи в Google Cloud Console -> APIs & Services -> Credentials: Android-ключ по package name `com.argendriver` и SHA-1 подписи, веб-ключ по HTTP-референеру `argen-driver.koviazin.dev`. Тогда утечка ключа перестает что-либо значить.

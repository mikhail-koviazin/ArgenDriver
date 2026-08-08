# ArgenDriver

Practice app for the Argentine driving theory exam. Questions are shown in the original Spanish, with a translation to Russian or English one tap away, so you learn the wording you will actually meet on the exam instead of a paraphrase of it.

**[argen-driver.koviazin.dev](https://argen-driver.koviazin.dev)** - runs in the browser, no install needed. Also builds as an Android and iOS app.

## What it does

- Practice runs of 20, 40 or 80 questions drawn at random from the full bank
- Every question in Spanish, English and Russian; the translation is hidden by default and revealed per question
- Immediate feedback on each answer, with a summary at the end
- Ability to skip a question rather than guess
- Works fully offline: questions and images are bundled, nothing is fetched at runtime
- Report a wrong translation, image or answer key straight from the question
- Interface in English or Russian
- Changelog inside the app

## Running it

```bash
yarn install
yarn web          # browser
yarn android      # Android device or emulator
yarn ios          # iOS simulator (macOS only)
yarn start        # Expo dev server, pick a platform from there
```

Checks:

```bash
yarn compile      # TypeScript
yarn lint         # ESLint and Prettier
yarn test         # Jest
```

Deploying the web build to GitHub Pages is `yarn deploy`.

## How it is put together

Expo (SDK 51) and React Native, one codebase for web, Android and iOS. React Navigation for a bottom-tab layout inside a native stack, MobX State Tree for settings persisted through AsyncStorage, i18n-js for the interface, Firebase for analytics and crash reporting.

```
app/
  components/    UI primitives
  i18n/          interface strings, EN and RU
  models/        MobX State Tree stores
  navigators/    navigation and screen tracking
  screens/       StartTest, Test, Changelog, Settings, Error
  services/      telemetry
  theme/         colours, fonts, spacing
docs/            design notes
```

Questions and their images live in a separate repository, [ArgenDriver-Data](https://github.com/mikhail-koviazin/ArgenDriver-Data), pulled in as a dependency. Content fixes land there and do not clutter this repository's history.

## Privacy

Analytics and crash reporting are off until you switch them on in Settings. Nothing is sent before that, and nothing personal is sent after: no identifiers, no text you typed. See [docs/telemetry.md](docs/telemetry.md) for the exact list of events and for how to configure Firebase when building yourself. Without that configuration the app builds and runs normally, just without telemetry.

## Found a bad question?

Use the ladybug button on the question itself. It opens a pre-filled email with the question number and its text, which is far easier to act on than a description from memory.

## Author

Mikhail Koviazin, <mikhail.koviazin@gmail.com>

Built on the [Ignite](https://github.com/infinitered/ignite) boilerplate.

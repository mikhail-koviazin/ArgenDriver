---
description: Launch ArgenDriver in the browser for testing
---

# Run ArgenDriver (web)

Start the Expo web dev server:

```bash
npx expo start --web --port 8082
```

The app will be available at http://localhost:8082.

For screenshots/automated testing use Playwright (installed locally):

```js
// test-pw.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:8082', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(4000);
await page.screenshot({ path: 'screenshot.png' });
await browser.close();
```

Run with: `node test-pw.mjs`

Note: on first run, install Playwright chromium with `npx playwright@1.49.0 install chromium`.

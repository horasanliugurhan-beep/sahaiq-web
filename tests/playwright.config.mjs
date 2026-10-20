// Browser smoke tests for the static site (the same files GitHub Pages serves).
// Run from this folder: `npm install && npx playwright install chromium && npm test`.
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.mjs",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  // Optional local Chromium for cloud machines with browser downloads blocked.
  // CI keeps the pinned Playwright browser when the variable is absent.
  use: { launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}, baseURL: "http://127.0.0.1:4174", locale: "tr-TR" },
  webServer: { command: "node serve.mjs ..", url: "http://127.0.0.1:4174", reuseExistingServer: !process.env.CI },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

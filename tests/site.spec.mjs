// Browser smoke tests for sahaiq.app: every page loads cleanly, works at phone
// width, passes axe, and the "Yeniden sırala" button is usable from the keyboard.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/sss.html", "/hakkinda.html", "/sahaiq-nasil-kurdum.html", "/gizlilik.html"];
const PRIORITY = ["#1", "#2", "#8", "#18", "#19", "#24"]; // final order in the hero queue

// External requests (Google Fonts) are answered empty so tests don't depend on
// the network; any other failure or console error fails the test.
test.beforeEach(async ({ page }, info) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.fulfill({ status: 200, body: "" }));
  info.errors_ = errors;
});
test.afterEach(async ({}, info) => {
  expect(info.errors_, "konsol veya sayfa hatası").toEqual([]);
});

for (const path of PAGES) {
  test(`${path} loads, links resolve, JSON-LD parses`, async ({ page, request }) => {
    const res = await page.goto(path);
    expect(res.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    // Every local link and stylesheet must exist.
    const local = await page.$$eval("a[href], link[rel=stylesheet][href]", (els) =>
      els.map((e) => e.getAttribute("href")).filter((h) => !/^(https?:|mailto:|#)/.test(h)));
    for (const href of new Set(local)) {
      const r = await request.get(new URL(href, page.url()).href);
      expect(r.status(), href).toBe(200);
    }
    for (const json of await page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => x.textContent))) {
      expect(() => JSON.parse(json)).not.toThrow();
    }
  });

  test(`${path} has no horizontal overflow at 390 px`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test(`${path} has no critical or serious axe violations`, async ({ page }) => {
    await page.goto(path);
    if (path === "/") await expect(page.locator("#replay")).toBeVisible(); // animation finished
    const { violations } = await new AxeBuilder({ page }).analyze();
    const blocking = violations.filter((v) => ["critical", "serious"].includes(v.impact));
    expect(blocking.map((v) => `${v.impact}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`)).toEqual([]);
  });
}

const ranks = (page) => page.locator("#queue .rk").allTextContents();

test("hero queue ends in priority order and replay works from the keyboard", async ({ page }) => {
  await page.goto("/");
  const replay = page.locator("#replay");
  await expect(replay).toBeVisible();
  expect(await ranks(page)).toEqual(PRIORITY);

  await replay.focus();
  await page.keyboard.press("Enter");
  // While re-sorting, the button stays visible and focused but is marked disabled.
  await expect(replay).toHaveAttribute("aria-disabled", "true");
  await expect(replay).toBeVisible();
  await expect(replay).toBeFocused();
  await page.keyboard.press("Enter"); // ignored during the animation
  await expect(replay).not.toHaveAttribute("aria-disabled", "true", { timeout: 5000 });
  await expect(replay).toBeFocused();
  expect(await ranks(page)).toEqual(PRIORITY);
});

test("with reduced motion the queue is static and in priority order", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.fulfill({ status: 200, body: "" }));
  await page.goto("http://127.0.0.1:4174/");
  expect(await ranks(page)).toEqual(PRIORITY);
  await expect(page.locator("#replay")).toBeHidden();
  await context.close();
});

test("every page offers the contact address and the privacy page", async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    await expect(page.locator('footer a[href="mailto:info@sahaiq.app"]'), path).toBeVisible();
    await expect(page.locator('footer a[href="gizlilik.html"]'), path).toBeVisible();
  }
});

test("hero names are visibly fictional", async ({ page }) => {
  await page.goto("/");
  for (const n of await page.locator("#queue .who").allTextContents()) expect(n).toMatch(/^Kurgu /);
});

test("site does not claim the current product calls Claude API", async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const text = await page.locator("main").innerText();
    expect(text, path).not.toMatch(/Claude API ile üretil/);
    expect(text, path).not.toMatch(/satışta değil/);
  }
});


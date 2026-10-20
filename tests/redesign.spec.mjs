// Regression checks for issue #11. Keep all existing site.spec.mjs coverage.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const PAGES = ['/', '/sss.html', '/hakkinda.html', '/gizlilik.html', '/sahaiq-nasil-kurdum.html'];
const baseline = JSON.parse(readFileSync(new URL('./fixtures/demo-preview.json', import.meta.url)));

test.beforeEach(async ({ page }, info) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  info.siteErrors = errors;
});
test.afterEach(async ({}, info) => {
  expect(info.siteErrors, 'konsol veya sayfa hatası').toEqual([]);
});

for (const path of PAGES) {
  test(`${path} at 390px uses local Archivo, makes no external requests and passes axe`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const external = [];
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => {
      external.push(route.request().url());
      return route.fulfill({ status: 200, body: '' });
    });
    const fontResponse = page.waitForResponse(response => new URL(response.url()).pathname === '/assets/fonts/Archivo.ttf');
    await page.goto(path);
    expect((await fontResponse).status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => [...document.fonts].some(font => font.family === 'Archivo' && font.status === 'loaded'))).toBe(true);
    expect(external).toEqual([]);
    await expect(page.locator('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.map(v => `${v.id}: ${v.nodes.map(node => node.target).join(', ')}`)).toEqual([]);
    await expect(page.locator('footer')).toContainText('ticari bir ürün olarak geliştiriliyor; henüz ücretli kullanıcısı yoktur');
    expect(await page.locator('body').innerText()).not.toMatch(/şirketimiz|ekibimiz|müşterilerimiz|fiyat paketleri|müşteri logoları/i);
    // A keyboard user can reach the page content before the navigation links.
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'İçeriğe geç', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });
}

test('queue, KPIs, decline examples and briefing remain the existing demo output', async ({ page }) => {
  await page.goto('/');
  const preview = await page.evaluate(() => ({
    queue: [...document.querySelectorAll('#queue li')].map(li => Object.fromEntries(['rk', 'who', 'why', 'when'].map(key => [key, li.querySelector('.' + key).textContent]))),
    kpis: [...document.querySelectorAll('.kpis > div')].map(div => ({ label: div.querySelector('dt').textContent, value: div.querySelector('dd').textContent })),
    bars: [...document.querySelectorAll('.bars li')].map(li => ({ name: li.querySelector('span').textContent, value: li.querySelector('b').textContent })),
    briefing: document.querySelector('.brief').textContent,
  }));
  expect(preview).toEqual(baseline);
  await expect(page.locator('.preview-meta')).toContainText('27 Eylül 2026');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const firstReason = await page.locator('#queue .why').first().boundingBox();
  expect(firstReason.y + firstReason.height).toBeLessThanOrEqual(844);
});

test('page links, stylesheet version and inner-page section anchors resolve', async ({ page, request }) => {
  for (const path of PAGES) {
    await page.goto(path);
    await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute('href', 'assets/site.css?v=6');
    const targets = await page.locator('a[href]').evaluateAll(links => links.map(link => new URL(link.href)).filter(url => url.origin === location.origin && url.hash).map(url => ({ pathname: url.pathname, hash: url.hash })));
    for (const { pathname, hash } of targets) {
      // The existing link-resolution tests check the document. Verify fragments too.
      const target = await request.get(pathname);
      expect(target.status()).toBe(200);
      expect(await target.text(), `${pathname}${hash}`).toContain(`id="${decodeURIComponent(hash.slice(1))}"`);
    }
    if (path !== '/') {
      const links = page.getByRole('navigation', { name: 'Bu sayfada', exact: true }).getByRole('link');
      expect(await links.count()).toBeGreaterThan(0);
      const last = links.last();
      const target = await last.getAttribute('href');
      await last.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator(target)).toBeInViewport();
    }
  }
});

test('Archivo is the same licensed font shipped with the demo and privacy text matches', async ({ page, request }) => {
  const font = await request.get('/assets/fonts/Archivo.ttf');
  expect(font.status()).toBe(200);
  expect(font.headers()['content-type']).toBe('font/ttf');
  expect(createHash('sha256').update(await font.body()).digest('hex')).toBe('0e094a7d3c7c4c25cf1310c4b30014f1dae9332220b1c2c88f4fa996f0b05053');
  const license = await request.get('/assets/fonts/OFL.txt');
  expect(license.status()).toBe(200);
  expect(await license.text()).toContain('SIL OPEN FONT LICENSE Version 1.1');
  await page.goto('/gizlilik.html');
  await expect(page.locator('main')).toContainText('site dosyalarıyla birlikte yerel olarak sunulur');
  await expect(page.locator('main')).toContainText('Google Fonts veya başka bir dış hizmete bağlantı kurulmaz');
});

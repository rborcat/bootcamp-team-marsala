import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Load fixture data for assertions
const fixturePath = path.resolve(__dirname, '../../../fixtures/lcm-users.json');
const LCM_USERS = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));

const SELECTABLE = LCM_USERS.filter((m: any) => m.merchant_id !== null);

test.describe('US1 - Merchant Sees Credit Score', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('displays 5 selectable merchants', async ({ page }) => {
    const items = page.locator('.merchant-item');
    await expect(items).toHaveCount(5);
  });

  test('Dk+1 Lanches receives Excellent or Good tier', async ({ page }) => {
    const dk1 = SELECTABLE.find((m: any) => m.trading_name.includes('Dk+1'));
    expect(dk1).toBeDefined();

    // Click on Dk+1 Lanches
    await page.locator('.merchant-item', { hasText: 'Dk+1' }).click();

    // Should navigate to score screen
    await expect(page.locator('#screen-score')).toBeVisible();

    // Tier badge should show Excellent or Good
    const badge = page.locator('.tier-badge');
    await expect(badge).toBeVisible();
    const badgeText = await badge.textContent();
    expect(['EXCELLENT', 'GOOD']).toContain(badgeText?.trim().toUpperCase());
  });

  test('Acaiteria Ki Sabor receives Fair tier', async ({ page }) => {
    await page.locator('.merchant-item', { hasText: 'Acaiteria' }).click();
    await expect(page.locator('#screen-score')).toBeVisible();

    const badge = page.locator('.tier-badge');
    await expect(badge).toBeVisible();
    const badgeText = await badge.textContent();
    expect(badgeText?.trim().toUpperCase()).toBe('FAIR');
  });

  test('Aya Sushi receives Developing tier', async ({ page }) => {
    await page.locator('.merchant-item', { hasText: 'Aya Sushi' }).click();
    await expect(page.locator('#screen-score')).toBeVisible();

    const badge = page.locator('.tier-badge');
    await expect(badge).toBeVisible();
    const badgeText = await badge.textContent();
    expect(badgeText?.trim().toUpperCase()).toBe('DEVELOPING');
  });

  test('score is displayed between 0 and 1000', async ({ page }) => {
    for (const merchant of SELECTABLE) {
      await page.goto('/index.html');
      await page.locator('.merchant-item', { hasText: merchant.trading_name }).click();
      await expect(page.locator('#screen-score')).toBeVisible();

      const scoreText = await page.locator('.score-value').textContent();
      const score = parseInt(scoreText || '0', 10);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1000);
    }
  });

  test('category breakdown shows 4 categories', async ({ page }) => {
    await page.locator('.merchant-item', { hasText: 'Fat Buddha' }).click();
    await expect(page.locator('#screen-score')).toBeVisible();

    const categories = page.locator('.category-item');
    await expect(categories).toHaveCount(4);
  });

  test('category bars have correct CSS classes', async ({ page }) => {
    await page.locator('.merchant-item', { hasText: 'Eky Espetaria' }).click();
    await expect(page.locator('#screen-score')).toBeVisible();

    await expect(page.locator('.category-fill.revenue')).toBeVisible();
    await expect(page.locator('.category-fill.reliability')).toBeVisible();
    await expect(page.locator('.category-fill.growth')).toBeVisible();
    await expect(page.locator('.category-fill.maturity')).toBeVisible();
  });
});

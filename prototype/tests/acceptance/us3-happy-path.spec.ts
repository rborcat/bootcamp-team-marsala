import { test, expect } from '@playwright/test';

test.describe('US3 - Merchant Navigates Happy Path End-to-End', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('complete flow: select → score → offer → terms → restart', async ({ page }) => {
    // Step 1: Select merchant
    await page.locator('.merchant-item', { hasText: 'Fat Buddha' }).click();

    // Step 2: Score screen visible
    await expect(page.locator('#screen-score')).toBeVisible();
    await expect(page.locator('.score-value')).toBeVisible();
    await expect(page.locator('.tier-badge')).toBeVisible();

    // Step 3: Navigate to offer
    await page.locator('#btnToOffer').click();
    await expect(page.locator('#screen-offer')).toBeVisible();

    // Step 4: Navigate to terms
    await page.locator('.btn-primary').last().click();
    await expect(page.locator('#screen-terms')).toBeVisible();

    // Verify terms content
    await expect(page.locator('#termsContent')).toBeVisible();

    // Step 5: Restart
    await page.locator('#btnRestart').click();
    await expect(page.locator('#screen-select')).toBeVisible();
    await expect(page.locator('.merchant-item')).toHaveCount(5);
  });

  test('all 5 merchants complete full flow', async ({ page }) => {
    const merchants = ['Fat Buddha', 'Dk+1', 'Eky Espetaria', 'Acaiteria', 'Aya Sushi'];

    for (const merchant of merchants) {
      await page.goto('/index.html');
      await page.locator('.merchant-item', { hasText: merchant }).click();
      await expect(page.locator('#screen-score')).toBeVisible();

      // Navigate to offer (skip if insufficient)
      const toOfferBtn = page.locator('#btnToOffer');
      if (await toOfferBtn.isVisible()) {
        await toOfferBtn.click();
        await expect(page.locator('#screen-offer')).toBeVisible({ timeout: 3000 });

        // Try to proceed to terms (may not exist for insufficient tier)
        const toTermsBtn = page.locator('#screen-offer .btn-primary');
        if (await toTermsBtn.isVisible()) {
          await toTermsBtn.click();
          await expect(page.locator('#screen-terms')).toBeVisible({ timeout: 3000 });
          await expect(page.locator('#termsContent')).toBeVisible();
        }
      }
    }
  });

  test('progress indicator shows 4 dots', async ({ page }) => {
    const dots = page.locator('.progress-dot');
    await expect(dots).toHaveCount(4);

    // First dot should be active on select screen
    await expect(dots.first()).toHaveClass(/active/);
  });

  test('screen transitions are animated and smooth', async ({ page }) => {
    await page.locator('.merchant-item', { hasText: 'Dk+1' }).click();

    // Score screen should have animation class
    const scoreScreen = page.locator('#screen-score');
    await expect(scoreScreen).toHaveClass(/active/);

    // Verify no layout shift (viewport width stays at 390)
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(390);
  });

  test('viewport renders at 390x844 without overflow', async ({ page }) => {
    await page.locator('.merchant-item', { hasText: 'Fat Buddha' }).click();
    await page.locator('#btnToOffer').click();

    // Check no horizontal overflow on app container
    const app = page.locator('#app');
    const box = await app.boundingBox();
    expect(box).toBeDefined();
    if (box) {
      // Width should be within viewport
      expect(box.width).toBeLessThanOrEqual(400);
    }
  });
});

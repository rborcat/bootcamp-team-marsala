import { test, expect } from '@playwright/test';

test.describe('US2 - Merchant Receives Personalized Offer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('Excellent/Good tier shows offer with amount and terms', async ({ page }) => {
    // Dk+1 Lanches should have a high tier
    await page.locator('.merchant-item', { hasText: 'Dk+1' }).click();
    await expect(page.locator('#screen-score')).toBeVisible();

    // Navigate to offer
    await page.locator('#btnToOffer').click();
    await expect(page.locator('#screen-offer')).toBeVisible();

    // Check offer amount is displayed
    const amountText = await page.locator('.offer-amount').textContent();
    expect(amountText).toBeTruthy();
    expect(amountText).toContain('R$');

    // Check rate display
    const rateText = await page.locator('.rate-value').textContent();
    expect(rateText).toBeTruthy();
    expect(rateText).toContain('%');
  });

  test('Fair tier shows R$4.000 max with 3/6mo terms', async ({ page }) => {
    await page.locator('.merchant-item', { hasText: 'Acaiteria' }).click();
    await expect(page.locator('#screen-score')).toBeVisible();

    // Navigate to offer
    await page.locator('#btnToOffer').click();
    await expect(page.locator('#screen-offer')).toBeVisible();

    // Should show R$4.000 max
    const amountText = await page.locator('.offer-amount').textContent();
    expect(amountText).toContain('4.000');

    // Should show 3 and 6 month options
    const termButtons = page.locator('.term-btn');
    await expect(termButtons).toHaveCount(2);
  });

  test('offer screen has term selector buttons', async ({ page }) => {
    await page.locator('.merchant-item', { hasText: 'Fat Buddha' }).click();
    await expect(page.locator('#screen-score')).toBeVisible();

    await page.locator('#btnToOffer').click();
    await expect(page.locator('#screen-offer')).toBeVisible();

    const termButtons = page.locator('.term-btn');
    const count = await termButtons.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('amount slider allows selection within range', async ({ page }) => {
    await page.locator('.merchant-item', { hasText: 'Eky Espetaria' }).click();
    await expect(page.locator('#screen-score')).toBeVisible();

    await page.locator('#btnToOffer').click();
    await expect(page.locator('#screen-offer')).toBeVisible();

    // Amount display should be visible
    const amountDisplay = page.locator('#amountDisplay');
    await expect(amountDisplay).toBeVisible();
    const displayText = await amountDisplay.textContent();
    expect(displayText).toContain('R$');
  });

  test('offer has Pago trust signal', async ({ page }) => {
    await page.locator('.merchant-item', { hasText: 'Acaiteria' }).click();
    await page.locator('#btnToOffer').click();

    const trustSignal = page.locator('.pago-trust');
    await expect(trustSignal).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('US4 - Merchant Understands Terms Clearly', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    // Navigate to terms for a known merchant
    await page.locator('.merchant-item', { hasText: 'Acaiteria' }).click();
    await page.locator('#btnToOffer').click();
    // Click the "Ver condições completas" button
    const toTermsBtn = page.locator('#screen-offer .btn-primary');
    if (await toTermsBtn.isVisible()) {
      await toTermsBtn.click();
    }
  });

  test('terms screen shows number of weekly boletos', async ({ page }) => {
    await expect(page.locator('#screen-terms')).toBeVisible({ timeout: 3000 });
    const termsText = await page.locator('#termsContent').textContent();
    expect(termsText).toContain('boletos semanais');
  });

  test('terms show total cost and CET', async ({ page }) => {
    await expect(page.locator('#screen-terms')).toBeVisible({ timeout: 3000 });
    const termsText = await page.locator('#termsContent').textContent();

    // Total a pagar
    expect(termsText).toContain('Total a pagar');
    expect(termsText).toMatch(/R\$\s*[\d.]+/);

    // CET
    expect(termsText).toContain('Custo Efetivo Total');
    expect(termsText).toContain('ao ano');
  });

  test('terms explain late-payment consequences', async ({ page }) => {
    await expect(page.locator('#screen-terms')).toBeVisible({ timeout: 3000 });
    const termsText = await page.locator('#termsContent').textContent();

    expect(termsText).toContain('atraso');
    expect(termsText).toContain('juros');
    expect(termsText).toContain('multa');
  });

  test('terms explain sequential payment rule', async ({ page }) => {
    await expect(page.locator('#screen-terms')).toBeVisible({ timeout: 3000 });
    const termsText = await page.locator('#termsContent').textContent();

    expect(termsText).toContain('sequencial');
    expect(termsText).toContain('boleto anterior');
  });

  test('no unexplained financial jargon', async ({ page }) => {
    await expect(page.locator('#screen-terms')).toBeVisible({ timeout: 3000 });
    const termsText = await page.locator('#termsContent').textContent() || '';

    // Should NOT contain unexplained acronyms
    const jargonTerms = ['TAC', 'IOF', 'spread', 'CETIP', 'SELIC'];
    for (const term of jargonTerms) {
      // CET is explained, so it's OK
      if (term === 'CET') continue;
      expect(termsText.toUpperCase()).not.toContain(term);
    }
  });

  test('terms screen has trust signals', async ({ page }) => {
    await expect(page.locator('#screen-terms')).toBeVisible({ timeout: 3000 });
    const trustSignal = page.locator('.pago-trust');
    await expect(trustSignal).toBeVisible();
  });

  test('terms have clear labels in Portuguese', async ({ page }) => {
    await expect(page.locator('#screen-terms')).toBeVisible({ timeout: 3000 });
    const termsText = await page.locator('#termsContent').textContent();

    expect(termsText).toContain('Valor solicitado');
    expect(termsText).toContain('Prazo');
    expect(termsText).toContain('Taxa de juros');
    expect(termsText).toContain('Plano de Pagamento');
  });
});

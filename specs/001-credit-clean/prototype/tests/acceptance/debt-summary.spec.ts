import { test, expect } from '@playwright/test';

/**
 * Debt Summary acceptance tests (US1).
 *
 * Validates that the debt summary page for Acai Ki Sabor shows:
 * - Total overdue: R$ 1.800,00
 * - Overdue count: 2 parcelas em atraso
 * - LCM health data: rating 4.9, trending item, revenue message
 * - Zero-debt merchant (Fat Buddha) shows no error
 */

const ACAI_KI_SABOR_ID = '6fde0ff9-92e2-47bf-a533-e74d272c979a';

test.describe('Debt Summary — Acai Ki Sabor', () => {
  test('shows total overdue balance R$ 1.800,00', async ({ page }) => {
    await page.goto('/debt');
    await page.waitForLoadState('networkidle');

    // The page should contain the formatted total overdue amount
    await expect(page.getByText('R$ 1.800,00')).toBeVisible();
  });

  test('shows "2 parcelas em atraso"', async ({ page }) => {
    await page.goto('/debt');
    await page.waitForLoadState('networkidle');

    // Plural form for 2 overdue installments
    await expect(page.getByText('2 parcelas em atraso')).toBeVisible();
  });

  test('shows original contract terms', async ({ page }) => {
    await page.goto('/debt');
    await page.waitForLoadState('networkidle');

    // Original contract: R$ 3.000,00 / 12x / R$ 275,00 monthly
    await expect(page.getByText('R$ 3.000,00')).toBeVisible();
    await expect(page.getByText('12x')).toBeVisible();
    await expect(page.getByText('R$ 275,00')).toBeVisible();
  });

  test('shows LCM customer rating 4.9', async ({ page }) => {
    await page.goto('/debt');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('4.9')).toBeVisible();
  });

  test('shows LCM trending item with share change', async ({ page }) => {
    await page.goto('/debt');
    await page.waitForLoadState('networkidle');

    // "Acai de 500ml (25,86% → 31,20%)" — the arrow is rendered as →
    // Playwright can see it as text since it's in the DOM
    await expect(page.getByText(/Acai de 500ml.*25,86.*31,20/)).toBeVisible();
  });

  test('shows "Seu negocio esta gerando receita" message', async ({ page }) => {
    await page.goto('/debt');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Seu negocio esta gerando receita')).toBeVisible();
  });

  test('"Ver opcoes de renegociacao" button navigates to /options', async ({ page }) => {
    await page.goto('/debt');
    await page.waitForLoadState('networkidle');

    const cta = page.getByRole('button', { name: /Ver opcoes|renegociacao/i });
    await expect(cta).toBeVisible();
    await cta.click();

    await expect(page).toHaveURL(/\/options/);
  });
});

test.describe('Debt Summary — Fat Buddha (zero overdue)', () => {
  test('shows empty/zero debt state with no error', async ({ page }) => {
    await page.goto('/debt');
    await page.waitForLoadState('networkidle');

    // Triple-tap the title area to reveal merchant switcher
    const title = page.locator('h1');
    await title.click({ clickCount: 3 });

    // Select Fat Buddha
    await page.getByText('Fat Buddha').click();

    // Should show zero-debt state
    await expect(page.getByText(/Nenhuma parcela em atraso/)).toBeVisible();
    await expect(page.getByText(/em dia/)).toBeVisible();
  });
});

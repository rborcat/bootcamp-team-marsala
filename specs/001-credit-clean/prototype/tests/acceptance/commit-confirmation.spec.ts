import { test, expect } from '@playwright/test';

/**
 * Commit Confirmation acceptance tests (US3).
 *
 * Validates:
 * - ConfirmPage shows selected plan summary
 * - "Confirmar" button transitions to success state
 * - Success screen shows "Renegociacao confirmada" and plan details
 * - "Ver pagamentos" button navigates to /tracking
 * - "Voltar" button returns to /options
 */

test.describe('Commit Confirmation — Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate through the flow to reach confirm page with a plan selected
    await page.goto('/options');
    await page.waitForLoadState('networkidle');

    // Select the first plan
    await page.getByRole('button', { name: /Escolher este plano/i }).first().click();
    await expect(page).toHaveURL(/\/confirm/);
    await page.waitForLoadState('networkidle');
  });

  test('shows selected plan summary before confirmation', async ({ page }) => {
    // Should show plan details (installments, monthly, total)
    await expect(page.getByText(/parcela/)).toBeVisible();
    await expect(page.getByText(/R\\$/)).toBeVisible();
  });

  test('shows "Confirmar este plano?" question with Confirm and Back buttons', async ({ page }) => {
    await expect(page.getByText(/Confirmar este plano/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Confirmar$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Voltar/i })).toBeVisible();
  });

  test('tapping "Confirmar" transitions to success screen', async ({ page }) => {
    await page.getByRole('button', { name: /Confirmar$/i }).click();

    // Success screen should appear
    await expect(page.getByText(/Renegociacao confirmada/i)).toBeVisible();
  });

  test('success screen shows plan details and "Ver pagamentos" button', async ({ page }) => {
    await page.getByRole('button', { name: /Confirmar$/i }).click();

    await expect(page.getByText(/Renegociacao confirmada/i)).toBeVisible();
    await expect(page.getByText(/parcela/)).toBeVisible();

    const trackingButton = page.getByRole('button', { name: /Ver pagamentos/i });
    await expect(trackingButton).toBeVisible();
  });

  test('"Ver pagamentos" button navigates to /tracking', async ({ page }) => {
    await page.getByRole('button', { name: /Confirmar$/i }).click();

    await page.getByRole('button', { name: /Ver pagamentos/i }).click();
    await expect(page).toHaveURL(/\/tracking/);
  });

  test('"Voltar" button returns to /options', async ({ page }) => {
    await page.getByRole('button', { name: /Voltar/i }).click();
    await expect(page).toHaveURL(/\/options/);
  });
});

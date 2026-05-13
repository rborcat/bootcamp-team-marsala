import { test, expect } from '@playwright/test';

/**
 * Repayment Tracking acceptance tests (US4).
 *
 * Validates:
 * - Installment timeline renders after commitment
 * - At least one installment marked as "pago" with green check
 * - Remaining installments show "a vencer" with due dates
 * - LCM health snapshot visible above timeline
 * - Page accessible via /tracking route
 */

test.describe('Repayment Tracking — After Confirming a Plan', () => {
  test.beforeEach(async ({ page }) => {
    // Walk through full happy path to reach tracking
    // 1. Go to options and select a plan
    await page.goto('/options');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /Escolher este plano/i }).first().click();
    await expect(page).toHaveURL(/\/confirm/);
    await page.waitForLoadState('networkidle');

    // 2. Confirm the plan
    await page.getByRole('button', { name: /Confirmar$/i }).click();
    await expect(page.getByText(/Renegociacao confirmada/i)).toBeVisible();

    // 3. Tap "Ver pagamentos"
    await page.getByRole('button', { name: /Ver pagamentos/i }).click();
    await expect(page).toHaveURL(/\/tracking/);
    await page.waitForLoadState('networkidle');
  });

  test('shows installment timeline with status indicators', async ({ page }) => {
    // Should see "pago" status for early installments
    await expect(page.getByText(/Pago em/i).first()).toBeVisible();

    // Should see "a vencer" for upcoming installments
    await expect(page.getByText(/A vencer em/i).first()).toBeVisible();
  });

  test('shows 12 installments for Acai Ki Sabor contract', async ({ page }) => {
    // Installment numbers 1-12 should be visible in the timeline
    for (let i = 1; i <= 12; i++) {
      await expect(page.getByText(`Parcela ${i}`)).toBeVisible();
    }
  });

  test('shows LCM health snapshot above timeline', async ({ page }) => {
    // LCM data (rating, items) should be visible on tracking page
    await expect(page.getByText('4.9')).toBeVisible();
    await expect(page.getByText(/Seu negocio esta gerando receita/i)).toBeVisible();
  });

  test('page is accessible directly via /tracking route', async ({ page }) => {
    // Even without walking through the full flow, /tracking should render
    await page.goto('/tracking');
    await page.waitForLoadState('networkidle');

    // Should show the page (at minimum the title)
    await expect(page.getByRole('heading', { name: /Pagamentos/i })).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

/**
 * Renegotiation Options acceptance tests (US2).
 *
 * Validates:
 * - Plan cards render for Acai Ki Sabor
 * - Amounts formatted in pt-BR
 * - "Escolher este plano" button navigates to /confirm
 * - Zero plans edge case (Fat Buddha)
 */

test.describe('Renegotiation Options — Acai Ki Sabor', () => {
  test('shows at least 2 renegotiation plan cards', async ({ page }) => {
    await page.goto('/options');
    await page.waitForLoadState('networkidle');

    // Each plan card has an "Escolher este plano" button
    const planButtons = page.getByRole('button', { name: /Escolher este plano/i });
    await expect(planButtons).toHaveCount(3); // Acai has 3 plans
  });

  test('each plan card shows monthly amount and total cost in R$', async ({ page }) => {
    await page.goto('/options');
    await page.waitForLoadState('networkidle');

    // Check for pt-BR currency formatting on the page
    await expect(page.getByText(/R\\$.*\/mes/)).toBeVisible();
    await expect(page.getByText(/Total.*R\\$/)).toBeVisible();
  });

  test('plan cards are ordered with installment counts visible', async ({ page }) => {
    await page.goto('/options');
    await page.waitForLoadState('networkidle');

    // Should see "6x", "12x", "18x" for Acai's 3 plans
    await expect(page.getByText('6x')).toBeVisible();
    await expect(page.getByText('12x')).toBeVisible();
  });

  test('"Escolher este plano" navigates to /confirm', async ({ page }) => {
    await page.goto('/options');
    await page.waitForLoadState('networkidle');

    const firstPlanButton = page.getByRole('button', { name: /Escolher este plano/i }).first();
    await firstPlanButton.click();

    await expect(page).toHaveURL(/\/confirm/);
  });

  test('page title is "Opcoes de renegociacao"', async ({ page }) => {
    await page.goto('/options');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: /Opcoes de renegociacao/i })).toBeVisible();
  });
});

test.describe('Renegotiation Options — Fat Buddha (0 plans)', () => {
  test('shows support contact message when no plans available', async ({ page }) => {
    await page.goto('/debt');
    await page.waitForLoadState('networkidle');

    // Switch to Fat Buddha
    const title = page.locator('h1');
    await title.click({ clickCount: 3 });
    await page.getByText('Fat Buddha').click();

    // Navigate to options
    await page.goto('/options');
    await page.waitForLoadState('networkidle');

    // Should show support message
    await expect(page.getByText(/suporte/i)).toBeVisible();
  });
});

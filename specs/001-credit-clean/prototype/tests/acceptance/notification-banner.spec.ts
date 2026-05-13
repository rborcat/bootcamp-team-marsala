import { test, expect } from '@playwright/test';

/**
 * Notification Banner acceptance tests (US5).
 *
 * Validates:
 * - Banner appears for Acai Ki Sabor (overdue debt) with correct amount
 * - "Resolver agora" CTA navigates to /debt
 * - Banner hidden for Fat Buddha (0 overdue)
 * - Banner hidden after confirming a plan (flowState=confirmed)
 */

test.describe('Notification Banner — Acai Ki Sabor (overdue)', () => {
  test('shows red banner with "Voce tem R$ 1.800,00 em atraso"', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Banner should be visible with the overdue amount
    await expect(page.getByText(/Voce tem R\\$.1.800,00 em atraso/)).toBeVisible();
  });

  test('"Resolver agora" button navigates to /debt', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const cta = page.getByRole('button', { name: /Resolver agora/i });
    await expect(cta).toBeVisible();
    await cta.click();

    await expect(page).toHaveURL(/\/debt/);
  });

  test('banner is non-blocking — home content visible below', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Banner shows overdue amount
    await expect(page.getByText(/Voce tem/)).toBeVisible();

    // HomePage content should also be visible (Gestor de Pedidos)
    await expect(page.getByText(/Gestor/)).toBeVisible();
  });
});

test.describe('Notification Banner — Fat Buddha (no debt)', () => {
  test('banner is not visible for merchant with 0 overdue', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // First, switch to Fat Buddha via triple-tap on title
    const title = page.locator('h1');
    await title.click({ clickCount: 3 });
    await page.getByText('Fat Buddha').click();

    // After switching, we're back on home with Fat Buddha selected
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Banner text should NOT be visible
    await expect(page.getByText(/Voce tem.*em atraso/)).not.toBeVisible();
  });
});

test.describe('Notification Banner — After confirmation', () => {
  test('banner is hidden after flowState=confirmed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Walk through full happy path to confirmation
    // 1. Tap "Resolver agora" → /debt
    await page.getByRole('button', { name: /Resolver agora/i }).click();
    await expect(page).toHaveURL(/\/debt/);

    // 2. Tap "Ver opcoes" → /options
    await page.getByRole('button', { name: /Ver opcoes/i }).click();
    await expect(page).toHaveURL(/\/options/);

    // 3. Choose first plan → /confirm
    await page.getByRole('button', { name: /Escolher este plano/i }).first().click();
    await expect(page).toHaveURL(/\/confirm/);

    // 4. Confirm the plan
    await page.getByRole('button', { name: /Confirmar$/i }).click();

    // 5. Success screen should show
    await expect(page.getByText(/Renegociacao confirmada/i)).toBeVisible();

    // 6. Navigate back to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Banner should NOT be visible after confirmation
    await expect(page.getByText(/Voce tem.*em atraso/)).not.toBeVisible();
  });
});

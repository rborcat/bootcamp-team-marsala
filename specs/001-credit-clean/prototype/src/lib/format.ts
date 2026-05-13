/**
 * pt-BR formatting utilities.
 *
 * US-003: Currency, date, and percentage formatters for merchant-facing UI.
 */

/**
 * Format a numeric value as pt-BR currency (R$).
 *
 * @example formatCurrency(1800) → "R$ 1.800,00"
 * @example formatCurrency(165.5) → "R$ 165,50"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format an ISO date string to pt-BR short date.
 *
 * @example formatDate("2025-04-01") → "01/04/2025"
 */
export function formatDate(date: string): string {
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format a decimal value as a pt-BR percentage string.
 *
 * @example formatPercent(0.312) → "31,20%"
 * @example formatPercent(25.86) → "25,86%"  (already percentage-scaled)
 */
export function formatPercent(value: number): string {
  // If value < 1, treat as raw fraction and multiply by 100.
  // Otherwise (e.g. 25.86 from LCM data which is already scaled), use as-is.
  const scaled = value < 1 ? value * 100 : value;
  return (
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(scaled) + '%'
  );
}

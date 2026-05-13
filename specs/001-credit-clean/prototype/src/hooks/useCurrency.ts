import { useCallback } from 'react';
import { formatCurrency } from '@/lib/format';

/**
 * Hook wrapping formatCurrency for convenient use in React components.
 *
 * Returns a memoized formatter function bound to pt-BR.
 * The function is stable across re-renders since formatCurrency
 * has no dependencies.
 */
export function useCurrency(): (value: number) => string {
  return useCallback((value: number) => formatCurrency(value), []);
}

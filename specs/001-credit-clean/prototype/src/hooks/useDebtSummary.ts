import { useMemo } from 'react';
import type { DebtSummary } from '@/types';
import { useDebtSummary as useDebtSummaryFromContext } from '@/context/AppContext';

/**
 * Hook that derives a DebtSummary object for the currently selected merchant.
 *
 * Delegates to AppContext's useDebtSummary() which looks up the
 * debtSummaries array by the selected merchantId.
 *
 * Returns undefined if no merchant is selected (shouldn't happen in practice
 * since a default is always selected).
 */
export function useDebtSummary(): DebtSummary | undefined {
  const summary = useDebtSummaryFromContext();
  return useMemo(() => summary, [summary]);
}

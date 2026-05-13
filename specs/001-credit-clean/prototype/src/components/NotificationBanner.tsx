import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/format';
import { useMerchant, useDebtSummary, useAppState } from '@/context/AppContext';

/**
 * NotificationBanner — overdue alert banner for the HomePage.
 *
 * Features:
 * - Red background (#EA1D2C) with warning icon and overdue amount
 * - Shows "Voce tem R$ X.XXX,XX em atraso" for merchants with overdue debt
 * - "Resolver agora" CTA button navigates to /debt
 * - Hidden when flowState is 'confirmed' (debt resolved)
 * - Hidden when merchant has 0 overdue (e.g., Fat Buddha)
 * - Non-blocking: sticky at top, content visible below
 * - No horizontal overflow (contained in 390px viewport)
 */

export default function NotificationBanner() {
  const navigate = useNavigate();
  const merchant = useMerchant();
  const summary = useDebtSummary();
  const { flowState } = useAppState();

  // Hidden when flowState is confirmed (debt resolved)
  if (flowState === 'confirmed') return null;

  // Hidden when no data
  if (!merchant || !summary) return null;

  // Hidden when merchant has 0 overdue (e.g., Fat Buddha)
  if (summary.totalOverdue <= 0) return null;

  const overdueAmount = formatCurrency(summary.totalOverdue);

  return (
    <div
      className="sticky top-0 z-10 w-full bg-ifood-red text-white"
      role="alert"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Warning icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>

        {/* Message */}
        <p className="flex-1 text-sm font-medium leading-tight">
          Voce tem {overdueAmount} em atraso
        </p>

        {/* CTA button */}
        <Button
          variant="secondary"
          className="!border-white !text-white hover:!bg-white/10 active:!bg-white/20 shrink-0"
          onClick={() => navigate('/debt')}
        >
          Resolver agora
        </Button>
      </div>
    </div>
  );
}

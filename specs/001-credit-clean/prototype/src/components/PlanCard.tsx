import type { RenegotiationPlan } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';
import Button from '@/components/ui/Button';

/**
 * PlanCard — displays a renegotiation plan option.
 *
 * Shows:
 * - Installment count (e.g. "12x")
 * - Monthly amount in pt-BR format (e.g. "R$ 165,00/mes")
 * - Total cost (e.g. "Total: R$ 1.980,00")
 * - First payment date
 * - "Escolher este plano" button
 *
 * Edge cases:
 * - All amounts use formatCurrency (pt-BR Intl)
 * - First payment date uses formatDate (DD/MM/YYYY)
 */

export interface PlanCardProps {
  plan: RenegotiationPlan;
  onSelect: (plan: RenegotiationPlan) => void;
  className?: string;
}

export default function PlanCard({
  plan,
  onSelect,
  className = '',
}: PlanCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 ${className}`.trim()}
    >
      {/* Header: installment count */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          {plan.installments}x
        </h3>
        {/* Installment count badge */}
        <span className="text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
          {plan.installments} {plan.installments === 1 ? 'parcela' : 'parcelas'}
        </span>
      </div>

      {/* Monthly amount */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-400">Valor mensal</span>
        <span className="text-xl font-bold text-ifood-red">
          {formatCurrency(plan.monthlyAmount)}/mes
        </span>
      </div>

      {/* Total cost */}
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">Custo total do plano</span>
        <span className="text-sm font-semibold text-gray-900">
          Total: {formatCurrency(plan.totalAmount)}
        </span>
      </div>

      {/* First payment date */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>
          Primeiro pagamento: {formatDate(plan.firstPaymentDate)}
        </span>
      </div>

      {/* Select button */}
      <Button
        variant="primary"
        className="w-full"
        onClick={() => onSelect(plan)}
      >
        Escolher este plano
      </Button>
    </div>
  );
}

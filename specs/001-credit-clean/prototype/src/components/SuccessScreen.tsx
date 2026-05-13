import type { RenegotiationPlan } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

/**
 * SuccessScreen — shown after the merchant confirms a renegotiation plan.
 *
 * Shows:
 * - Green checkmark icon
 * - "Renegociacao confirmada" heading
 * - Plan summary repeated
 * - "Ver pagamentos" button linking to /tracking
 *
 * All flows use local state only (no network call).
 */

export interface SuccessScreenProps {
  plan: RenegotiationPlan;
  className?: string;
}

export default function SuccessScreen({
  plan,
  className = '',
}: SuccessScreenProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 py-8 ${className}`.trim()}
    >
      {/* Green checkmark */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Success heading */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">
          Renegociacao confirmada
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Seu novo plano de pagamento esta ativo.
        </p>
      </div>

      {/* Plan summary repeated */}
      <div className="w-full bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
        <span className="text-xs font-semibold text-ifood-red uppercase tracking-wide">
          Novo plano
        </span>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Parcelas</span>
          <span className="text-sm font-semibold text-gray-900">
            {plan.installments}x de {formatCurrency(plan.monthlyAmount)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-sm font-bold text-ifood-red">
            {formatCurrency(plan.totalAmount)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Primeiro pagamento</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatDate(plan.firstPaymentDate)}
          </span>
        </div>
      </div>

      {/* "Ver pagamentos" button */}
      <Button
        variant="primary"
        className="w-full"
        onClick={() => navigate('/tracking')}
      >
        Ver pagamentos
      </Button>
    </div>
  );
}

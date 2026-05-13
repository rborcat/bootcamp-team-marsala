import type { RenegotiationPlan } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';
import Button from '@/components/ui/Button';

/**
 * ConfirmSheet — summary card asking the merchant to confirm the selected plan.
 *
 * Shows:
 * - Plan details: installments, monthly amount, total, first payment date
 * - "Confirmar este plano?" question
 * - "Confirmar" primary button (dispatches CONFIRM action)
 * - "Voltar" secondary button (navigates back to /options)
 *
 * No network calls — all flows use local state only.
 * No auto-confirm — explicit merchant action required (constitution tenet).
 */

export interface ConfirmSheetProps {
  plan: RenegotiationPlan;
  onConfirm: () => void;
  onBack: () => void;
  className?: string;
}

export default function ConfirmSheet({
  plan,
  onConfirm,
  onBack,
  className = '',
}: ConfirmSheetProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-4 ${className}`.trim()}
    >
      {/* Plan summary header */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-ifood-red uppercase tracking-wide">
          Plano selecionado
        </span>
        <h2 className="text-lg font-bold text-gray-900">
          {plan.installments}x de {formatCurrency(plan.monthlyAmount)}
        </h2>
      </div>

      {/* Plan details */}
      <div className="flex flex-col gap-2 bg-gray-50 rounded-lg p-3">
        {/* Installments */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Parcelas</span>
          <span className="text-sm font-semibold text-gray-900">
            {plan.installments}x
          </span>
        </div>

        {/* Monthly amount */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Valor mensal</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(plan.monthlyAmount)}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-sm font-bold text-ifood-red">
            {formatCurrency(plan.totalAmount)}
          </span>
        </div>

        {/* First payment date */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Primeiro pagamento</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatDate(plan.firstPaymentDate)}
          </span>
        </div>
      </div>

      {/* Confirmation question */}
      <div className="text-center py-2">
        <h3 className="text-base font-bold text-gray-900">
          Confirmar este plano?
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Ao confirmar, voce concorda com os novos termos de pagamento.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          className="w-full"
          onClick={onConfirm}
        >
          Confirmar
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={onBack}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}

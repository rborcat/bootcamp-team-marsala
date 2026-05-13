import type { DebtSummary } from '@/types';
import { formatCurrency } from '@/lib/format';

/**
 * DebtCard — shows the merchant's total overdue balance, overdue
 * installment count, and original contract terms (amount, term, monthly).
 *
 * When totalOverdue is 0 (e.g., Fat Buddha), renders an empty/zero
 * debt state with no error.
 */

export interface DebtCardProps {
  summary: DebtSummary;
}

export default function DebtCard({ summary }: DebtCardProps) {
  const isZero = summary.totalOverdue === 0;

  return (
    <section className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Resumo da divida
      </h2>

      {isZero ? (
        /* Zero-debt state: no overdue, no error */
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Nenhuma parcela em atraso
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Voce esta em dia com seus pagamentos
          </p>
        </div>
      ) : (
        /* Active debt state */
        <div className="space-y-3">
          {/* Total overdue */}
          <div>
            <p className="text-xs text-gray-500">Total em atraso</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.totalOverdue)}
            </p>
          </div>

          {/* Overdue count */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold">
              !
            </span>
            <p className="text-sm text-gray-700">
              <strong>{summary.overdueCount}</strong>{' '}
              {summary.overdueCount === 1
                ? 'parcela em atraso'
                : 'parcelas em atraso'}
            </p>
          </div>

          {/* Original contract terms */}
          {summary.contractOrigin && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Contrato original</p>
              <div className="flex gap-4 text-sm text-gray-700">
                <span>
                  {formatCurrency(summary.contractOrigin.amount)}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {summary.contractOrigin.termMonths} meses
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {formatCurrency(summary.contractOrigin.monthly)}/mes
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

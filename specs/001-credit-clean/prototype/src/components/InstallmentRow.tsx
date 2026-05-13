import type { Installment } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';

/**
 * InstallmentRow — single installment in the repayment timeline.
 *
 * Status display:
 * - paid:     green check ✓ + "Pago em [date]"
 * - overdue:  amber warning + "Em atraso"
 * - upcoming: gray clock + "A vencer em [date]"
 */

export interface InstallmentRowProps {
  installment: Installment;
  isLast?: boolean;
}

function StatusIcon({ status }: { status: Installment['status'] }) {
  switch (status) {
    case 'paid':
      return (
        <span
          className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
          aria-label="Pago"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
        </span>
      );
    case 'overdue':
      return (
        <span
          className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0"
          aria-label="Em atraso"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-600"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
      );
    case 'upcoming':
      return (
        <span
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
          aria-label="A vencer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
      );
  }
}

function StatusLabel({ installment }: { installment: Installment }) {
  switch (installment.status) {
    case 'paid':
      return (
        <span className="text-xs text-green-600 font-medium">
          Pago em {installment.paidDate ? formatDate(installment.paidDate) : '—'}
        </span>
      );
    case 'overdue':
      return (
        <span className="text-xs text-amber-600 font-medium">
          Em atraso
        </span>
      );
    case 'upcoming':
      return (
        <span className="text-xs text-gray-400 font-medium">
          A vencer em {formatDate(installment.dueDate)}
        </span>
      );
  }
}

export default function InstallmentRow({ installment, isLast = false }: InstallmentRowProps) {
  return (
    <div className="flex gap-3">
      {/* Timeline column: icon + connector line */}
      <div className="flex flex-col items-center">
        <StatusIcon status={installment.status} />
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gray-200 my-1" aria-hidden="true" />
        )}
      </div>

      {/* Content column */}
      <div className={`flex-1 min-w-0 pb-4 ${isLast ? '' : ''}`}>
        <div className="flex items-center justify-between gap-2">
          {/* Installment number + due date */}
          <div className="min-w-0">
            <span className="text-sm font-semibold text-gray-900">
              {installment.installmentNumber}ª parcela
            </span>
            <span className="text-xs text-gray-400 ml-2">
              {formatDate(installment.dueDate)}
            </span>
          </div>
          {/* Amount */}
          <span className={`text-sm font-semibold flex-shrink-0 ${
            installment.status === 'paid' ? 'text-green-600' :
            installment.status === 'overdue' ? 'text-amber-600' :
            'text-gray-400'
          }`}>
            {formatCurrency(installment.amount)}
          </span>
        </div>
        {/* Status label */}
        <div className="mt-1">
          <StatusLabel installment={installment} />
        </div>
      </div>
    </div>
  );
}

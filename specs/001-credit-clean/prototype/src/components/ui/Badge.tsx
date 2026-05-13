import type { HTMLAttributes } from 'react';

/**
 * InstallmentStatus badge color mappings:
 * - overdue  → amber-500
 * - paid     → green-600
 * - upcoming → gray-400
 */
export type BadgeStatus = 'overdue' | 'paid' | 'upcoming';

const STATUS_COLORS: Record<BadgeStatus, string> = {
  overdue: 'bg-amber-500 text-white',
  paid: 'bg-green-600 text-white',
  upcoming: 'bg-gray-400 text-white',
};

const STATUS_LABELS: Record<BadgeStatus, string> = {
  overdue: 'Em atraso',
  paid: 'Pago',
  upcoming: 'A vencer',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
}

export default function Badge({
  status,
  className = '',
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status]} ${className}`.trim()}
      {...rest}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

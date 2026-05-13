import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Base Button component following iFood brand style.
 *
 * Variants:
 * - primary  : iFood-red (#EA1D2C) bg, white text, hover #C4162A
 * - secondary: outline border, transparent bg, ifood-red text
 * - ghost    : transparent, no border, ifood-red text
 *
 * All variants have min 44x44 tap target, rounded-lg.
 * Accepts className for overrides.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg font-semibold text-sm leading-none min-h-[44px] min-w-[44px] px-4 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ifood-red focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants: Record<string, string> = {
    primary:
      'bg-ifood-red text-white hover:bg-ifood-red-dark active:bg-ifood-red-dark',
    secondary:
      'border border-ifood-red text-ifood-red bg-transparent hover:bg-red-50 active:bg-red-100',
    ghost:
      'text-ifood-red bg-transparent hover:bg-red-50 active:bg-red-100',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}

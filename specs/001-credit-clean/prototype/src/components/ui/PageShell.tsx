import type { ReactNode } from 'react';
import MerchantSwitcher from '@/components/MerchantSwitcher';

/**
 * PageShell — standard screen wrapper for the prototype.
 *
 * Features:
 * - Safe area padding (px-4 pt-6 pb-8)
 * - Optional back button (left chevron) — calls onBack or defaults to history.back()
 * - Title centered in the top bar
 * - children slot below the header
 * - Accepts className for overrides
 *
 * Debug:
 * - Triple-tap on the title area activates the hidden MerchantSwitcher (FR-015 / US-010)
 */
export interface PageShellProps {
  title: string;
  children: ReactNode;
  onBack?: () => void;
  className?: string;
}

export default function PageShell({
  title,
  children,
  onBack,
  className = '',
}: PageShellProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className={`flex flex-col min-h-dvh px-4 pt-6 pb-8 ${className}`.trim()}>
      {/* Header: back button + title (title area is the triple-tap trigger zone) */}
      <header className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ifood-red focus-visible:ring-offset-1 cursor-pointer"
          aria-label="Voltar"
        >
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
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <MerchantSwitcher>
          <h1 className="text-lg font-bold text-gray-900 truncate flex-1 select-none">
            {title}
          </h1>
        </MerchantSwitcher>
      </header>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

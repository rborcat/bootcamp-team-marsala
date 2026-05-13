import { useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppState, useMerchant } from '@/context/AppContext';
import type { Merchant } from '@/types';

/**
 * MerchantSwitcher — hidden debug control for developers/reviewers.
 *
 * Activated by triple-tapping the logo/title area in the PageShell header.
 * Shows a dropdown modal listing all 5 fixture merchants by trading_name.
 * Selecting a merchant dispatches SELECT_MERCHANT and resets flow state to idle.
 *
 * Not visible to regular users without the triple-tap activation.
 */

export interface MerchantSwitcherProps {
  children: React.ReactNode;
}

export default function MerchantSwitcher({ children }: MerchantSwitcherProps) {
  const [visible, setVisible] = useState(false);
  const { merchants, selectedMerchantId } = useAppState();
  const currentMerchant = useMerchant();
  const dispatch = useAppDispatch();

  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTripleTap = useCallback(() => {
    tapCount.current += 1;

    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }

    if (tapCount.current === 3) {
      tapCount.current = 0;
      setVisible((prev) => !prev);
      return;
    }

    // Reset tap count after 500ms if not enough taps
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 500);
  }, []);

  const handleSelectMerchant = useCallback(
    (merchantId: string) => {
      dispatch({ type: 'SELECT_MERCHANT', merchantId });
      setVisible(false);
    },
    [dispatch],
  );

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <>
      {/* Trigger zone: wraps children transparently, captures triple-tap */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div onClick={handleTripleTap} className="cursor-default">
        {children}
      </div>

      {/* Overlay + dropdown */}
      {visible && (
        <>
          {/* Backdrop */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={handleClose}
          />

          {/* Dropdown modal */}
          <div className="fixed inset-x-0 top-24 z-50 mx-auto w-full max-w-[360px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">
                  Merchant Switcher
                </h2>
                <span className="text-xs text-gray-400 font-mono">DEBUG</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Currently: {currentMerchant?.trading_name ?? 'None'}
              </p>
            </div>

            {/* Merchant list */}
            <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {merchants.map((merchant: Merchant) => {
                const isSelected = merchant.merchant_id === selectedMerchantId;
                return (
                  <li key={merchant.merchant_id}>
                    <button
                      type="button"
                      onClick={() => handleSelectMerchant(merchant.merchant_id!)}
                      className={`w-full text-left px-4 py-3 transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ifood-red cursor-pointer ${
                        isSelected
                          ? 'bg-red-50 text-ifood-red font-medium'
                          : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        <span className="text-sm truncate">
                          {merchant.trading_name}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={handleClose}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1 min-h-[44px] flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ifood-red rounded-md"
              >
                Fechar
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

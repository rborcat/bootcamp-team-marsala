import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/ui/PageShell';
import PlanCard from '@/components/PlanCard';
import { usePlans, useAppDispatch } from '@/context/AppContext';
import type { RenegotiationPlan } from '@/types';

/**
 * OptionsPage — renegotiation options page (US2 / US-007).
 *
 * Shows:
 * - PageShell with title "Opcoes de renegociacao" and back button
 * - Plan cards for each renegotiation option, sorted by term length (shorter first)
 * - Each card shows installment count, monthly amount, total cost,
 *   and "Escolher este plano" button
 *
 * Behavior:
 * - "Escolher este plano" dispatches SELECT_PLAN and navigates to /confirm
 * - Scrollable list if 3+ plans (overflow-y-auto)
 *
 * Edge cases:
 * - If 0 plans available, show "Entre em contato com o suporte" message
 * - Plans sorted by installment count ascending (shorter terms first)
 * - No horizontal overflow (constrained by App.tsx max-w-[390px])
 */

export default function OptionsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const plans = usePlans();

  // Sort plans by installment count (shorter first)
  const sortedPlans = [...plans].sort(
    (a, b) => a.installments - b.installments,
  );

  const handleSelectPlan = (plan: RenegotiationPlan) => {
    dispatch({ type: 'SELECT_PLAN', planId: plan.planId });
    navigate('/confirm');
  };

  return (
    <PageShell title="Opcoes de renegociacao">
      {/* No plans available */}
      {sortedPlans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-500"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700 text-center">
            Entre em contato com o suporte
          </p>
          <p className="text-xs text-gray-400 mt-1 text-center">
            Nao ha planos de renegociacao disponiveis no momento.
          </p>
        </div>
      )}

      {/* Plan cards with scroll support */}
      {sortedPlans.length > 0 && (
        <div
          className={`flex flex-col gap-3 ${
            sortedPlans.length >= 3 ? 'overflow-y-auto max-h-[calc(100dvh-8rem)]' : ''
          }`}
        >
          {sortedPlans.map((plan) => (
            <PlanCard
              key={plan.planId}
              plan={plan}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}

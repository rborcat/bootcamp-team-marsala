import { useState } from 'react';
import PageShell from '@/components/ui/PageShell';
import ConfirmSheet from '@/components/ConfirmSheet';
import SuccessScreen from '@/components/SuccessScreen';
import { useSelectedPlan, useAppDispatch } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

/**
 * Confirmation Page — US-008 (US3 - P3)
 *
 * Two states:
 * 1. "confirming" — shows selected plan summary via ConfirmSheet
 * 2. "success"   — shows success state via SuccessScreen
 *
 * Flows use local state only (no network call).
 * No auto-confirm — explicit merchant action required.
 */

type ConfirmState = 'confirming' | 'success';

export default function ConfirmPage() {
  const [localState, setLocalState] = useState<ConfirmState>('confirming');
  const selectedPlan = useSelectedPlan();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Guard: if no plan selected, redirect to options
  if (!selectedPlan) {
    return (
      <PageShell title="Confirmar">
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <p className="text-gray-500">Nenhum plano selecionado.</p>
          <button
            type="button"
            className="text-ifood-red font-semibold text-sm"
            onClick={() => navigate('/options')}
          >
            Escolher um plano
          </button>
        </div>
      </PageShell>
    );
  }

  const handleConfirm = () => {
    // Dispatch CONFIRM action: sets flowState=confirmed in context
    dispatch({ type: 'CONFIRM' });
    // Transition to success screen
    setLocalState('success');
  };

  const handleBack = () => {
    navigate('/options');
  };

  return (
    <PageShell title="Confirmar">
      {localState === 'confirming' ? (
        <ConfirmSheet
          plan={selectedPlan}
          onConfirm={handleConfirm}
          onBack={handleBack}
        />
      ) : (
        <SuccessScreen plan={selectedPlan} />
      )}
    </PageShell>
  );
}

import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/ui/PageShell';
import Button from '@/components/ui/Button';
import DebtCard from '@/components/DebtCard';
import LcmHealthSnapshot from '@/components/LcmHealthSnapshot';
import { useMerchant, useDebtSummary } from '@/context/AppContext';

/**
 * DebtSummaryPage — debt overview page (US1 / US-005).
 *
 * Shows:
 * - PageShell with title "Resumo da divida" and back button
 * - DebtCard with total overdue, overdue count, and original contract terms
 * - LcmHealthSnapshot (if LCM data is available)
 * - CTA button "Ver opcoes de renegociacao" linking to /options
 *
 * Edge cases:
 * - If no LCM data (merchant without lcm_profile), hide health section
 *   but still show debt data.
 * - Fat Buddha (0 overdue): shows empty/zero debt state with no error.
 */

export default function DebtSummaryPage() {
  const navigate = useNavigate();
  const merchant = useMerchant();
  const summary = useDebtSummary();

  if (!merchant || !summary) {
    return (
      <PageShell title="Resumo da divida">
        <p className="text-sm text-gray-400">Carregando...</p>
      </PageShell>
    );
  }

  const hasLcm = merchant.lcm_profile !== undefined && merchant.lcm_profile !== null;

  return (
    <PageShell title="Resumo da divida">
      <div className="flex flex-col gap-4">
        {/* Debt card */}
        <DebtCard summary={summary} />

        {/* LCM health snapshot (hidden if no LCM data) */}
        {hasLcm && <LcmHealthSnapshot merchant={merchant} />}

        {/* CTA button */}
        <Button
          variant="primary"
          className="w-full"
          onClick={() => navigate('/options')}
        >
          Ver opcoes de renegociacao
        </Button>
      </div>
    </PageShell>
  );
}

import PageShell from '@/components/ui/PageShell';
import LcmHealthSnapshot from '@/components/LcmHealthSnapshot';
import InstallmentRow from '@/components/InstallmentRow';
import { useMerchant, useContract, useSelectedPlan } from '@/context/AppContext';
import type { Installment } from '@/types';

/**
 * TrackingPage — repayment tracking with vertical timeline.
 *
 * Shows:
 * - LCM health snapshot at top (reuse LcmHealthSnapshot)
 * - Vertical timeline of installments from the selected contract
 * - Each installment: number, due date, amount, status icon + label
 *
 * Accessible from the success screen via "Ver pagamentos" button.
 * Installments come from the selected merchant's contract data.
 *
 * Edge case: if selectedPlan is null (e.g. navigated directly), show a message.
 */

export default function TrackingPage() {
  const merchant = useMerchant();
  const contract = useContract();
  const selectedPlan = useSelectedPlan();

  // Guard: no merchant data
  if (!merchant) {
    return (
      <PageShell title="Pagamentos">
        <p className="text-center text-gray-400 text-sm mt-8">
          Nenhum comerciante selecionado.
        </p>
      </PageShell>
    );
  }

  // Guard: no selected plan (direct navigation)
  if (!selectedPlan) {
    return (
      <PageShell title="Pagamentos">
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Nenhum plano selecionado.
          </p>
        </div>
      </PageShell>
    );
  }

  // Guard: no contract data
  if (!contract) {
    return (
      <PageShell title="Pagamentos">
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Nenhum contrato encontrado.
          </p>
        </div>
      </PageShell>
    );
  }

  // Sort installments by number ascending
  const installments: Installment[] = [...contract.installments].sort(
    (a, b) => a.installmentNumber - b.installmentNumber,
  );

  // Summary counts for header
  const paidCount = installments.filter((i) => i.status === 'paid').length;
  const totalCount = installments.length;

  return (
    <PageShell title="Pagamentos">
      <div className="flex flex-col gap-4">
        {/* LCM Health Snapshot at top */}
        <LcmHealthSnapshot merchant={merchant} />

        {/* Plan + contract summary */}
        <section className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Plano em andamento
          </h2>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">
              {selectedPlan.installments}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPlan.monthlyAmount)}
            </span>
            {' — '}
            {paidCount} de {totalCount} parcelas pagas
          </p>
        </section>

        {/* Installment timeline */}
        <section className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Linha do tempo
          </h2>
          <div className="flex flex-col">
            {installments.map((inst, idx) => (
              <InstallmentRow
                key={inst.installmentNumber}
                installment={inst}
                isLast={idx === installments.length - 1}
              />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

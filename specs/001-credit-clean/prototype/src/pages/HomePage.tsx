import NotificationBanner from '@/components/NotificationBanner';
import PageShell from '@/components/ui/PageShell';

/**
 * HomePage — simulated Gestor de Pedidos home with notification banner.
 *
 * Shows:
 * - NotificationBanner at top (sticky, non-blocking) — only visible
 *   when merchant has overdue debt and flow is not confirmed
 * - Mock Gestor de Pedidos home below:
 *   - iFood logo placeholder
 *   - "Gestor de Pedidos" title
 *   - Order stats skeleton (simulated dashboard cards)
 *
 * Edge cases:
 * - Banner hidden when flowState is 'confirmed' (handled by NotificationBanner)
 * - Banner hidden when merchant has 0 overdue (e.g., Fat Buddha)
 * - No horizontal scroll at 390x844 (container constrained by App.tsx)
 */

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Notification banner — sticky at top */}
      <NotificationBanner />

      {/* Gestor de Pedidos mock home */}
      <PageShell title="Gestor de Pedidos" className="!pt-0 !px-0">
        <div className="flex flex-col gap-4 px-4 pt-4">

          {/* iFood logo placeholder */}
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              {/* Logo circle */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-ifood-red text-white">
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
                  aria-hidden="true"
                >
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
              </div>
              <span className="text-sm text-gray-400">iFood</span>
            </div>
          </div>

          {/* Welcome card */}
          <div className="bg-ifood-red rounded-xl p-4 text-white">
            <p className="text-xs font-medium opacity-80">Bem-vindo de volta</p>
            <p className="text-lg font-bold mt-1">
              Gestor de Pedidos
            </p>
            <p className="text-xs mt-1 opacity-80">
              Gerencie seus pedidos e acompanhe seu negocio
            </p>
          </div>

          {/* Order stats (mock data for prototype Gestor home) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-400">Pedidos hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              <p className="text-xs text-green-600 mt-1">↑ 3 novos</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-400">Faturamento</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">R$ 384,00</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% vs. ontem</p>
            </div>
          </div>

          {/* Recent orders (mock data for prototype) */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900">Pedidos recentes</p>
            <div className="mt-3 space-y-2">
              {[
                { id: '#2841', item: 'Acai de 700ml', time: '14:32', amount: 'R$ 32,00' },
                { id: '#2840', item: 'Acai de 500ml', time: '14:15', amount: 'R$ 24,00' },
                { id: '#2839', item: 'Acai de 300ml', time: '13:58', amount: 'R$ 18,00' },
              ].map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 shrink-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{order.item}</p>
                    <p className="text-xs text-gray-400">{order.id} · {order.time}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 flex-shrink-0">{order.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
}

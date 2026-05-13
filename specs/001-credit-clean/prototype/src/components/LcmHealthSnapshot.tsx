import type { Merchant } from '@/types';

/**
 * LcmHealthSnapshot — displays the merchant's business health data from
 * their LCM profile: customer rating, top items, trending items (with
 * share change arrows), and a "Seu negocio esta gerando receita" message.
 *
 * Trend line parsing: LCM trending items have the format:
 *   "Item Name (share X% -> Y%)"
 * This component extracts the item name and renders the share change
 * as "Item Name (X% → Y%)" using → (U+2192) arrow.
 *
 * Edge case: if merchant has no LCM profile data, the parent should
 * hide this component entirely.
 */

export interface LcmHealthSnapshotProps {
  merchant: Merchant;
}

interface ParsedTrending {
  name: string;
  from: string;
  to: string;
}

/**
 * Parse a trending item string like:
 *   "Acai de 500ml (share 25.86% -> 31.20%)"
 * into:
 *   { name: "Acai de 500ml", from: "25,86%", to: "31,20%" }
 *
 * Returns null if the string doesn't match the expected format.
 */
function parseTrendingItem(raw: string): ParsedTrending | null {
  // Match: "Item Name (share X% -> Y%)"
  const match = raw.match(/^(.+?)\s+\(share\s+([\d.]+)%\s*->\s*([\d.]+)%\)$/);
  if (!match) return null;

  const name = match[1];
  const from = parseFloat(match[2]);
  const to = parseFloat(match[3]);

  // Format with pt-BR decimal separator
  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v);

  return {
    name,
    from: fmt(from) + '%',
    to: fmt(to) + '%',
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Avaliacao ${rating}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="#f59e0b"
        stroke="#f59e0b"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span className="text-sm font-semibold text-gray-900">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

export default function LcmHealthSnapshot({ merchant }: LcmHealthSnapshotProps) {
  const lcm = merchant.lcm_profile;
  const health = lcm.performance_and_commercial_health;
  const rating = health.customer_rating;

  // Parse trending items
  const trending = lcm.top_trending_items
    .map(parseTrendingItem)
    .filter((t): t is ParsedTrending => t !== null);

  return (
    <section className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Saude do negocio
      </h2>

      <div className="space-y-4">
        {/* Customer rating */}
        {rating !== null && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Satisfacao:</span>
            <StarRating rating={rating} />
          </div>
        )}

        {/* Top popular items */}
        {lcm.top_popular_items.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Itens mais pedidos</p>
            <ul className="space-y-1">
              {lcm.top_popular_items.slice(0, 3).map((item, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ifood-red flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Trending items (with share change arrows) */}
        {trending.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Em alta</p>
            <ul className="space-y-2">
              {trending.map((item, i) => (
                <li key={i} className="text-sm text-gray-700">
                  <span className="text-ifood-red font-medium">{item.name}</span>
                  <span className="text-gray-500">
                    {' '}
                    ({item.from} → {item.to})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* "Seu negocio esta gerando receita" message */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm text-green-600 font-medium">
            Seu negocio esta gerando receita
          </p>
        </div>
      </div>
    </section>
  );
}

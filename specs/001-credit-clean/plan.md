# Implementation Plan: Credit Clean

**Branch**: `001-credit-clean` | **Date**: 2026-05-12 | **Spec**: [specs/001-credit-clean/spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-credit-clean/spec.md`

## Summary

Credit Clean is a mobile-first prototype (390x844) that lets iFood
merchants view overdue debt, browse renegotiation options, commit to a
plan, and track repayment — all from static fixture data with no
backend. The prototype demonstrates one polished happy path using
Vite + React + TypeScript + Tailwind CSS, loading merchant profiles
from `fixtures/lcm-users.json` and synthetic credit data from an
extended fixture file.

## Technical Context

**Language/Version**: TypeScript 5.x on Node 20+

**Primary Dependencies**: Vite 6, React 19, React Router 7, Tailwind CSS 4

**Storage**: None. All data loaded from static JSON at build time.
Runtime state managed via React Context (useState/useReducer). No
localStorage persistence required — the prototype resets on reload.

**Testing**: Visual inspection at 390x844 in Chrome DevTools. No
automated test suite for the prototype phase (per constitution:
Development Workflow). Lighthouse audit for the 2-second load target.

**Target Platform**: Mobile browser at 390x844 viewport. Desktop
browser with DevTools device emulation is the primary development
and review environment.

**Project Type**: Single-page web application (prototype)

**Performance Goals**: First meaningful paint < 2 seconds on Chrome
DevTools Fast 3G throttle. Total bundle < 200 KB gzipped (Vite +
React + Tailwind tree-shaken is well under this).

**Constraints**: No network calls at runtime. All data from static
JSON. No authentication. pt-BR only. iFood brand (#EA1D2C accent).

**Scale/Scope**: 5 screens in the happy path, 5 fixture merchants,
~15 components.

### Stack Decision

Vite + React + TypeScript + Tailwind is the right choice here because:

1. **5 screens with shared state** — the renegotiation flow has a
   natural navigation sequence (trigger → summary → options → confirm
   → track) that benefits from React Router and shared React Context
   for the selected merchant and plan state. A single HTML file would
   require hand-rolling this navigation and state management.

2. **Component reuse** — the plan card, installment row, LCM health
   snapshot, and currency formatter will each be used on 2+ screens.
   React components avoid copy-paste.

3. **Tailwind on 390x844** — Tailwind's utility classes make
   mobile-first styling fast. The `max-w-[390px]` container pattern
   locks the viewport.

4. **Vite dev server** — hot module reload during development. The
   build output is a static `dist/` folder that can be opened from
   `file://` or served with any static server.

A single HTML file was considered and rejected: 5 screens with
inter-screen navigation, shared merchant selection state, and
currency formatting logic would produce a 1,000+ line file that is
harder to maintain and harder for agents to edit without conflicts.

## Constitution Check

*GATE: Must pass before implementation. Derived from constitution v1.0.0.*

| # | Principle | Gate | Status |
|---|-----------|------|--------|
| I | Mobile-First Viewport | All screens tested at 390x844. No horizontal scroll. Tap targets >= 44x44. | PASS — enforced by Tailwind container + manual check |
| II | Instant Load | FMP < 2s on Fast 3G. No runtime network calls. | PASS — static JSON import, Vite tree-shaking |
| III | Fixture-Driven Data | All merchant data from `fixtures/lcm-users.json`. Synthetic fields flagged `_synthetic: true`. | PASS — fixture extended with credit data |
| IV | iFood Brand | #EA1D2C accent, white/gray backgrounds, Gestor de Pedidos patterns. | PASS — Tailwind config sets brand tokens |
| V | One Polished Path | Ship complete happy path or cut screens. No broken states. | PASS — scope cut trigger: drop US4 (tracking) first |

No constitution violations. Complexity Tracking section not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-credit-clean/
├── spec.md              # Feature specification
├── plan.md              # This file
└── tasks.md             # Task breakdown (created by /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── main.tsx                    # Vite entry, React root, router setup
├── App.tsx                     # Root layout: 390x844 container, debug merchant switcher
├── index.css                   # Tailwind directives + iFood brand tokens
├── data/
│   ├── merchants.ts            # Re-exports fixtures/lcm-users.json with TS types
│   └── credit.ts               # Synthetic credit data (contracts, installments, plans)
├── types/
│   ├── merchant.ts             # Merchant, LcmProfile, ConversionFunnel types
│   └── credit.ts               # Contract, Installment, RenegotiationPlan, DebtSummary types
├── context/
│   └── AppContext.tsx           # Selected merchant, selected plan, flow state
├── hooks/
│   ├── useMerchant.ts          # Read current merchant from context
│   ├── useDebtSummary.ts       # Derive debt summary from credit data
│   └── useCurrency.ts          # pt-BR currency formatter (R$ 1.800,00)
├── components/
│   ├── NotificationBanner.tsx  # US5: red banner with overdue amount
│   ├── DebtCard.tsx            # US1: total balance, overdue count, contract terms
│   ├── LcmHealthSnapshot.tsx   # US1: rating, top items, trending items from LCM
│   ├── PlanCard.tsx            # US2: single renegotiation option card
│   ├── ConfirmSheet.tsx        # US3: confirmation summary bottom sheet
│   ├── SuccessScreen.tsx       # US3: confirmation success state
│   ├── InstallmentRow.tsx      # US4: single installment in tracking timeline
│   ├── MerchantSwitcher.tsx    # Debug: triple-tap logo to switch fixture merchant
│   └── ui/
│       ├── Button.tsx          # iFood-styled button (44x44 min tap target)
│       ├── Badge.tsx           # Status badge (em atraso / pago / a vencer)
│       └── PageShell.tsx       # Screen wrapper: back nav, title, safe area padding
├── pages/
│   ├── HomePage.tsx            # US5: simulated Gestor home + notification banner
│   ├── DebtSummaryPage.tsx     # US1: debt summary + LCM health
│   ├── OptionsPage.tsx         # US2: list of renegotiation plans
│   ├── ConfirmPage.tsx         # US3: plan confirmation + success
│   └── TrackingPage.tsx        # US4: repayment timeline (cut-eligible)
└── lib/
    └── format.ts               # formatCurrency, formatDate, formatPercent (pt-BR)

fixtures/
└── lcm-users.json              # 5 real LCM merchant profiles (existing)

index.html                      # Vite HTML entry (viewport meta for 390x844)
tailwind.config.ts              # iFood brand colors, font stack
vite.config.ts                  # Standard Vite React config
tsconfig.json                   # Strict mode, path aliases
package.json                    # Dependencies
```

**Structure Decision**: Single-project SPA. No backend directory — the
constitution forbids runtime network calls. The `data/` directory
contains static fixture imports and synthetic credit data, not a
database layer. The `fixtures/` directory stays at repo root because
it is shared across specs and the pitch deck.

### Data Architecture

The prototype uses two data sources, both static:

1. **`fixtures/lcm-users.json`** (existing, real data) — merchant
   profiles with LCM representations. Imported as a typed array at
   build time via `src/data/merchants.ts`.

2. **`src/data/credit.ts`** (new, synthetic) — credit contracts,
   installments, and renegotiation plans for each fixture merchant.
   Every field carries `_synthetic: true`. This file is the only
   place where invented financial data lives.

State flow:

```
fixtures/lcm-users.json ──→ merchants.ts ──→ AppContext (selectedMerchant)
src/data/credit.ts ─────────→ useDebtSummary() ──→ DebtSummaryPage
                             → OptionsPage (plans)
                             → ConfirmPage (selectedPlan)
                             → TrackingPage (installments)
```

The `AppContext` holds:
- `selectedMerchantId: string` — current frn_id from fixture
- `selectedPlanId: string | null` — chosen renegotiation plan
- `flowState: 'idle' | 'viewing' | 'options' | 'confirming' | 'confirmed'`

When the merchant confirms a plan, `flowState` moves to `'confirmed'`
and the notification banner hides. This is local state only — it
resets on page reload.

### Routing

React Router with 5 routes:

| Path | Page | User Story |
|------|------|------------|
| `/` | HomePage | US5 |
| `/debt` | DebtSummaryPage | US1 |
| `/options` | OptionsPage | US2 |
| `/confirm` | ConfirmPage | US3 |
| `/tracking` | TrackingPage | US4 |

Navigation is linear (forward through the happy path) with a back
button on each screen. No sidebar, no tab bar — this is a focused
flow, not an app shell.

### iFood Brand Tokens (Tailwind)

```
ifood-red:      #EA1D2C    (primary accent, CTA buttons, notification banner)
ifood-red-dark: #C4162A    (hover/active state)
gray-50:        #F9FAFB    (page background)
gray-100:       #F3F4F6    (card background)
gray-900:       #111827    (primary text)
gray-500:       #6B7280    (secondary text)
green-600:      #059669    (success: paid installments, confirmed state)
amber-500:      #F59E0B    (warning: overdue badge)
```

Font stack: `'Inter', system-ui, -apple-system, sans-serif` —
matches Gestor de Pedidos approximation. If the team obtains the
exact iFood font, update `tailwind.config.ts` only.

### Synthetic Credit Fixture Schema

Each fixture merchant gets a credit entry in `src/data/credit.ts`:

```typescript
interface CreditContract {
  _synthetic: true;
  contractId: string;
  merchantFrnId: number;
  originalAmount: number;       // e.g., 3000.00
  termMonths: number;           // e.g., 12
  monthlyInstallment: number;   // e.g., 275.00
  interestRatePct: number;      // e.g., 2.5
  disbursementDate: string;     // ISO date
  installments: Installment[];
}

interface Installment {
  _synthetic: true;
  number: number;               // 1-based
  dueDate: string;              // ISO date
  amount: number;
  status: 'paid' | 'overdue' | 'upcoming';
}

interface RenegotiationPlan {
  _synthetic: true;
  planId: string;
  contractId: string;
  newTermMonths: number;
  newMonthlyAmount: number;
  totalCost: number;
  firstPaymentDate: string;     // ISO date
}
```

Example for Acaiteria Ki Sabor (frn_id 2992974):
- Contract: R$3,000 over 12 months at R$275/month
- 10 installments paid, 2 overdue (total overdue: R$550 + late fees = ~R$600)
  [NEEDS CLARIFICATION: The sixpager uses R$1,800 as the example
  debt amount. We need to decide whether the prototype uses R$1,800
  (matching the sixpager narrative) or a calculated amount from the
  synthetic contract. Recommend R$1,800 to match the press release.]
- 3 renegotiation plans:
  - Plan A: 6x R$320/month (total R$1,920)
  - Plan B: 12x R$165/month (total R$1,980) — the plan from the sixpager
  - Plan C: 18x R$115/month (total R$2,070)

## Complexity Tracking

No constitution violations. This section is intentionally empty.

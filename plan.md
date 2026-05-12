# Implementation Plan: Credit Clean Prototype

**Branch**: `credit-clean-prototype` | **Date**: 2026-05-12 | **Spec**: `./spec.md`

**Input**: Feature specification from `./spec.md`

## Summary

Build a single-file HTML prototype that computes a credit score from LCM fixture
data and presents a personalized weekly-boleto loan offer. The prototype serves
one polished happy path: merchant select → score reveal → offer → terms breakdown.
Mobile-first (390×844px), <2s interactive, iFood Pago brand, no backend.

## Technology Decision: Vanilla HTML + CSS + JS (Single File)

**Explicitly choosing vanilla over Vite + React + TypeScript + Tailwind.**

Reasons:

1. **Constitution mandate** (Principle IV): "Build as a single self-contained HTML
   file with inline CSS and JS. Bundle the fixture data as a JS constant. No build
   step required — open in browser." This is a NON-NEGOTIABLE constraint.
2. **Deployment constraint**: Must function as a static deployment — GitHub Pages,
   local file open. A React build adds a mandatory `npm run build` step that
   violates this.
3. **Performance budget**: FMP <1s, interactive <2s. A vanilla file with ~200KB of
   inline fixture data and no framework overhead meets this trivially. React + Tailwind
   would add 40KB+ of runtime before any app code runs.
4. **Scope**: 4 screens, ~500 lines of JS logic (scoring + UI). No state management
   complexity, no component reuse at scale, no routing library needed. React would be
   over-engineering for this scope.
5. **Agent maintainability**: A single HTML file is easier for agents to read, modify,
   and validate in one pass than a multi-file React project with build tooling.

The Playwright acceptance tests (in `prototype/tests/acceptance/`) will be the only
part that uses Node.js tooling — the prototype itself remains zero-dependency.

## Technical Context

**Language/Version**: HTML5, CSS3, ES2020+ (vanilla JavaScript, no transpilation)

**Primary Dependencies**: None for the prototype. Google Fonts (Montserrat) is the
single allowed external resource. Playwright for acceptance tests only.

**Storage**: N/A — all data is bundled inline from `fixtures/lcm-users.json`

**Testing**: Playwright (acceptance tests), manual viewport testing at 390×844px

**Target Platform**: Mobile browser (Chrome/Safari), 390×844px viewport (App do Parceiro equivalent)

**Project Type**: Single-file web prototype (static HTML)

**Performance Goals**: First meaningful paint <1s, fully interactive <2s, zero network requests for data

**Constraints**: No backend, no build step, no external APIs, single HTML file, 390×844px viewport

**Scale/Scope**: 5 addressable merchants, 4 screens, 1 happy path

## Constitution Check

*GATE: All principles validated before implementation.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. One Polished Path | ✅ PASS | Plan implements exactly one flow: select → score → offer → terms. No stubs, no grey buttons. |
| II. LCM-Driven Credit Scoring | ✅ PASS | Full weighted scoring model implemented client-side from fixture data. 4 categories, normalize() function, tier mapping. |
| III. Mobile-First Prototype | ✅ PASS | All layouts designed for 390×844px. Min tap target 44×44px. No horizontal scroll. |
| IV. Fixture-Powered (No Backend) | ✅ PASS | Single HTML file, fixture data as JS constant, no API calls, opens from filesystem. |
| V. iFood Pago Brand Fidelity | ✅ PASS | Colors (#EA1D2C, #F5F0EB, #404040), Montserrat, 16px grid, 12px card radius, 24px button radius, logo on financial screens. |

No constitution violations. Complexity tracking not needed.

## Project Structure

### Documentation (this feature)

```text
./
├── spec.md              # Feature specification (done)
├── plan.md              # This file
├── tasks.md             # Task breakdown (next step)
└── sixpager.md          # Product context document
```

### Source Code

```text
prototype/
├── index.html                    # The single-file prototype (all CSS + JS inline)
├── README.md                     # How to open/test the prototype
└── tests/
    └── acceptance/
        ├── package.json          # Playwright dependency only
        ├── playwright.config.ts  # Config: 390×844 viewport, local file serving
        ├── merchant-score.spec.ts        # User Story 1: score display
        ├── personalized-offer.spec.ts    # User Story 2: offer presentation
        ├── happy-path-e2e.spec.ts        # User Story 3: full flow navigation
        └── terms-clarity.spec.ts         # User Story 4: terms breakdown
```

**Structure Decision**: Single HTML file at `prototype/index.html` (the deliverable)
with Playwright acceptance tests alongside. The prototype IS one file; the tests
validate it externally. Fixture data lives at `fixtures/lcm-users.json` in the repo
root and is copied inline into `index.html` during implementation.

## Architecture

### Screen Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  1. MERCHANT    │     │  2. SCORE        │     │  3. OFFER       │     │  4. TERMS        │
│     SELECT      │────▶│     REVEAL       │────▶│     DETAILS     │────▶│     BREAKDOWN    │
│                 │     │                  │     │                 │     │                  │
│ - Merchant list │     │ - Score 0-1000   │     │ - Max limit     │     │ - Weekly parcels │
│ - Brand/city    │     │ - 4 categories   │     │ - Term options  │     │ - Amount/parcel  │
│ - Tap to select │     │ - Tier badge     │     │ - Rate display  │     │ - Total cost     │
│                 │     │ - Animation      │     │ - Amount slider │     │ - CET            │
│                 │     │                  │     │                 │     │ - Late rules     │
└─────────────────┘     └──────────────────┘     └─────────────────┘     └──────────────────┘
```

### Scoring Engine (client-side JS)

```javascript
// Pseudocode — exact implementation in index.html
function computeScore(merchant) {
  const profile = merchant.lcm_profile;

  const revenue = (
    normalize(profile.avg_daily_orders * profile.average_ticket, 0, 5000) * 0.25 +
    normalize(profile.catalog_visits_4w, 0, 15000) * 0.08 +
    normalize(profile.purchase_pct, 0, 30) * 0.07
  );

  const reliability = (
    normalize(profile.customer_rating, 0, 5) * 0.12 +
    (1 - normalize(profile.cancellation_rate_pct, 0, 10)) * 0.08 +
    normalize(profile.quality_score, 0, 5) * 0.05 +
    (1 - normalize(profile.late_delivery_pct, 0, 30)) * 0.05
  );

  const growth = (
    trendingMomentum(profile.top_trending_items) * 0.10 +
    normalize(profile.total_reviews, 0, 800) * 0.05 +
    funnelHealth(profile.added_to_cart_pct, profile.purchase_pct) * 0.05
  );

  const maturity = (
    normalize(profile.chain_locations, 1, 10) * 0.04 +
    classificationBonus(profile.performance_classification) * 0.04 +
    daypartDiversity(profile.dominant_daypart) * 0.02
  );

  return Math.round((revenue + reliability + growth + maturity) * 1000);
}
```

### Weekly Parcel Calculation

```javascript
// Monthly rate → weekly rate (compound conversion)
// weekly_rate = (1 + monthly_rate)^(1/4) - 1
function weeklyRate(monthlyRate) {
  return Math.pow(1 + monthlyRate, 1/4) - 1;
}

// Amortization: equal principal + compound interest on remaining balance
function calculateParcels(principal, months, monthlyRate) {
  const weeks = months * 4.33;  // approximate
  const N = Math.round(weeks);
  const wRate = weeklyRate(monthlyRate);
  const principalPerParcel = principal / N;

  const parcels = [];
  let remaining = principal;
  for (let i = 0; i < N; i++) {
    const interest = remaining * wRate;
    parcels.push({
      week: i + 1,
      principal: principalPerParcel,
      interest: interest,
      total: principalPerParcel + interest,
    });
    remaining -= principalPerParcel;
  }
  return parcels;
}
```

### CSS Architecture (inline)

```css
/* Design tokens matching iFood Pago brand */
:root {
  --ifood-red: #EA1D2C;
  --cream: #F5F0EB;
  --dark: #404040;
  --white: #FFFFFF;
  --grid: 16px;
  --section-gap: 24px;
  --card-radius: 12px;
  --btn-radius: 24px;
  --tap-min: 44px;
}

/* Single-column, 390px max-width, centered */
body { max-width: 390px; margin: 0 auto; min-height: 844px; }
```

## Implementation Phases

### Phase 1: Scoring Engine (P1 — User Story 1)

Build and validate the scoring algorithm against all 10 fixture merchants before
any UI exists. Output scores to console; verify tier assignments match the
constitution's expected results.

**Deliverable**: `computeScore()` function producing correct scores for all merchants.

### Phase 2: Screen 1 — Merchant Select (P1 — User Story 3 partial)

Render the merchant selection screen. List all merchants with non-null `merchant_id`
(currently 5). Show brand name, city, and cuisine. Tap to proceed.

**Deliverable**: Working first screen, 390×844px, iFood Pago brand.

### Phase 3: Screen 2 — Score Reveal (P1 — User Story 1)

Animated score reveal with category breakdown. Score counter animates from 0 to
final value. Four progress bars show Revenue/Reliability/Growth/Maturity. Tier
badge (Excellent/Good/Fair/Developing) prominently displayed.

**Deliverable**: Score screen renders correctly for all 5 selectable merchants.

### Phase 4: Screen 3 — Offer Details (P1 — User Story 2)

Display the personalized offer: max limit, available terms, rate. Allow merchant
to select an amount (within ceiling) and a term. Show real-time weekly parcel
preview as they adjust.

**Deliverable**: Offer screen with interactive amount/term selection.

### Phase 5: Screen 4 — Terms Breakdown (P1/P2 — User Stories 2+4)

Final confirmation screen. Clear breakdown: N weekly boletos, amount per parcel,
total cost, CET, sequential payment rule, late-payment consequences (juros + multa).
iFood Pago logo and trust signals.

**Deliverable**: Terms screen with correct calculations, plain Portuguese, no jargon.

### Phase 6: Polish & Transitions (P1 — User Story 3)

Connect all screens with smooth CSS transitions. Validate end-to-end flow at
390×844px. Ensure all tap targets ≥44×44px. Performance audit: must be interactive
<2s from file open.

**Deliverable**: Complete happy path, pixel-perfect, animated, performant.

### Phase 7: Acceptance Tests (scaffold)

Set up Playwright project in `prototype/tests/acceptance/`. Write one spec file per
User Story with the acceptance scenarios from spec.md. Tests run against the local
`index.html` file served via Playwright's built-in static server.

**Deliverable**: 4 test files with scenario stubs, `playwright.config.ts` configured
for 390×844 viewport.

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Score values don't match expected tiers for all merchants | Phase 1 validates scoring before any UI work. Fix the model first. |
| Single HTML file becomes unwieldy (>2000 lines) | Acceptable for prototype scope. Use clear `// === SECTION ===` comments. Keep under 3000 lines. |
| Google Fonts blocks <1s FMP | Use `font-display: swap` and system fallback. The prototype works without Montserrat loading. |
| Weekly compound interest calculation edge cases | Validate with spreadsheet for 3 scenarios in Phase 5. Document formula in code comments. |
| Playwright tests can't open local HTML files | Use Playwright's `webServer` config to serve the directory on localhost during test runs. |

## Definition of Done

- [ ] `prototype/index.html` opens in browser from filesystem with no errors
- [ ] All 5 selectable merchants produce correct tier assignments
- [ ] Full happy path completes in <10s interaction time at 390×844px
- [ ] No horizontal scrolling on any screen
- [ ] All tap targets ≥44×44px
- [ ] FMP <1s, interactive <2s (measured via DevTools Performance tab)
- [ ] Weekly parcel math validated against manual calculation for 3 scenarios
- [ ] iFood Pago brand audit passes (colors, fonts, spacing, radius, logo)
- [ ] 4 Playwright spec files scaffolded with scenario stubs
- [ ] Constitution principles I–V all satisfied (re-check at completion)

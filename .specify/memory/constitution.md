<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0 (initial ratification)
- Added principles: I. One Polished Path, II. LCM-Driven Credit Scoring,
  III. Mobile-First Prototype, IV. Fixture-Powered (No Backend),
  V. iFood Pago Brand Fidelity
- Added sections: Prototype Constraints, Credit Score Model, Development Workflow
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no update needed (generic)
  - .specify/templates/spec-template.md — ✅ no update needed (generic)
  - .specify/templates/tasks-template.md — ✅ no update needed (generic)
- Follow-up TODOs: none
-->

# Credit Clean Prototype Constitution

## Core Principles

### I. One Polished Path (NON-NEGOTIABLE)

Ship one complete, delightful happy path rather than multiple half-broken features.
The prototype MUST demonstrate a single flow end-to-end: merchant opens app →
sees credit score → receives personalized offer → understands terms. Every screen
in this path MUST be pixel-perfect, animated, and responsive on a 390×844 viewport.
Features outside this path do not exist — no stubs, no "coming soon", no grey buttons.

### II. LCM-Driven Credit Scoring

The credit score MUST be computed from real LCM merchant profile signals available
in `fixtures/lcm-users.json`. The scoring model uses these categories:

**Revenue Capacity (40% weight)**
- `avg_daily_orders` — order velocity is the strongest predictor of repayment capacity
- `average_ticket` — combined with velocity, yields monthly revenue estimate
- `catalog_visits_4w` — demand pipeline (leading indicator of future orders)
- `purchase_pct` (conversion rate) — efficiency of turning visits into revenue

**Operational Reliability (30% weight)**
- `customer_rating` — sustained quality correlates with business longevity
- `cancellation_rate_pct` — operational failures signal financial stress (inverse)
- `quality_score` — iFood's internal quality program compliance
- `late_delivery_pct` — fulfillment discipline (inverse)

**Growth Trajectory (20% weight)**
- `top_trending_items` share delta — growing item share = growing business
- `total_reviews` — review velocity indicates customer base growth
- `added_to_cart_pct` vs `purchase_pct` ratio — funnel health

**Business Maturity (10% weight)**
- `chain_locations` — multi-unit signals operational maturity
- `performance_classification` — iFood's own tier (CONTA ESTRATEGICA > LONG TAIL)
- Daypart diversification — multiple dayparts = more stable revenue

The model MUST produce a score from 0-1000 and map to a credit limit (R$1K-R$10K)
and term (3-9 months). Given a `merchant_id`, the system looks up the fixture data,
computes the score, and presents the offer.

### III. Mobile-First Prototype

The prototype MUST render correctly on a 390×844px viewport (iPhone 14 / App do
Parceiro standard). All layouts, touch targets, font sizes, and spacing MUST be
designed for this viewport first. No horizontal scrolling. Minimum tap target 44×44px.
The prototype MUST load and be interactive in under 2 seconds with no real backend.

### IV. Fixture-Powered (No Backend)

All data comes from `fixtures/lcm-users.json`. No API calls, no database, no server.
The scoring algorithm runs client-side in the browser/app. The merchant_id lookup
is a simple array filter on the fixture data. This constraint is absolute — the
prototype MUST function as a static deployment (e.g., GitHub Pages, single HTML file,
or local file open).

### V. iFood Pago Brand Fidelity

The prototype MUST follow iFood Pago visual identity:
- Primary: iFood Red (#EA1D2C) for CTAs and accents
- Background: White (#FFFFFF) and Cream (#F5F0EB)
- Text: Dark Gray (#404040) for body, White on red surfaces
- Typography: Montserrat family (system fallback: -apple-system, sans-serif)
- Spacing: 16px base grid, 24px section spacing
- Corners: 12px border-radius on cards, 24px on primary buttons
- The iFood Pago logo and trust signals MUST appear on financial screens

## Prototype Constraints

**Viewport**: 390×844px (iPhone 14 equivalent for App do Parceiro)

**Performance budget**: First meaningful paint < 1s, fully interactive < 2s.
Achieved by: no external API calls, inline CSS, minimal JS, fixture data bundled.

**Scope boundary**: The prototype covers ONLY the credit offer flow:
1. Merchant identification (by merchant_id)
2. Credit score computation and display
3. Personalized loan offer with terms
4. Clear breakdown of monthly boleto amount

It does NOT cover: payment tracking, renegotiation, badge display, collections,
or any post-origination lifecycle.

**Test data**: All 10 merchants in `fixtures/lcm-users.json`. Of these, merchants
with `merchant_id` (non-null) are addressable in the prototype. Merchants without
`merchant_id` demonstrate the scoring model but cannot be "logged in."

## Credit Score Model

### Input → Score → Offer mapping

```
merchant_id → LCM profile lookup → feature extraction → weighted score (0-1000)
                                                              ↓
                                                     score → tier → offer
```

### Tier Mapping

| Score Range | Tier | Max Limit | Term Options | Rate |
|---|---|---|---|---|
| 800-1000 | Excellent | R$10,000 | 3, 6, 9 months | 3.2%/mo |
| 600-799 | Good | R$7,000 | 3, 6 months | 3.5%/mo |
| 400-599 | Fair | R$4,000 | 3, 6 months | 4.0%/mo |
| 200-399 | Developing | R$2,000 | 3 months | 4.5%/mo |
| 0-199 | Insufficient | Not eligible | — | — |

### Feature Extraction (from LCM profile fields)

```
revenue_score = normalize(avg_daily_orders × average_ticket, 0, 5000) × 0.25
             + normalize(catalog_visits_4w, 0, 15000) × 0.08
             + normalize(purchase_pct, 0, 30) × 0.07

reliability_score = normalize(customer_rating, 0, 5) × 0.12
                  + (1 - normalize(cancellation_rate_pct, 0, 10)) × 0.08
                  + normalize(quality_score, 0, 5) × 0.05
                  + (1 - normalize(late_delivery_pct, 0, 30)) × 0.05

growth_score = trending_momentum(top_trending_items) × 0.10
             + normalize(total_reviews, 0, 800) × 0.05
             + funnel_health(added_to_cart_pct, purchase_pct) × 0.05

maturity_score = normalize(chain_locations, 1, 10) × 0.04
               + classification_bonus(performance_classification) × 0.04
               + daypart_diversity(dominant_daypart) × 0.02

credit_score = (revenue + reliability + growth + maturity) × 1000
```

Where `normalize(value, min, max)` clips to [0,1] range and handles nulls as 0.

## Development Workflow

1. **Score model first**: Implement and validate the scoring algorithm against all
   10 fixture merchants. Verify the scores produce sensible tier assignments before
   building any UI.

2. **Single HTML prototype**: Build as a single self-contained HTML file with
   inline CSS and JS. Bundle the fixture data as a JS constant. No build step
   required — open in browser.

3. **Happy path only**: Implement screens in order: merchant select → score reveal
   → offer details. Polish each screen completely before moving to the next.

4. **Validate on viewport**: Test every screen at exactly 390×844px using browser
   DevTools device emulation. Screenshots at this resolution are the acceptance
   criteria.

## Governance

This constitution governs the Credit Clean prototype (bootcamp deliverable).
Amendments require team consensus and MUST be documented with version increment.
All implementation decisions MUST reference the relevant principle by number.
Complexity beyond what is specified here MUST be justified against Principle I
(One Polished Path).

**Version**: 1.0.0 | **Ratified**: 2026-05-12 | **Last Amended**: 2026-05-12

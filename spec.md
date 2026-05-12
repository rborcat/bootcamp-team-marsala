# Feature Specification: Credit Clean — LCM-Powered Fast Credit Prototype

**Feature Branch**: `credit-clean-prototype`

**Created**: 2026-05-12

**Status**: Draft

**Input**: User description: "Build a single-file HTML prototype that, given a merchant_id, computes a credit score from LCM fixture data and presents a personalized loan offer — mobile-first (390×844), <2s load, iFood Pago brand, no backend."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Merchant Sees Credit Score (Priority: P1)

A merchant opens the prototype, identifies themselves by merchant_id, and immediately sees their computed credit score (0–1000) with a visual breakdown of the four scoring categories (Revenue Capacity, Operational Reliability, Growth Trajectory, Business Maturity).

**Why this priority**: The scoring engine is the core differentiator — without it, the product is just a static mockup. This story validates that the LCM-based underwriting signal produces sensible, explainable scores for all fixture merchants.

**Independent Test**: Can be fully tested by selecting any merchant_id from the fixture data and verifying the displayed score matches the expected tier assignment from the constitution's scoring model.

**Acceptance Scenarios**:

1. **Given** the prototype is loaded and fixture data is bundled, **When** a user selects merchant_id "dk1_lanches_001", **Then** the score displays as ~865 (Excellent tier) with a category breakdown showing Revenue 380/400, Reliability 285/300, Growth 140/200, Maturity 60/100.
2. **Given** the prototype is loaded, **When** a user selects merchant_id "acaiteria_kisabor_001", **Then** the score displays as ~490 (Fair tier) with appropriate category breakdown.
3. **Given** the prototype is loaded, **When** a user selects a merchant_id that does not exist in fixtures, **Then** the prototype shows a graceful "Merchant not found" state (no crash, no blank screen).

---

### User Story 2 - Merchant Receives Personalized Offer (Priority: P1)

After seeing their score, the merchant is presented with a clear, personalized loan offer showing: maximum approved amount, available term options, weekly interest rate, and the weekly boleto amount for each parcel.

**Why this priority**: The offer is the outcome of the scoring engine and the core value proposition for the merchant — "here's what you qualify for." Without it, the score is abstract and unactionable.

**Independent Test**: Can be tested by confirming that the offer parameters (limit, terms, rate) match the tier mapping table for the computed score, and that the weekly boleto amount is arithmetically correct using compound interest.

**Acceptance Scenarios**:

1. **Given** a merchant with score 865 (Excellent), **When** the offer screen renders, **Then** it shows "Até R$10.000" with term options of 3, 6, 9 months and rate of 3.2%/mo (≈0.79%/week).
2. **Given** a merchant with score 490 (Fair), **When** the offer screen renders, **Then** it shows "Até R$4.000" with term options of 3, 6 months and rate of 4.0%/mo (≈0.98%/week).
3. **Given** a merchant selects R$3,000 over 6 months (≈26 weekly parcels) at 4.0%/mo, **When** the terms breakdown renders, **Then** each weekly boleto is calculated as `principal_parcel + compound_interest_for_that_week`, and the total of all parcels equals the principal plus total compound interest.

---

### User Story 3 - Merchant Navigates the Happy Path End-to-End (Priority: P1)

The complete flow works as a seamless, animated sequence: merchant select → score reveal (with animation) → offer details → terms confirmation screen. Each transition is smooth, and every screen is pixel-perfect on a 390×844 viewport.

**Why this priority**: The prototype's purpose is to demonstrate a single polished path. Broken transitions, misaligned elements, or janky animations undermine the pitch. This story validates the UX flow as a cohesive experience.

**Independent Test**: Can be tested by opening the prototype in Chrome DevTools at 390×844 viewport emulation and navigating from merchant selection through to the final terms screen, verifying no horizontal scrolling, all tap targets are ≥44×44px, and all transitions are smooth.

**Acceptance Scenarios**:

1. **Given** the prototype is opened in a 390×844 viewport, **When** the user navigates through all screens, **Then** no horizontal scrollbar appears and all content fits within the viewport.
2. **Given** the prototype is opened, **When** the user completes the full flow from merchant select to terms confirmation, **Then** the total elapsed interaction time is <10 seconds (excluding reading time) with no perceptible lag or layout shift.
3. **Given** any screen in the flow, **When** inspected, **Then** all interactive elements have a minimum tap target of 44×44px.

---

### User Story 4 - Merchant Understands Terms Clearly (Priority: P2)

The final screen shows a clear breakdown of what the merchant will pay: total cost, number of weekly boletos, amount per weekly parcel, total interest paid, and effective annual rate (CET). It also explains the sequential payment rule and late-payment consequences. No jargon, plain Portuguese.

**Why this priority**: Transparency is a tenet. The merchant must understand exactly what they're agreeing to — including the weekly cadence, the compound interest structure, and what happens if they delay a payment.

**Independent Test**: Can be tested by verifying the terms screen for each tier shows all required fields (amount, number of weekly parcels, parcel amount, total cost, CET, late-payment rules) in plain language without financial jargon.

**Acceptance Scenarios**:

1. **Given** a merchant has selected R$4,000 over 6 months at 4.0%/mo, **When** the terms screen renders, **Then** it shows: "26 boletos semanais de R$X", "Total a pagar: R$Y", "Custo Efetivo Total: Z% ao ano", and "Próximo boleto liberado após pagamento do anterior" in plain Portuguese.
2. **Given** any terms screen, **When** read by a non-financial user, **Then** no term requires a glossary to understand (no unexplained acronyms, no "TAC", no "IOF" without explanation).
3. **Given** the terms screen, **When** the merchant reviews late-payment info, **Then** it clearly states: "Em caso de atraso: juros de X% ao dia + multa de Y% sobre o valor da parcela."

---

### Edge Cases

- What happens when a merchant_id maps to a score of 0–199 (Insufficient tier)? → Display a clear "Ainda não temos uma oferta para você" message with explanation of what factors could improve their eligibility.
- What happens when fixture data has null fields for a merchant (e.g., null `quality_score`, null `catalog_visits_4w`)? → The scoring model treats null as 0 for that sub-score (as specified in constitution's `normalize()` function).
- What happens on a viewport wider than 390px (e.g., tablet or desktop)? → The prototype centers the 390px content area with a neutral background. No responsive reflow required.
- What happens if JavaScript is disabled? → JS-required is acceptable. No fallback needed for the prototype.
- What happens if a merchant delays payment of a weekly parcel? → Juros (daily interest) and multa (fixed fine) are applied to the overdue parcel. The next parcel is only generated/unlocked after the current one is paid — the sequence is strictly conditional.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST compute a credit score (0–1000) from LCM fixture data for any merchant with a non-null `merchant_id`, using the weighted formula defined in the constitution (Revenue 40%, Reliability 30%, Growth 20%, Maturity 10%).
- **FR-002**: System MUST map the computed score to a tier (Excellent/Good/Fair/Developing/Insufficient) and present the corresponding offer parameters (max limit, available terms, interest rate).
- **FR-003**: System MUST display a weekly boleto amount when the merchant selects a loan amount and term, calculated using compound interest with weekly parcels. Formula: the loan is split into N weekly installments (e.g., 3 months ≈ 13 weeks, 6 months ≈ 26 weeks, 9 months ≈ 39 weeks). Each weekly boleto = (principal / N) + (remaining_balance × weekly_rate). The weekly rate is derived from the monthly rate via compound conversion: `weekly_rate = (1 + monthly_rate)^(1/4) - 1`.
- **FR-003a**: System MUST enforce sequential payment logic — the next parcel is only presented/unlocked after the previous parcel is paid.
- **FR-003b**: System MUST display late-payment consequences clearly: juros (daily interest on overdue amount) + multa (fixed percentage fine on the parcel value) are applied if a boleto is not paid by its due date.
- **FR-004**: System MUST render all screens correctly on a 390×844px viewport with no horizontal scrolling.
- **FR-005**: System MUST load and become interactive in under 2 seconds with no external API calls (all data bundled as inline JS).
- **FR-006**: System MUST follow iFood Pago visual identity — Primary Red (#EA1D2C), Cream (#F5F0EB), Dark Gray (#404040), Montserrat typography, 12px card radius, 24px button radius.
- **FR-007**: System MUST be deployable as a single self-contained HTML file (inline CSS, inline JS, bundled fixture data) that works when opened from the filesystem.
- **FR-008**: System MUST handle null/missing fields in fixture data gracefully by treating them as 0 in the normalize() function.
- **FR-009**: System MUST show the iFood Pago logo and trust signals on financial screens (offer and terms).
- **FR-010**: System MUST provide a merchant selection mechanism (dropdown or list) showing all merchants with non-null merchant_id from the fixture data.

### Key Entities

- **Merchant**: A restaurant/store partner identified by `merchant_id`, with an `lcm_profile` containing operational metrics (orders, rating, conversion, etc.). Source: `fixtures/lcm-users.json`.
- **Credit Score**: A computed value (0–1000) derived from the merchant's LCM profile using the four-category weighted model. Not persisted — computed on-the-fly client-side.
- **Tier**: A classification (Excellent/Good/Fair/Developing/Insufficient) derived from the score, which determines offer parameters.
- **Offer**: The credit terms presented to the merchant — max amount (R$1K–R$10K), available term lengths (3/6/9 months), and monthly interest rate (3.2%–4.5%) converted to a weekly rate for parcel calculation.
- **Terms Breakdown**: The concrete payment plan — number of weekly boletos (13/26/39), amount per weekly parcel, total cost, CET, and late-payment rules (juros + multa).
- **Parcel Sequence**: The ordered series of weekly boletos where each is unlocked only after payment of the previous one. This enforces payment discipline and limits exposure — if a merchant stops paying, no further principal is disbursed in parcel form.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 5 merchants with non-null `merchant_id` in fixtures produce a valid score that maps to the correct tier per the constitution's tier table.
- **SC-002**: The prototype loads to first meaningful paint in <1 second and is fully interactive in <2 seconds when opened as a local file.
- **SC-003**: Every screen passes a 390×844px viewport test with no overflow, no horizontal scrolling, and minimum 44×44px tap targets.
- **SC-004**: A non-technical user (bootcamp judge) can navigate the full happy path in <30 seconds without instruction.
- **SC-005**: The weekly boleto calculation matches a manual spreadsheet computation for at least 3 different amount/term combinations, confirming correct compound interest conversion from monthly to weekly rate and correct parcel breakdown.
- **SC-006**: Visual identity audit passes — colors, typography, spacing, border-radius, and logo placement all match iFood Pago brand spec within the constitution.

## Assumptions

- The prototype targets a modern browser (Chrome 90+, Safari 15+) with JavaScript enabled. No IE/legacy support.
- Only merchants with non-null `merchant_id` in `fixtures/lcm-users.json` are selectable in the prototype (currently 5 of 10 merchants).
- The prototype is a demonstration tool for the bootcamp — it will not handle real transactions, real money, or real merchant authentication.
- The scoring algorithm runs entirely client-side; no server, API, or database exists.
- Montserrat font will be loaded from Google Fonts (the only allowed external dependency per the iFood HTML slides skill pattern), with system fallback.
- The loan is broken into weekly parcels with compound interest. The monthly rate from the tier table (3.2%–4.5%) is converted to a weekly rate via `(1 + monthly_rate)^(1/4) - 1`. Each weekly boleto = (principal_portion + interest_on_remaining_balance). The next parcel is only issued after the previous one is paid. Late payment incurs juros (daily interest) + multa (fixed fine). This is the definitive amortization model.
- Animation/transition library is not required — CSS transitions and minimal vanilla JS are sufficient for the happy path.
- No accessibility (a11y) audit is required for the prototype, though basic semantic HTML is preferred.
- The "Parceiro em Dia" badge and visibility rewards are mentioned in tenets but are NOT part of this prototype's scope (post-origination lifecycle is explicitly excluded per constitution).

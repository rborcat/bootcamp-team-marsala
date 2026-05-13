# Feature Specification: Credit Clean

**Feature Branch**: `001-credit-clean`

**Created**: 2026-05-12

**Status**: Draft

**Input**: sixpager.md — self-service debt regularization for iFood merchants

## User Scenarios & Testing *(mandatory)*

<!--
  Stories are ordered by the happy path defined in the constitution:
  notification trigger → debt summary → renegotiation options → commit → tracking.
  Each story is independently testable using fixture data from fixtures/lcm-users.json.
  The prototype has no real backend; all state is local.
-->

### User Story 1 — Debt Summary View (Priority: P1)

A merchant with overdue installments taps a notification in Gestor de Pedidos
and lands on a screen showing their total outstanding balance, the number of
overdue installments, and the original contract terms. Below the debt summary,
the screen shows a business health snapshot pulled from their LCM profile:
customer rating, recent order trends, and top-selling items — framed as
evidence that the business is generating revenue.

**Why this priority**: This is the entry point to the entire experience.
Without a clear, accurate debt summary the merchant has no reason to continue.
It is also the screen where the LCM-context-over-coercion hypothesis is
tested: does showing business health alongside debt increase engagement?

**Independent Test**: Load the prototype with the Acaiteria Ki Sabor fixture
(frn_id 2992974). Verify the screen displays the merchant's name, city
(Porto Velho, RO), customer rating (4.9), top item (Acai de 700ml, 99 orders),
and the synthetic debt fields. Verify no horizontal scroll at 390x844.

**Acceptance Scenarios**:

1. **Given** Acaiteria Ki Sabor has 2 overdue installments totaling R$1,800,
   **When** the merchant taps the debt notification,
   **Then** the debt summary screen shows "R$ 1.800,00" as the total balance,
   "2 parcelas em atraso", and the original contract term.

2. **Given** the same merchant,
   **When** the debt summary screen renders,
   **Then** the LCM business health section shows the customer rating (4.9),
   the trending item "Acai de 500ml (25,86% → 31,20%)", and the text
   "Seu negocio esta gerando receita."

3. **Given** a merchant with zero overdue installments (e.g., Fat Buddha,
   frn_id 3059469, if no synthetic debt is added),
   **When** the merchant opens the app,
   **Then** no debt notification appears and the Credit Clean flow is
   inaccessible.

---

### User Story 2 — Renegotiation Options (Priority: P2)

From the debt summary, the merchant taps a call-to-action and sees a list of
renegotiation plans. Each plan shows: the number of installments, the monthly
amount, and the total cost. Plans are generated from the existing credit
collection engine's output for the merchant's risk cluster. The merchant can
compare options side by side. No hidden fees. All amounts in BRL with pt-BR
formatting.

**Why this priority**: The options screen is the decision point. A merchant
who sees their debt but has no actionable next step will leave. This screen
converts awareness into intent.

**Independent Test**: From the debt summary for Acaiteria Ki Sabor, tap
"Ver opcoes". Verify at least 2 renegotiation plans appear, each with
monthly amount and total cost. Verify the plans use pt-BR currency
formatting (e.g., "R$ 165,00/mes").

**Acceptance Scenarios**:

1. **Given** the merchant is on the debt summary screen,
   **When** they tap "Ver opcoes de renegociacao",
   **Then** the options screen displays at least 2 plans with different
   term lengths and monthly amounts.

2. **Given** the options screen is visible,
   **When** the merchant compares two plans,
   **Then** each plan card shows: number of installments, monthly amount
   (R$), total cost (R$), and a clear "Escolher este plano" button.

3. **Given** the options screen is visible at 390x844,
   **When** 3 or more plans are available,
   **Then** the plans are vertically scrollable with no horizontal
   overflow.

---

### User Story 3 — Commit Confirmation (Priority: P3)

The merchant selects a renegotiation plan and sees a confirmation screen
summarizing their choice: the plan they selected, the new monthly amount,
the first payment date, and a clear confirmation button. After confirming,
the screen shows a success state with a summary of the commitment and a
link to the tracking view.

**Why this priority**: Without a commit step, the prototype is informational
only. This story closes the loop and demonstrates the full self-service
renegotiation flow end to end.

**Independent Test**: Select the 12-installment plan for Acaiteria Ki Sabor.
Tap confirm. Verify the success screen shows "Renegociacao confirmada",
the plan details, and a "Ver pagamentos" link. Verify the interaction
updates local state only (no network call).

**Acceptance Scenarios**:

1. **Given** the merchant selected a 12x R$165/month plan,
   **When** they tap "Confirmar renegociacao",
   **Then** a confirmation screen shows the plan summary and asks
   "Confirmar este plano?"

2. **Given** the confirmation screen is displayed,
   **When** the merchant taps "Confirmar",
   **Then** the screen transitions to a success state showing
   "Renegociacao confirmada", the monthly amount, the number of
   installments, and a "Ver pagamentos" button.

3. **Given** the merchant confirms a plan,
   **When** the success screen renders,
   **Then** local state updates to mark the debt as "em renegociacao"
   and the notification badge is removed.

---

### User Story 4 — Repayment Tracking (Priority: P4)

After committing to a plan, the merchant can view a repayment progress
screen showing each installment: paid, upcoming, or overdue. Each on-time
payment is visually acknowledged. The screen also shows the LCM business
health data alongside payment progress so the merchant sees their business
trajectory next to their financial recovery.

**Why this priority**: Tracking is important for retention but is not
required to demonstrate the core renegotiation flow. Per the constitution
(Principle V), if this story cannot be polished within scope, it MUST be
cut rather than shipped incomplete.

**Independent Test**: After committing a plan for Acaiteria Ki Sabor,
navigate to the tracking screen. Verify the installment timeline renders
with at least one "pago" installment and remaining "a vencer" installments.

**Acceptance Scenarios**:

1. **Given** the merchant committed to a 12-installment plan,
   **When** they tap "Ver pagamentos" from the success screen,
   **Then** a tracking screen shows 12 installments in a vertical
   timeline with status indicators (pago / a vencer).

2. **Given** the tracking screen is displayed,
   **When** the first installment is marked as paid (from fixture data),
   **Then** it shows a green check and the text "Pago em [date]".

---

### User Story 5 — Notification Trigger (Priority: P5)

When the merchant opens the prototype, a persistent non-blocking
notification banner appears at the top of the home screen indicating
an outstanding balance needs attention. The banner shows the total
amount owed and a "Resolver agora" call-to-action. Tapping it navigates
to the debt summary (US1).

**Why this priority**: The trigger is the entry point but is the simplest
screen — a single banner component. It depends on the debt summary
existing to navigate to, so it is built after US1.

**Independent Test**: Open the prototype with Acaiteria Ki Sabor loaded.
Verify a red banner appears showing "Voce tem R$ 1.800,00 em atraso"
and a "Resolver agora" button. Tap it and verify navigation to the debt
summary screen.

**Acceptance Scenarios**:

1. **Given** Acaiteria Ki Sabor has overdue installments,
   **When** the merchant opens the prototype home screen,
   **Then** a non-blocking notification banner appears showing the
   total overdue amount and "Resolver agora".

2. **Given** the notification banner is visible,
   **When** the merchant taps "Resolver agora",
   **Then** the app navigates to the debt summary screen (US1).

---

### Edge Cases

- What happens when a merchant has multiple contracts with different
  overdue amounts? [NEEDS CLARIFICATION: Does the debt summary aggregate
  across contracts or show them separately? The sixpager references
  "single-contract long-tail merchants" as the primary target, but
  multi-contract merchants exist.]

- What happens when the credit collection engine returns zero
  renegotiation options for a given merchant/contract?
  The options screen MUST show a message directing the merchant to
  contact support, rather than an empty list.

- What happens when the merchant's LCM profile is missing or has no
  data? The debt summary MUST still render with the financial data;
  the business health section is hidden rather than showing empty state.

- How does the notification behave if the merchant dismisses it?
  [NEEDS CLARIFICATION: Does it reappear on next app open, or is
  there a cooldown period?]

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The prototype MUST load all merchant data from
  `fixtures/lcm-users.json` with no external network calls.

- **FR-002**: The prototype MUST render correctly at 390x844 viewport
  with no horizontal scroll on any screen.

- **FR-003**: The debt summary screen MUST display the total overdue
  balance, number of overdue installments, and original contract terms.

- **FR-004**: The debt summary screen MUST display the merchant's LCM
  business health data (customer rating, top items, trending items)
  when available.

- **FR-005**: The renegotiation options screen MUST display at least 2
  plan options, each showing installment count, monthly amount (R$),
  and total cost (R$).

- **FR-006**: All currency values MUST use pt-BR formatting
  (e.g., "R$ 1.800,00").

- **FR-007**: The commit confirmation screen MUST summarize the
  selected plan and require explicit merchant confirmation before
  updating state.

- **FR-008**: The prototype MUST NOT auto-debit, auto-select plans,
  or take any action without explicit merchant confirmation (per the
  tenet "the merchant is the actor, not the audience").

- **FR-009**: The prototype MUST reach first meaningful paint in under
  2 seconds on a simulated Fast 3G connection.

- **FR-010**: All interactive elements MUST have tap targets of at
  least 44x44 points.

- **FR-011**: The prototype MUST use iFood brand colors (#EA1D2C
  primary accent) and follow Gestor de Pedidos visual patterns.

- **FR-012**: The prototype MUST be in Brazilian Portuguese (pt-BR)
  only.

- **FR-013**: Credit/debt data not present in the fixture file MUST be
  added to the fixture with a `_synthetic: true` flag.

- **FR-014**: State changes from renegotiation commitment MUST update
  local state only (no backend writes in the prototype).

- **FR-015**: The prototype MUST support switching between fixture
  merchants via a hidden debug control (e.g., triple-tap on the logo)
  for reviewer convenience.

- **FR-016**: Renegotiation options MUST come from
  [NEEDS CLARIFICATION: the existing credit collection engine API
  contract needs to be documented. For the prototype, we use synthetic
  fixture data representing 2-3 plan options per merchant.]

### Key Entities

- **Merchant**: Identified by `frn_id` and `merchant_id`. Carries LCM
  profile data (rating, top items, conversion funnel, trending items),
  city, state, cuisine, and performance classification. Source:
  `fixtures/lcm-users.json`.

- **Credit Contract**: A loan extended to a merchant via iFood Pago /
  MovilePay. Key attributes: original amount, term length, monthly
  installment amount, interest rate, disbursement date. Source: synthetic
  fixture data (`_synthetic: true`).

- **Installment**: A single scheduled payment within a contract. Key
  attributes: due date, amount, status (paid / overdue / upcoming).
  Source: synthetic fixture data.

- **Renegotiation Plan**: An alternative payment arrangement offered to
  a merchant with overdue installments. Key attributes: new term length,
  new monthly amount, total cost, first payment date. Source: synthetic
  fixture data representing credit engine output.

- **Debt Summary**: An aggregate view combining: total overdue balance
  (sum of overdue installments), count of overdue installments, and
  original contract terms. Derived from Contract and Installment entities.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can complete the full happy path (notification
  → debt summary → options → commit → success) for Acaiteria Ki Sabor
  in under 60 seconds on a 390x844 viewport.

- **SC-002**: All 5 fixture merchants from `lcm-users.json` render
  correctly on the debt summary screen when selected via the debug
  control.

- **SC-003**: First meaningful paint is under 2 seconds on Chrome
  DevTools Fast 3G throttle (measured via Lighthouse or manual
  stopwatch).

- **SC-004**: Zero horizontal scroll occurs on any screen at 390x844
  (verified by visual inspection in Chrome DevTools device emulation).

- **SC-005**: All currency values on all screens use pt-BR formatting
  with the R$ symbol.

- **SC-006**: No screen in the happy path contains placeholder text,
  broken images, or non-functional buttons.

## Assumptions

- The merchant is already authenticated. The prototype does not
  implement login or session management.

- The prototype runs in a mobile browser or desktop browser with
  DevTools set to 390x844. No native iOS/Android build is required.

- Credit/debt data (contracts, installments, renegotiation plans) is
  not available in the real LCM fixtures and will be added as synthetic
  data with `_synthetic: true` flags.

- The renegotiation plans shown are illustrative. The real credit
  collection engine's API contract and business rules for plan
  generation are not yet documented. [NEEDS CLARIFICATION: We need
  the credit team to share the renegotiation option schema and any
  guardrails on repeat renegotiation.]

- The LCM merchant profiles in the fixture file are from January 2026
  (`generation_date: 2026-01-14`). The prototype treats this data as
  current for demo purposes.

- iFood brand assets (logo, exact font files) will be sourced from
  [NEEDS CLARIFICATION: Is there an internal brand asset CDN or
  Figma library we should reference? For the prototype we will use
  the iFood red #EA1D2C and Inter/system fonts as a reasonable
  approximation.]

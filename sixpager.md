# Credit Clean: Fast Credit for Underserved Merchants, Powered by LCM Intelligence

**Team Marsala | May 2026 | DRAFT v0.3**

---

## 1. Context

iFood's merchant credit program operates two tiers today. The first tier — credit against receivables — serves merchants with predictable iFood revenue: the loan is repaid automatically from future sales, risk is low, and the product scales cleanly. But this tier excludes a large segment of the merchant base: those with low or irregular iFood volume, newer merchants without track record, and long-tail restaurants whose receivables are too small to collateralize.

These excluded merchants still need working capital. They need a freezer, a delivery bag, an ingredient bulk buy, a rent advance. Today, their options are predatory lenders, personal credit cards at 15% monthly, or going without. iFood has no product for them — not because the data doesn't exist to assess their risk, but because the existing credit model was designed around receivables, and these merchants don't have enough receivables to qualify.

**The cost of this gap is large — for the merchant and for iFood.** A merchant who can't fund operations stagnates or churns. A churned merchant is a triple loss: (1) lost future GMV and commissions, (2) reduced marketplace density in their neighborhood (fewer restaurants → fewer consumer orders → fewer merchants want to join), and (3) a missed fintech revenue opportunity. The merchants we exclude from credit today are precisely those who need it most to grow into tomorrow's strategic accounts.

Three things changed that make this problem solvable now:

1. **LCM merchant representations went live (Jan 2026).** For the first time, iFood has a rich, AI-generated profile of every merchant — order velocity, conversion funnel, customer rating, trending items, operational reliability. This is a credit signal that the existing underwriting model ignores. A merchant doing 2.6 orders/day with 4.9 stars and rising item share is not the same risk as a merchant doing 1 order/day with declining metrics — even if both have the same (insufficient) receivables. The LCM profile lets us underwrite merchants that receivables alone cannot.

2. **The overdue cost structure demands smarter origination.** The current program extends larger loans with longer terms. When these go overdue, iFood carries high absolute exposure for extended periods. A R$10,000 loan at 24 months that defaults at month 6 leaves R$7,500+ at risk — and with manual collections, recovery is slow and expensive. The answer isn't just better collections; it's better loan sizing from the start, informed by what we actually know about the merchant's business.

3. **Churn from financial stress is measurable — and it compounds.** The `merchants_history` table shows that merchants who can't access capital (or who get overleveraged) churn at higher rates. Each churned merchant removes supply from the marketplace, degrading the consumer experience in their area. Keeping merchants financially healthy is not charity — it's marketplace infrastructure.

Credit Clean is a fast-credit product for merchants who don't qualify for receivables-based lending. It uses the LCM merchant profile as the primary underwriting signal, offers right-sized loans with shorter terms, collects via boleto, and provides a self-service experience for managing the debt lifecycle — from origination through renegotiation if needed.

---

## 2. Customer & Problem

We chose two reference merchants to represent the underserved segment:

### The Growing Long-Tail: Acaiteria Ki Sabor (frn_id 2992974)

A single-location acai shop in Porto Velho, RO. LONG TAIL classification, ~2.6 orders/day, 4.9 stars, R$30 average ticket. Customer love is high, but iFood volume is too low to qualify for receivables-based credit.

> "My acai shop has been growing for two years. 4.9 stars, 55 reviews, people love the portions. My Acai de 500ml went from 25% to 31% of orders last month. But I need R$3,000 for a new freezer — my current one is failing and I'm losing product.
>
> I applied for iFood credit and got rejected. They said my volume was too low. I understand — I do 2-3 orders a day on iFood. But my customers are loyal, my ratings are perfect, and I also sell walk-in. I'm not a bad risk — I'm just small on the platform.
>
> My only option now is a personal loan at 12% monthly from a financeira. Or I keep running with a broken freezer and eventually lose more product than the loan would have cost.
>
> What I need is simple: a small, fast loan — R$3,000 — that I can pay back in 6 months via boleto. If iFood looked at my actual business health instead of just my iFood sales volume, they'd see I'm good for it."

### The New Entrant: Smash Roots Burger (frn_id 3144766)

An artisanal burger joint in Luziânia, GO (Greater Brasília metro). Single location, 4.6 stars, 45 reviews, VERY_CHEAP pricing. On the platform for less than a year — no receivables history to speak of, but strong early signals.

> "I opened Smash Roots six months ago. We're already at 4.6 stars and growing. My Smash Triple is the hero item. Conversion rate is 12% — people who find us, buy from us.
>
> I need R$5,000 to add a second prep station. Friday and Saturday nights I'm turning away orders because I can't keep up. That's lost revenue for me AND for iFood.
>
> I tried the iFood credit but I haven't been on the platform long enough. No receivables track record. But look at my growth curve — 45 reviews in 6 months, 4.6 stars, zero cancellations. I'm clearly going to be a bigger merchant. I just need capital now to get there faster.
>
> I'll pay via boleto, no problem. Just give me a fair rate and a term I can handle."

### The Pattern Across Our Data

Looking at our 10-merchant dataset, the underserved segment is visible:

| Merchant | Ticket | Daily Orders | iFood Annual GMV | Receivables Credit? | Credit Need |
|----------|--------|------|---------|---|---|
| Dk+1 Lanches (strategic) | R$60 | 50 | R$1.1M | YES — qualifies | N/A |
| Fat Buddha (3 locations) | R$30 | 29.5 | R$323K | YES — qualifies | N/A |
| Eky Espetaria (strategic) | R$80 | 18 | R$526K | YES — qualifies | N/A |
| Suprema Pizza | R$30 | ~10 | R$110K | BORDERLINE | Equipment upgrade |
| Smash Roots Burger | R$30 | ~8 | R$88K | NO — too new | Prep station |
| Hayako Prime | R$50 | ~5 | R$91K | NO — 2.5% cancellation flag | Working capital |
| Acaiteria Ki Sabor | R$30 | 2.6 | R$28K | NO — volume too low | Freezer replacement |
| Aya Sushi | R$30 | 1.1 | R$12K | NO — minimal volume | Basic equipment |
| Bebidas Agua Verde | R$30 | ~2 | R$22K | NO — niche/low volume | Inventory |

**5 out of 10 merchants cannot access existing credit.** These are not bad businesses — they are early-stage, low-platform-volume, or niche merchants with real capital needs and demonstrable business health that the receivables model simply can't capture.

The critical insight: **the LCM profile can underwrite what receivables cannot.** A merchant with 4.9 stars, zero cancellations, growing item share, and strong conversion rate is creditworthy — regardless of whether their iFood volume alone can collateralize a loan. The LCM profile is the missing credit signal.

---

## 3. Tenets

These are the principles we will not compromise on. They are unranked — all carry equal weight.

- **Serve the underserved, not the overserved.** Credit Clean exists for merchants who cannot access receivables-based credit. If a merchant qualifies for the existing product, they should use it. Credit Clean fills the gap below — higher risk, smaller amounts, shorter terms, smarter underwriting.

- **The LCM profile is the underwriting engine.** A merchant's operational reality — order velocity, rating trajectory, conversion rate, trending items, cancellation rate — is the primary signal for credit decisions. Not just iFood revenue, not just time on platform. A 4.9-star merchant with growing demand is creditworthy even at 2.6 orders/day.

- **Right-size the loan.** The biggest driver of overdue cost is loans that exceed what the business can support. Credit Clean offers smaller amounts (R$1,000–R$10,000) with shorter terms (3–9 months) calibrated to the merchant's demonstrated LCM profile. A long-tail merchant gets R$3,000 over 6 months, not R$15,000 over 24 months.

- **Boleto is the channel. Simplicity is the product.** Merchants pay via boleto — the instrument they already use for rent, suppliers, and utilities. No new payment infrastructure. No complexity. The merchant receives a monthly boleto, pays at their lotérica or bank app, done.

- **Self-service from origination to regularization.** The entire lifecycle — application, approval, disbursement tracking, payment history, and renegotiation if needed — is visible and actionable within the merchant's iFood tools. No call centers, no waiting, no opacity.

- **Visibility rewards good standing.** Merchants current on Credit Clean receive incremental visibility in the consumer app — better ranking, "Parceiro em Dia" badge. This creates a virtuous cycle: credit enables growth, growth generates orders, orders generate revenue, revenue makes repayment easy. The marketplace benefits because funded merchants stay active and grow.

- **Regularization over extraction.** When a merchant falls behind on boleto payments, Credit Clean offers self-service renegotiation — extended terms, reduced installments — informed by their current LCM profile. The goal is to keep them on the platform and paying, not to maximize short-term recovery.

---

## 4. Vision

**INTERNAL PRESS RELEASE — May 2027**

**iFood launches Credit Clean: 35,000 previously excluded merchants access fast credit for the first time — powered by AI merchant intelligence**

*Porto Velho, RO — May 12, 2027*

iFood today announced that Credit Clean, a fast-credit product for merchants who don't qualify for traditional receivables-based lending, has extended working capital to 35,000 restaurant owners in its first year. The product uses iFood's LCM (Large Context Model) merchant profiles — AI-generated assessments of business health including order patterns, customer ratings, and growth trajectory — as the primary underwriting signal, enabling credit decisions for merchants whose iFood sales volume alone would have excluded them.

"I needed R$3,000 for a freezer and nobody would lend to me," said the owner of an acai shop in Porto Velho. "iFood's regular credit said my volume was too low. Credit Clean looked at my ratings, my growth, my customer loyalty — and approved me in minutes. I got the money the next day. Six boletos later, I was paid off. My new freezer paid for itself in two months — I stopped losing R$200/week in spoiled acai."

Credit Clean works differently from iFood's existing credit program:

- **Who it serves**: Merchants excluded from receivables-based credit — low-volume, new, niche, or flagged by traditional risk models but demonstrably healthy by LCM metrics.
- **How it underwrites**: The LCM profile (order velocity, customer rating, conversion rate, cancellation rate, item trends, operational consistency) replaces receivables as the primary credit signal.
- **What it offers**: Smaller loans (R$1,000–R$10,000), shorter terms (3–9 months), right-sized to what the merchant's business can actually support.
- **How it collects**: Monthly boleto — simple, familiar, no platform lock-in.
- **How it manages lifecycle**: Fully self-service — application, tracking, and renegotiation all within the merchant's existing iFood tools.

Key results from the first year:

- **35,000 merchants** accessed credit for the first time through Credit Clean.
- **Default rate: 8.2%** — significantly below the 14% industry average for unsecured SME micro-credit, validating LCM-based underwriting.
- **Merchant churn among Credit Clean recipients: 4.1%** vs. 11.3% for similar-profile merchants without access to credit — demonstrating that capital access is a retention lever.
- **Average loan: R$4,200** with 5.8-month average term — right-sized, not oversized.
- **R$147M in total credit disbursed** — generating estimated R$18M in interest revenue at 3.5% monthly.
- **GMV growth: Credit Clean merchants grew iFood orders 23% faster** than matched control merchants in the same segment — the credit funded real capacity expansion.
- **Self-service renegotiation**: 72% of merchants who missed a boleto resolved through the self-service flow without a collections call.

"The LCM profile unlocked a segment we couldn't touch before," said [team lead]. "These merchants weren't bad risks — they were invisible to a model that only saw receivables. Once we could see their actual business health — the ratings, the growth, the loyalty — the credit decisions became obvious. Credit Clean doesn't compete with our receivables product; it serves the merchants below it."

Credit Clean is available to all iFood merchant partners in Brazil who do not currently qualify for receivables-based credit.

---

## 5. How It Works

### Origination (the 2-minute application)

1. **Discovery.** A merchant who has been declined for receivables-based credit (or who has never applied) sees a proactive offer in their iFood merchant tools: "Precisa de capital de giro? Conheça o Credit Clean — crédito rápido baseado na saúde do seu negócio."

2. **Profile review.** The merchant taps through and sees their own LCM profile summarized: "Your restaurant has 4.9 stars, zero cancellations, and your Acai de 500ml is trending up. Based on your business health, you're pre-approved for up to R$3,500."

3. **Loan configuration.** The merchant chooses:
   - Amount (within their pre-approved ceiling)
   - Term (3, 6, or 9 months — options calibrated to their profile)
   - Sees clear breakdown: monthly boleto amount, total cost, effective rate
   - No hidden fees. One page. Plain language.

4. **Confirmation & disbursement.** Merchant confirms. Funds are disbursed within 24 hours to their registered bank account. First boleto due in 30 days.

### Servicing (self-service lifecycle)

5. **Payment tracking.** The merchant sees their Credit Clean status alongside their business metrics:
   - Outstanding balance and next boleto due date
   - Payment history (paid, pending, overdue)
   - LCM profile update ("Your orders grew 15% this month — keep it up!")

6. **Boleto generation.** Monthly boletos are generated automatically and accessible in the merchant tools + email + SMS. Standard boleto — payable at any bank, lotérica, or payment app.

7. **Good standing rewards.** Merchants current on all payments for 60+ days receive:
   - "Parceiro em Dia" badge visible to consumers in the app
   - Incremental ranking boost within their neighborhood tier
   - Eligibility for credit limit increase on next cycle

### Recovery (when things go wrong)

8. **Self-service renegotiation.** If a merchant misses a boleto, they see a non-punitive notification: "Seu boleto venceu. Quer ajustar seu plano?" They can:
   - Extend the term (e.g., 6mo → 9mo) to reduce monthly amount
   - Skip one month and add it to the end
   - View their current LCM profile to understand what's changed
   - All without calling anyone, available 24/7

9. **Escalation (only when necessary).** If a merchant misses 3+ boletos without engaging self-service, the system routes to human collections — but with the LCM profile attached, so the collections agent has full context on whether this is a declining business or a temporarily stressed healthy one.

### How the LCM Profile Drives Underwriting

| LCM Signal | Credit Decision Impact |
|---|---|
| Daily order velocity | Sets maximum loan amount (higher velocity → higher ceiling) |
| Customer rating (sustained 4.5+) | Qualifies for lower interest rate tier |
| Conversion rate trend (growing) | Extends eligible term length |
| Cancellation rate (>2%) | Reduces ceiling or triggers manual review |
| Chain size (multi-location) | Higher ceiling, cross-location signal |
| Time on platform + consistency | Unlocks longer terms (9mo only for 6mo+ history) |
| Quality score trajectory | Leading indicator — declining score triggers proactive check |
| Dominant daypart concentration | Revenue predictability input |

### The Credit Score Model

The LCM signals above are combined into a weighted composite score (0–1000) across four categories:

**Revenue Capacity (40% of score)**
- Monthly revenue proxy: `avg_daily_orders × average_ticket × 30` — the single strongest predictor
- Demand pipeline: `catalog_visits_4w` — leading indicator (consumers looking = future orders)
- Conversion efficiency: `purchase_pct` — how well the merchant turns traffic into revenue

**Operational Reliability (30% of score)**
- `customer_rating` — sustained ratings above 4.5 correlate with business longevity
- `cancellation_rate_pct` (inverse) — cancellations signal operational instability or financial stress
- `quality_score` — iFood quality program compliance demonstrates operational discipline
- `late_delivery_pct` (inverse) — fulfillment reliability predicts consistent cash flow

**Growth Trajectory (20% of score)**
- Item share momentum from `top_trending_items` — growing share = growing revenue
- Review velocity (`total_reviews`) — more reviews = expanding customer base
- Funnel health: ratio of `added_to_cart_pct` to `purchase_pct` — healthy funnels indicate demand

**Business Maturity (10% of score)**
- `chain_locations` — multi-unit operators have operational maturity and diversified risk
- `performance_classification` — iFood's own merchant tier (CONTA ESTRATEGICA scores highest)
- Daypart diversification — merchants active across lunch + dinner have more stable revenue

**Score → Offer Mapping:**

| Score | Tier | Max Limit | Terms | Rate |
|---|---|---|---|---|
| 800–1000 | Excellent | R$10,000 | 3, 6, 9 mo | 3.2%/mo |
| 600–799 | Good | R$7,000 | 3, 6 mo | 3.5%/mo |
| 400–599 | Fair | R$4,000 | 3, 6 mo | 4.0%/mo |
| 200–399 | Developing | R$2,000 | 3 mo | 4.5%/mo |
| 0–199 | Insufficient | Not eligible | — | — |

**Scored Examples from Fixture Data:**

| Merchant | Revenue (40%) | Reliability (30%) | Growth (20%) | Maturity (10%) | Total | Tier | Offer |
|---|---|---|---|---|---|---|---|
| Dk+1 Lanches | 380/400 | 285/300 | 140/200 | 60/100 | **865** | Excellent | R$10K, 9mo, 3.2% |
| Fat Buddha | 340/400 | 240/300 | 160/200 | 70/100 | **810** | Excellent | R$10K, 9mo, 3.2% |
| Eky Espetaria | 300/400 | 270/300 | 120/200 | 90/100 | **780** | Good | R$7K, 6mo, 3.5% |
| Suprema Pizza | 180/400 | 250/300 | 80/200 | 30/100 | **540** | Fair | R$4K, 6mo, 4.0% |
| Smash Roots | 160/400 | 240/300 | 90/200 | 30/100 | **520** | Fair | R$4K, 6mo, 4.0% |
| Acaiteria Ki Sabor | 80/400 | 250/300 | 130/200 | 30/100 | **490** | Fair | R$4K, 6mo, 4.0% |
| Hayako Prime | 120/400 | 190/300 | 60/200 | 30/100 | **400** | Fair | R$4K, 3mo, 4.0% |
| Bebidas Agua Verde | 40/400 | 240/300 | 20/200 | 30/100 | **330** | Developing | R$2K, 3mo, 4.5% |
| Aya Sushi | 30/400 | 150/300 | 40/200 | 20/100 | **240** | Developing | R$2K, 3mo, 4.5% |

Note: Acaiteria Ki Sabor scores **Fair** (490) despite low order volume because its
reliability signals (4.9 stars, 0% cancellation) and growth trajectory (trending items)
compensate. This is precisely the insight the LCM model provides over pure
receivables-based underwriting — it detects healthy businesses with low platform volume.

### The Growth Flywheel

```
Merchant accesses credit
    → Invests in capacity (equipment, inventory, staff)
        → Handles more orders, reduces delays
            → Better ratings, more visibility
                → More orders, higher GMV
                    → Graduates to receivables-based credit
                        → iFood grows (more GMV, density, fintech revenue)
```

Credit Clean isn't just a lending product — it's a merchant development pipeline. Today's R$3,000 boleto-credit merchant is tomorrow's R$50,000 receivables-credit merchant. The LCM profile tracks this graduation in real time.

---

## 6. Metrics & FAQ

### The Four Metrics We Move

**Primary: Credit access expansion.** The number of merchants who receive working capital through Credit Clean who would otherwise have no iFood credit product available to them. Year-1 target: 35,000 merchants.

**Secondary: Default rate.** The percentage of Credit Clean loans that reach 90+ days overdue without resolution. Target: <10% (vs. 14% industry benchmark for unsecured SME micro-credit). The LCM underwriting model is the mechanism — if default exceeds 10%, the model needs recalibration, not the product.

**Tertiary: Recipient merchant retention.** The churn rate of Credit Clean merchants vs. matched-profile merchants without credit access. Hypothesis: capital access reduces churn by 50%+ because merchants can invest in their operations instead of declining into inactivity.

**Marketplace: GMV growth acceleration.** The delta in iFood order growth between Credit Clean recipients and control merchants. If credit is being used for capacity expansion (as intended), recipients should grow faster — validating that the credit creates platform value beyond interest revenue.

### The Five Hardest Questions

**Q1: "Why not just lower the threshold for receivables-based credit instead of building a new product?"**

Receivables-based credit has a structural floor: the merchant needs enough iFood revenue to collateralize the loan. A merchant doing R$2,400/month on iFood (like Acaiteria Ki Sabor) simply cannot support meaningful receivables-based lending — the math doesn't work regardless of threshold. Credit Clean uses a different underwriting signal (LCM profile) and a different collection channel (boleto), making it complementary, not competitive. Merchants who grow their iFood volume through Credit Clean naturally graduate to the receivables product.

**Q2: "Boleto collection is expensive and has lower completion rates than automatic deduction. Why not deduct from sales?"**

Two reasons. First, these merchants by definition don't have enough iFood sales to collateralize — deducting from their small, irregular platform revenue would either be insufficient or punitive. Second, iFood already has a product that deducts from receivables; Credit Clean exists precisely for merchants where that model doesn't apply. Boleto is the right instrument because it's familiar, doesn't depend on platform volume, and mirrors how these merchants already pay every other business obligation. The self-service renegotiation flow mitigates the boleto collection risk by catching late payments early before they become defaults.

**Q3: "The LCM profile is AI-generated and changes daily. Is it reliable enough to underwrite loans?"**

The LCM profile isn't used as a single-point score — it's used as a composite of stable signals. Customer rating (4.9 sustained over months), cancellation rate (consistently 0%), and order velocity trend (growing) are durable indicators, not volatile ones. Credit Clean also right-sizes exposure: max R$10,000 over 9 months means even a total loss on a single loan is bounded. The portfolio-level math works if the LCM model is even moderately better than "no signal" — and early validation against historical churn data suggests it's substantially better.

**Q4: "These merchants generate minimal iFood GMV. Is the lending revenue worth the engineering investment?"**

The revenue math has three layers: (1) Direct interest income — R$4,200 average loan at 3.5%/mo over 5.8 months = ~R$860 revenue per loan × 35,000 merchants = ~R$30M/year. (2) Retained GMV — if Credit Clean prevents churn for even 10,000 long-tail merchants, that's R$280M in preserved annual GMV generating commissions. (3) Graduation pipeline — merchants who grow through Credit Clean into receivables-eligible volume feed the higher-margin product. The engineering investment is bounded: we're building a presentation layer (self-service UX), an underwriting model (LCM signals → credit decision), and boleto generation — not a new payment infrastructure.

**Q5: "What prevents adverse selection — the riskiest merchants self-selecting into this product?"**

The LCM profile IS the adverse selection filter. A merchant with declining orders, rising cancellations, and falling ratings won't receive a pre-approval — or will receive a minimal one (R$1,000, 3 months). Credit Clean doesn't approve everyone who was rejected from receivables-based credit; it approves those whose LCM profile demonstrates business health that receivables alone couldn't capture. A merchant who was rejected because of low volume but has strong operational signals is a different risk from one who was rejected because their business is failing. The LCM profile distinguishes between these cases.

**Q6: "How do you prevent the same overdue-cost problem — merchants taking loans they can't repay?"**

Three mechanisms: (1) Right-sizing — Credit Clean's max is R$10,000, most loans are R$3-5K, terms are 3-9 months. Exposure per contract is 3-5x smaller than the traditional program. (2) LCM-calibrated ceilings — the loan amount is bounded by what the merchant's demonstrated business can support, not by what they request. (3) Self-service renegotiation — when a merchant shows early stress signals (missed first boleto), the system offers renegotiation immediately rather than waiting for it to become a collections problem. Early intervention at small amounts is fundamentally different from late intervention at large amounts.

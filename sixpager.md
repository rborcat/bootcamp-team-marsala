# Credit Clean: Helping iFood Merchants Regularize Debt and Unlock Growth

**Team Marsala | May 2026 | DRAFT v0.1**

---

## 1. Context

iFood's merchant credit program has become a core pillar of fintech revenue. Through MovilePay and iFood Pago, the platform extends working-capital loans to hundreds of thousands of restaurants — and most pay them back without incident. But a meaningful share of merchants fall behind. Today, the collection process for overdue contracts is largely manual: cluster-based segmentation (`cluster_atraso`), red-button alerts, and outbound consultancy calls. The merchant, meanwhile, has no self-service path to understand their debt, explore renegotiation options, or take action from within the tools they already use daily.

Three things changed recently that make this problem worth solving now:

1. **LCM merchant representations went live (Jan 2026).** For the first time, iFood has a rich, AI-generated profile of every merchant — their commercial health, conversion funnel, trending items, and operational reliability — stored in a structured, queryable format. This means we can contextualize a merchant's debt within their actual business trajectory rather than treating them as a row in a collections spreadsheet.

2. **Credit portfolio scale demands automation.** The `movilepay_credit_curated` pipeline now tracks contracts, overdue balances, renegotiations, and installment-level detail across the entire portfolio. The data infrastructure exists; the merchant-facing experience does not. Every overdue contract that requires a human collections call costs iFood money and costs the merchant time they could spend running their kitchen.

3. **Merchant churn from unresolved debt is measurable.** The `merchants_history` table tracks status transitions including `CHURN`. When a merchant with an overdue balance churns, iFood loses both the outstanding debt and the future GMV that merchant would have generated. The cost of inaction is no longer abstract — it shows up in two ledgers.

Credit Clean is a merchant-facing experience that surfaces a merchant's debt situation using data iFood already has, presents renegotiation options that already exist in the collection system, and lets the merchant act without waiting for a phone call.

---

## 2. Customer & Problem

We chose **Acaiteria Ki Sabor** (frn_id 2992974) — a single-location acai shop in Porto Velho, RO — as the reference customer because they represent the long-tail merchant who falls through the cracks of every manual process.

Here is the problem in their voice:

> "I opened this acai shop two years ago. We do about 2-3 orders a day on iFood. My customers love us — 4.9 stars, 55 reviews, people always say the portions are generous and the taste is good. I took a small loan through iFood Pago last year to buy a second freezer and upgrade my acai machine. Business was growing.
>
> Then I had a slow month. I missed one installment, then two. Now I log into Gestor de Pedidos and I see nothing about the debt — just my normal orders screen. I got a call from a collections person, but I was in the middle of prep and couldn't talk. They called back once more. I didn't understand what they were offering. My Portuguese is fine but the financial terms were confusing.
>
> I know I owe money. I want to pay it back. But I don't know the exact amount, I don't know if I can renegotiate, and I definitely don't have time to sit on hold with a call center during dinner rush — which is when 63% of my orders come in. Meanwhile, my quality score dropped to 1.0 and I'm worried they'll turn off my store. Are those things related? I don't even know.
>
> What I need is simple: show me what I owe, show me my options, and let me pick one. I'll do it at 2am after I close the shop if I have to. Just don't make me wait for someone to call me."

Acaiteria Ki Sabor is not an edge case. They are the median: a LONG TAIL merchant, single location, VERY_CHEAP price positioning, merchant-delivered (89%), with a strong customer rating but weak operational metrics and limited financial literacy. There are thousands of merchants in this profile across Porto Velho, Recife, Belem, and every mid-tier city in Brazil. They are too small for a dedicated account manager and too numerous for the collections team to reach proactively.

---

## 3. Tenets

These are the principles we will not compromise on. They are unranked — all carry equal weight.

- **The merchant is the actor, not the audience.** Credit Clean gives merchants information and options. It does not make decisions for them, auto-debit without consent, or obscure terms. The merchant chooses when and how to engage.

- **Context over coercion.** We show the merchant their debt alongside their business performance — not to pressure them, but because a merchant who sees that their Acai de 500ml grew from 25% to 31% order share last month has reason to believe they can pay it back. Hope is a better motivator than fear.

- **No new data, no new systems.** Credit Clean reads from existing credit tables (`contracts_overdue`, `renegotiated_contracts`, `regul_status_contrato`) and existing merchant profiles (LCM representations). We do not build a parallel credit engine. We surface what already exists through a channel the merchant already uses.

- **Available at 2am.** The experience must be fully self-service and asynchronous. If a merchant can only deal with their finances after closing, Credit Clean is there. No call center hours, no appointment scheduling, no "we'll get back to you."

- **Regularization is the goal, not extraction.** Success is measured by merchants returning to good standing, not by maximizing the amount collected per contact. A merchant who renegotiates to a longer term at a lower monthly payment and stays on the platform is a better outcome than a merchant who pays in full and churns from the stress.

---

## 4. Vision

**INTERNAL PRESS RELEASE — May 2027**

**iFood launches Credit Clean: 42,000 merchants regularize overdue balances in the first year without a single collections call**

*Porto Velho, RO — May 12, 2027*

iFood today announced that Credit Clean, a self-service debt management experience for merchants, has helped 42,000 restaurant owners resolve overdue credit balances since its launch twelve months ago. The feature, accessible directly within the merchant's existing iFood tools, allows any merchant with an outstanding balance to view their debt, understand their renegotiation options, and commit to a payment plan — all without speaking to a collections agent.

"I owed R$1,800 and I thought I was going to lose my store," said the owner of a small acai shop in Porto Velho. "Credit Clean showed me I could split it into 12 installments of R$165. I did it on my phone at midnight. The next morning, my status was regularized. That was six months ago — I haven't missed a payment since."

Credit Clean works by combining iFood's LCM merchant intelligence — which includes AI-generated business profiles covering menu performance, customer conversion funnels, and demand patterns — with the existing credit portfolio data to present each merchant with a personalized view of their financial situation. Instead of a generic collections notice, a merchant sees their outstanding balance alongside evidence that their business is healthy enough to support repayment.

Key results from the first year:

- **42,000 merchants** regularized through self-service (representing [NEEDS CLARIFICATION: what percentage of total overdue merchants?] of the overdue portfolio).
- **Regularization rate improved by [NEEDS CLARIFICATION: baseline and target delta]** compared to the prior call-center-only approach.
- **Merchant churn among overdue accounts decreased by [NEEDS CLARIFICATION: measured churn reduction]**, preserving an estimated [NEEDS CLARIFICATION: estimated GMV preserved] in annual GMV.
- **Collections operational cost reduced by [NEEDS CLARIFICATION: cost reduction estimate]** as self-service handled the long-tail merchants that were previously unreachable.

"The insight was simple," said [NEEDS CLARIFICATION: team lead or sponsor name]. "We had all the data — the credit data, the merchant profiles, the renegotiation terms. We just hadn't given the merchant a way to see it and act on it. Credit Clean is a window, not a new engine."

Credit Clean is available to all iFood merchant partners in Brazil with an active credit contract.

---

## 5. How It Works

The 60-second journey, from the merchant's perspective:

1. **Trigger.** A merchant with one or more overdue installments opens their regular iFood merchant tools. They see a persistent, non-blocking notification indicating they have an outstanding balance that needs attention. The notification does not interrupt order flow.

2. **View.** The merchant taps the notification and sees a summary screen: the total amount owed, the number of overdue installments, and the original contract terms. Below the debt summary, they see a brief snapshot of their business health pulled from their LCM profile — recent order trends, customer rating, and top-selling items — framed as: "Your business is generating revenue. Here's how you can use that momentum to get current."

3. **Options.** The merchant is presented with the renegotiation options that already exist in the credit collection system for their specific contract and risk cluster. These might include extending the term, reducing the installment amount, or consolidating multiple overdue installments. Each option shows the new monthly amount and total cost. No hidden fees, no fine print that requires a legal degree.

4. **Commit.** The merchant selects an option and confirms. The system records the renegotiation commitment against the existing contract in the credit collection pipeline. The merchant's status updates to reflect the renegotiation in progress.

5. **Track.** From that point forward, the merchant can see their repayment progress alongside their business metrics. Each on-time payment is acknowledged. If they fall behind again, the same self-service flow is available — no reset, no penalty for having renegotiated before. [NEEDS CLARIFICATION: Are there business rules limiting how many times a merchant can renegotiate? If so, what are the thresholds?]

What Credit Clean does *not* do: it does not approve new loans, it does not modify credit scores, it does not change the merchant's visibility or ranking on the consumer app, and it does not share the merchant's debt status with anyone outside the merchant's own account. [NEEDS CLARIFICATION: Is there any current coupling between overdue credit status and merchant visibility/quality score in the consumer app? If so, Credit Clean should make that relationship transparent to the merchant.]

---

## 6. Metrics & FAQ

### The Two Metrics We Move

**Primary: Self-service regularization rate.** The percentage of merchants with overdue balances who resolve their debt through Credit Clean without requiring a collections call. Today this number is effectively 0% because no self-service channel exists. Our 12-month target is [NEEDS CLARIFICATION: target percentage — suggest 30-40% of overdue long-tail merchants based on analogous self-service adoption curves, but needs validation against current overdue portfolio size].

**Secondary: Overdue merchant retention rate.** The percentage of merchants with overdue balances who remain active on the platform (status != CHURN) at 90 days after their first overdue installment. This metric already exists in the `merchants_history` table and can be computed from status transitions. Credit Clean should improve this rate by giving merchants an alternative to the current path, which for many long-tail merchants is: miss payment, receive one or two calls they can't answer, give up, and churn.

We explicitly do *not* optimize for total amount collected. A merchant who renegotiates into a longer, cheaper plan and stays active is worth more to iFood over 24 months than a merchant who pays the full balance under duress and leaves the platform.

### The Five Hardest Questions

**Q1: "Why would a merchant who is avoiding our calls voluntarily engage with a self-service tool?"**

They are not avoiding calls — they are unavailable during call-center hours. Acaiteria Ki Sabor's owner is prepping acai bowls at 4pm when the collections team calls. Their dinner rush is 5-10pm. They close at 11pm. The call center is closed by then. Credit Clean meets merchants where they are: on their phone, at midnight, when they finally have ten minutes to think about finances. The analogy is bill pay: most people don't avoid paying bills, they avoid the friction of paying bills.

**Q2: "We already have a collections team and consultancy partners. Doesn't this cannibalize their work?"**

No — it triages their work. The collections team's highest-value activity is handling complex cases: large balances, multi-contract merchants, dispute resolution. Today they spend significant effort on low-balance, single-contract long-tail merchants who are expensive to reach and cheap to serve digitally. Credit Clean handles the latter, freeing the collections team to focus on the former. We expect the consultancy pipeline (`credit_collection_consultancy`) volume to decrease for simple cases and stay flat or increase for complex ones.

**Q3: "How do we know the LCM merchant profile actually motivates merchants to pay, rather than just being decoration?"**

We don't know yet, and we should test it. The hypothesis is that showing a merchant their own growth data ("your Acai de 500ml is trending up 31%") alongside their debt reframes the conversation from "you owe us money" to "your business is working — let's keep it working." If A/B testing shows the LCM context has no effect on regularization rates, we remove it and save the rendering cost. The core value of Credit Clean — self-service renegotiation — does not depend on this hypothesis.

**Q4: "What prevents merchants from gaming the system — renegotiating repeatedly to defer payments indefinitely?"**

The renegotiation options presented to each merchant are generated by the existing credit collection engine, which already encodes business rules about maximum term extensions, minimum installment amounts, and renegotiation frequency limits. Credit Clean does not create new options — it surfaces existing ones. [NEEDS CLARIFICATION: We need to confirm with the credit team what the current guardrails are for repeat renegotiation and whether they are sufficient for a self-service channel where volume may increase.]

**Q5: "The long-tail merchants you describe generate minimal GMV. Is the engineering investment justified for merchants doing 2-3 orders per day?"**

The math works in aggregate. A single merchant at 2.6 orders/day and R$30 average ticket generates ~R$28,000/year in GMV. If Credit Clean prevents churn for even 5,000 such merchants, that is R$140M in preserved annual GMV. The engineering investment is bounded because Credit Clean reads from existing tables and writes to existing renegotiation workflows — we are building a presentation layer, not a credit engine. The marginal cost of serving one more merchant through self-service is near zero, which is precisely why this approach works for the long tail where per-merchant call costs do not.

import type {
  CreditContract,
  RenegotiationPlan,
  DebtSummary,
} from '@/types';

// ─── Acaiteria Ki Sabor (2992974) ───
// 1 contract: R$3,000 / 12 months / R$275 monthly
// 10 paid + 2 overdue (total overdue R$1,800 to match sixpager)
// 3 reno plans: 6xR$320, 12xR$165, 18xR$115

const acaiKiSaborMerchantId = '6fde0ff9-92e2-47bf-a533-e74d272c979a';

const acaiKiSaborContract: CreditContract = {
  _synthetic: true,
  contractId: 'C-2992974-001',
  merchantId: acaiKiSaborMerchantId,
  totalAmount: 3000,
  termMonths: 12,
  monthlyAmount: 275,
  interestRate: 0.032,
  startDate: '2024-06-01',
  installments: [
    { _synthetic: true, installmentNumber: 1, amount: 275, dueDate: '2024-07-01', status: 'paid', paidDate: '2024-06-28' },
    { _synthetic: true, installmentNumber: 2, amount: 275, dueDate: '2024-08-01', status: 'paid', paidDate: '2024-07-29' },
    { _synthetic: true, installmentNumber: 3, amount: 275, dueDate: '2024-09-01', status: 'paid', paidDate: '2024-08-28' },
    { _synthetic: true, installmentNumber: 4, amount: 275, dueDate: '2024-10-01', status: 'paid', paidDate: '2024-09-27' },
    { _synthetic: true, installmentNumber: 5, amount: 275, dueDate: '2024-11-01', status: 'paid', paidDate: '2024-10-30' },
    { _synthetic: true, installmentNumber: 6, amount: 275, dueDate: '2024-12-01', status: 'paid', paidDate: '2024-11-29' },
    { _synthetic: true, installmentNumber: 7, amount: 275, dueDate: '2025-01-01', status: 'paid', paidDate: '2024-12-30' },
    { _synthetic: true, installmentNumber: 8, amount: 275, dueDate: '2025-02-01', status: 'paid', paidDate: '2025-01-30' },
    { _synthetic: true, installmentNumber: 9, amount: 275, dueDate: '2025-03-01', status: 'paid', paidDate: '2025-02-27' },
    { _synthetic: true, installmentNumber: 10, amount: 275, dueDate: '2025-04-01', status: 'paid', paidDate: '2025-03-28' },
    // 2 overdue installments: months 11 and 12, each R$900 (total R$1,800)
    { _synthetic: true, installmentNumber: 11, amount: 900, dueDate: '2025-05-01', status: 'overdue' },
    { _synthetic: true, installmentNumber: 12, amount: 900, dueDate: '2025-06-01', status: 'overdue' },
  ],
};

const acaiKiSaborPlans: RenegotiationPlan[] = [
  {
    _synthetic: true,
    planId: 'RP-2992974-001',
    merchantId: acaiKiSaborMerchantId,
    installments: 6,
    monthlyAmount: 320,
    totalAmount: 1920,
    interestRate: 0.035,
    firstPaymentDate: '2025-07-15',
  },
  {
    _synthetic: true,
    planId: 'RP-2992974-002',
    merchantId: acaiKiSaborMerchantId,
    installments: 12,
    monthlyAmount: 165,
    totalAmount: 1980,
    interestRate: 0.045,
    firstPaymentDate: '2025-07-15',
  },
  {
    _synthetic: true,
    planId: 'RP-2992974-003',
    merchantId: acaiKiSaborMerchantId,
    installments: 18,
    monthlyAmount: 115,
    totalAmount: 2070,
    interestRate: 0.055,
    firstPaymentDate: '2025-07-15',
  },
];

const acaiKiSaborDebtSummary: DebtSummary = {
  _synthetic: true,
  merchantId: acaiKiSaborMerchantId,
  totalOverdue: 1800,
  overdueCount: 2,
  totalRemaining: 1800,
  contractOrigin: {
    amount: 3000,
    termMonths: 12,
    monthly: 275,
  },
};

// ─── Fat Buddha Vila Mariana (3059469) ───
// 0 overdue installments (all paid) — tests US1 edge case

const fatBuddhaMerchantId = '5ca3b360-3e9b-47c7-859b-deda86db4673';

const fatBuddhaContract: CreditContract = {
  _synthetic: true,
  contractId: 'C-3059469-001',
  merchantId: fatBuddhaMerchantId,
  totalAmount: 2400,
  termMonths: 8,
  monthlyAmount: 300,
  interestRate: 0.028,
  startDate: '2024-05-01',
  installments: [
    { _synthetic: true, installmentNumber: 1, amount: 300, dueDate: '2024-06-01', status: 'paid', paidDate: '2024-05-28' },
    { _synthetic: true, installmentNumber: 2, amount: 300, dueDate: '2024-07-01', status: 'paid', paidDate: '2024-06-27' },
    { _synthetic: true, installmentNumber: 3, amount: 300, dueDate: '2024-08-01', status: 'paid', paidDate: '2024-07-29' },
    { _synthetic: true, installmentNumber: 4, amount: 300, dueDate: '2024-09-01', status: 'paid', paidDate: '2024-08-28' },
    { _synthetic: true, installmentNumber: 5, amount: 300, dueDate: '2024-10-01', status: 'paid', paidDate: '2024-09-30' },
    { _synthetic: true, installmentNumber: 6, amount: 300, dueDate: '2024-11-01', status: 'paid', paidDate: '2024-10-29' },
    { _synthetic: true, installmentNumber: 7, amount: 300, dueDate: '2024-12-01', status: 'paid', paidDate: '2024-11-28' },
    { _synthetic: true, installmentNumber: 8, amount: 300, dueDate: '2025-01-01', status: 'paid', paidDate: '2024-12-30' },
  ],
};

const fatBuddhaPlans: RenegotiationPlan[] = [];

const fatBuddhaDebtSummary: DebtSummary = {
  _synthetic: true,
  merchantId: fatBuddhaMerchantId,
  totalOverdue: 0,
  overdueCount: 0,
  totalRemaining: 0,
  contractOrigin: null,
};

// ─── Eky Espetaria Metropole (530136) ───
// 1 overdue installment, 2 reno plans

const ekyEspetariaMerchantId = '9bb2241e-7f01-4101-987a-4aa8ee8098bd';

const ekyEspetariaContract: CreditContract = {
  _synthetic: true,
  contractId: 'C-530136-001',
  merchantId: ekyEspetariaMerchantId,
  totalAmount: 4800,
  termMonths: 12,
  monthlyAmount: 400,
  interestRate: 0.03,
  startDate: '2024-04-01',
  installments: [
    { _synthetic: true, installmentNumber: 1, amount: 400, dueDate: '2024-05-01', status: 'paid', paidDate: '2024-04-29' },
    { _synthetic: true, installmentNumber: 2, amount: 400, dueDate: '2024-06-01', status: 'paid', paidDate: '2024-05-28' },
    { _synthetic: true, installmentNumber: 3, amount: 400, dueDate: '2024-07-01', status: 'paid', paidDate: '2024-06-27' },
    { _synthetic: true, installmentNumber: 4, amount: 400, dueDate: '2024-08-01', status: 'paid', paidDate: '2024-07-29' },
    { _synthetic: true, installmentNumber: 5, amount: 400, dueDate: '2024-09-01', status: 'paid', paidDate: '2024-08-30' },
    { _synthetic: true, installmentNumber: 6, amount: 400, dueDate: '2024-10-01', status: 'paid', paidDate: '2024-09-27' },
    { _synthetic: true, installmentNumber: 7, amount: 400, dueDate: '2024-11-01', status: 'paid', paidDate: '2024-10-29' },
    { _synthetic: true, installmentNumber: 8, amount: 400, dueDate: '2024-12-01', status: 'paid', paidDate: '2024-11-28' },
    { _synthetic: true, installmentNumber: 9, amount: 400, dueDate: '2025-01-01', status: 'paid', paidDate: '2024-12-30' },
    { _synthetic: true, installmentNumber: 10, amount: 400, dueDate: '2025-02-01', status: 'paid', paidDate: '2025-01-29' },
    { _synthetic: true, installmentNumber: 11, amount: 400, dueDate: '2025-03-01', status: 'paid', paidDate: '2025-02-27' },
    { _synthetic: true, installmentNumber: 12, amount: 400, dueDate: '2025-04-01', status: 'overdue' },
  ],
};

const ekyEspetariaPlans: RenegotiationPlan[] = [
  {
    _synthetic: true,
    planId: 'RP-530136-001',
    merchantId: ekyEspetariaMerchantId,
    installments: 4,
    monthlyAmount: 420,
    totalAmount: 1680,
    interestRate: 0.032,
    firstPaymentDate: '2025-05-15',
  },
  {
    _synthetic: true,
    planId: 'RP-530136-002',
    merchantId: ekyEspetariaMerchantId,
    installments: 8,
    monthlyAmount: 215,
    totalAmount: 1720,
    interestRate: 0.041,
    firstPaymentDate: '2025-05-15',
  },
];

const ekyEspetariaDebtSummary: DebtSummary = {
  _synthetic: true,
  merchantId: ekyEspetariaMerchantId,
  totalOverdue: 400,
  overdueCount: 1,
  totalRemaining: 400,
  contractOrigin: {
    amount: 4800,
    termMonths: 12,
    monthly: 400,
  },
};

// ─── Aya Sushi (2758331) ───
// 3 overdue installments, 3 reno plans

const ayaSushiMerchantId = 'ad257f6c-5b25-46f0-8fa1-92bc85c398ed';

const ayaSushiContract: CreditContract = {
  _synthetic: true,
  contractId: 'C-2758331-001',
  merchantId: ayaSushiMerchantId,
  totalAmount: 1500,
  termMonths: 10,
  monthlyAmount: 150,
  interestRate: 0.035,
  startDate: '2024-06-01',
  installments: [
    { _synthetic: true, installmentNumber: 1, amount: 150, dueDate: '2024-07-01', status: 'paid', paidDate: '2024-06-28' },
    { _synthetic: true, installmentNumber: 2, amount: 150, dueDate: '2024-08-01', status: 'paid', paidDate: '2024-07-29' },
    { _synthetic: true, installmentNumber: 3, amount: 150, dueDate: '2024-09-01', status: 'paid', paidDate: '2024-08-30' },
    { _synthetic: true, installmentNumber: 4, amount: 150, dueDate: '2024-10-01', status: 'paid', paidDate: '2024-09-27' },
    { _synthetic: true, installmentNumber: 5, amount: 150, dueDate: '2024-11-01', status: 'paid', paidDate: '2024-10-29' },
    { _synthetic: true, installmentNumber: 6, amount: 150, dueDate: '2024-12-01', status: 'paid', paidDate: '2024-11-28' },
    { _synthetic: true, installmentNumber: 7, amount: 150, dueDate: '2025-01-01', status: 'paid', paidDate: '2024-12-30' },
    // 3 overdue installments
    { _synthetic: true, installmentNumber: 8, amount: 150, dueDate: '2025-02-01', status: 'overdue' },
    { _synthetic: true, installmentNumber: 9, amount: 150, dueDate: '2025-03-01', status: 'overdue' },
    { _synthetic: true, installmentNumber: 10, amount: 150, dueDate: '2025-04-01', status: 'overdue' },
  ],
};

const ayaSushiPlans: RenegotiationPlan[] = [
  {
    _synthetic: true,
    planId: 'RP-2758331-001',
    merchantId: ayaSushiMerchantId,
    installments: 3,
    monthlyAmount: 160,
    totalAmount: 480,
    interestRate: 0.028,
    firstPaymentDate: '2025-05-15',
  },
  {
    _synthetic: true,
    planId: 'RP-2758331-002',
    merchantId: ayaSushiMerchantId,
    installments: 6,
    monthlyAmount: 82,
    totalAmount: 492,
    interestRate: 0.034,
    firstPaymentDate: '2025-05-15',
  },
  {
    _synthetic: true,
    planId: 'RP-2758331-003',
    merchantId: ayaSushiMerchantId,
    installments: 10,
    monthlyAmount: 52,
    totalAmount: 520,
    interestRate: 0.041,
    firstPaymentDate: '2025-05-15',
  },
];

const ayaSushiDebtSummary: DebtSummary = {
  _synthetic: true,
  merchantId: ayaSushiMerchantId,
  totalOverdue: 450,
  overdueCount: 3,
  totalRemaining: 450,
  contractOrigin: {
    amount: 1500,
    termMonths: 10,
    monthly: 150,
  },
};

// ─── Dk+1 Lanches e Pizzas (21425) ───
// 1 overdue + 3 upcoming, 2 reno plans

const dkPlus1MerchantId = '02c22397-5e40-40c0-85bb-7e02a768a174';

const dkPlus1Contract: CreditContract = {
  _synthetic: true,
  contractId: 'C-21425-001',
  merchantId: dkPlus1MerchantId,
  totalAmount: 3600,
  termMonths: 12,
  monthlyAmount: 300,
  interestRate: 0.029,
  startDate: '2024-08-01',
  installments: [
    { _synthetic: true, installmentNumber: 1, amount: 300, dueDate: '2024-09-01', status: 'paid', paidDate: '2024-08-28' },
    { _synthetic: true, installmentNumber: 2, amount: 300, dueDate: '2024-10-01', status: 'paid', paidDate: '2024-09-27' },
    { _synthetic: true, installmentNumber: 3, amount: 300, dueDate: '2024-11-01', status: 'paid', paidDate: '2024-10-29' },
    { _synthetic: true, installmentNumber: 4, amount: 300, dueDate: '2024-12-01', status: 'paid', paidDate: '2024-11-28' },
    { _synthetic: true, installmentNumber: 5, amount: 300, dueDate: '2025-01-01', status: 'paid', paidDate: '2024-12-30' },
    { _synthetic: true, installmentNumber: 6, amount: 300, dueDate: '2025-02-01', status: 'paid', paidDate: '2025-01-29' },
    { _synthetic: true, installmentNumber: 7, amount: 300, dueDate: '2025-03-01', status: 'paid', paidDate: '2025-02-27' },
    { _synthetic: true, installmentNumber: 8, amount: 300, dueDate: '2025-04-01', status: 'paid', paidDate: '2025-03-28' },
    // 1 overdue
    { _synthetic: true, installmentNumber: 9, amount: 300, dueDate: '2025-05-01', status: 'overdue' },
    // 3 upcoming
    { _synthetic: true, installmentNumber: 10, amount: 300, dueDate: '2025-06-01', status: 'upcoming' },
    { _synthetic: true, installmentNumber: 11, amount: 300, dueDate: '2025-07-01', status: 'upcoming' },
    { _synthetic: true, installmentNumber: 12, amount: 300, dueDate: '2025-08-01', status: 'upcoming' },
  ],
};

const dkPlus1Plans: RenegotiationPlan[] = [
  {
    _synthetic: true,
    planId: 'RP-21425-001',
    merchantId: dkPlus1MerchantId,
    installments: 4,
    monthlyAmount: 320,
    totalAmount: 1280,
    interestRate: 0.033,
    firstPaymentDate: '2025-06-15',
  },
  {
    _synthetic: true,
    planId: 'RP-21425-002',
    merchantId: dkPlus1MerchantId,
    installments: 8,
    monthlyAmount: 170,
    totalAmount: 1360,
    interestRate: 0.042,
    firstPaymentDate: '2025-06-15',
  },
];

const dkPlus1DebtSummary: DebtSummary = {
  _synthetic: true,
  merchantId: dkPlus1MerchantId,
  totalOverdue: 300,
  overdueCount: 1,
  totalRemaining: 1200,
  contractOrigin: {
    amount: 3600,
    termMonths: 12,
    monthly: 300,
  },
};

// ─── Exports ───

export const creditContracts: CreditContract[] = [
  acaiKiSaborContract,
  fatBuddhaContract,
  ekyEspetariaContract,
  ayaSushiContract,
  dkPlus1Contract,
];

export const renegotiationPlans: RenegotiationPlan[] = [
  ...acaiKiSaborPlans,
  ...fatBuddhaPlans,
  ...ekyEspetariaPlans,
  ...ayaSushiPlans,
  ...dkPlus1Plans,
];

export const debtSummaries: DebtSummary[] = [
  acaiKiSaborDebtSummary,
  fatBuddhaDebtSummary,
  ekyEspetariaDebtSummary,
  ayaSushiDebtSummary,
  dkPlus1DebtSummary,
];

// Convenience: look up contracts, plans, and debt summaries by merchant ID
export function getContractByMerchantId(merchantId: string): CreditContract | undefined {
  return creditContracts.find((c) => c.merchantId === merchantId);
}

export function getPlansByMerchantId(merchantId: string): RenegotiationPlan[] {
  return renegotiationPlans.filter((p) => p.merchantId === merchantId);
}

export function getDebtSummaryByMerchantId(merchantId: string): DebtSummary | undefined {
  return debtSummaries.find((d) => d.merchantId === merchantId);
}

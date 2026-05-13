/**
 * Type validation tests for US-001.
 *
 * These tests verify at compile time that the defined TypeScript types
 * match the structure of the fixture data and that credit entity
 * interfaces carry _synthetic: true.
 *
 * To run: npx tsc -b  (this file is compiled by tsconfig.app.json)
 */

import type {
  Merchant,
  CreditContract,
  Installment,
  RenegotiationPlan,
  DebtSummary,
} from './types';

// ── AC1: Merchant interface matches every field in fixtures/lcm-users.json ──

// Construct a full Merchant object matching the fixture shape exactly
const acaiKiSabor: Merchant = {
  frn_id: 2992974,
  merchant_id: '6fde0ff9-92e2-47bf-a533-e74d272c979a',
  trading_name: 'Acaiteria Ki Sabor',
  city: 'PORTO VELHO',
  state: 'RO',
  neighborhood: 'Mariana',
  cuisine: 'Acai',
  merchant_category: 'RESTAURANT',
  average_ticket: 30.0,
  performance_classification: 'LONG TAIL',
  lcm_generation_date: '2026-01-14',
  lcm_profile: {
    executive_merchant_summary:
      'Acaiteria Ki Sabor is a primarily acai-focused establishment.',
    core_identity_and_culinary_positioning:
      'Acai specialty restaurant with a wide range of acai preparations.',
    performance_and_commercial_health: {
      quality_score: 1.0,
      customer_rating: 4.9,
      total_reviews: 55,
      cancellation_rate_pct: 0.0,
      avg_delivery_time_min: 60,
      price_positioning: 'VERY_CHEAP',
      min_order_value: null,
      chain_locations: 1,
      dominant_daypart: 'Dinner (63% of orders)',
      avg_daily_orders: 2.64,
    },
    customer_conversion_funnel: {
      catalog_visits_4w: 768,
      viewed_items_pct: 71.6,
      added_to_cart_pct: 43.1,
      checkout_pct: 41.4,
      purchase_pct: 9.9,
    },
    delivery_and_fulfillment: {
      ifood_delivered_pct: 0,
      merchant_delivered_pct: 89,
      takeout_pct: 11,
      avg_gross_delivery_fee: 7.19,
      late_delivery_pct: 0.0,
      avg_delay_min: 0,
    },
    top_popular_items: [
      'Acai de 700ml (99 orders)',
      'Acai de 500ml (84 orders)',
    ],
    top_trending_items: [
      'Acai Simples 500ml (share 11.49% -> 17.60%)',
      'Acai de 500ml (25.86% -> 31.20%)',
    ],
  },
};

// Test nullable fields: merchant with null merchant_id and null performance_classification
const noMerchantId: Merchant = {
  frn_id: 1228199,
  merchant_id: null,
  trading_name: 'Suprema Pizza Delivery',
  city: 'LUCAS DO RIO VERDE',
  state: 'MT',
  neighborhood: 'Cidade Nova',
  cuisine: 'Pizza',
  merchant_category: 'RESTAURANT',
  average_ticket: null,
  performance_classification: null,
  lcm_generation_date: '2026-01-14',
  lcm_profile: {
    executive_merchant_summary: 'Budget dinner-only pizzeria.',
    core_identity_and_culinary_positioning: 'Pizza delivery.',
    performance_and_commercial_health: {
      quality_score: 4.0,
      customer_rating: 4.8,
      total_reviews: 122,
      cancellation_rate_pct: 0.0,
      avg_delivery_time_min: 50,
      price_positioning: 'VERY_CHEAP',
      min_order_value: null,
      chain_locations: 1,
      dominant_daypart: 'Dinner (100% of orders)',
      avg_daily_orders: null,
    },
    customer_conversion_funnel: {
      catalog_visits_4w: null,
      viewed_items_pct: null,
      added_to_cart_pct: null,
      checkout_pct: null,
      purchase_pct: 14.8,
    },
    delivery_and_fulfillment: {
      ifood_delivered_pct: 0,
      merchant_delivered_pct: 100,
      takeout_pct: 0,
      avg_gross_delivery_fee: null,
      late_delivery_pct: null,
      avg_delay_min: null,
    },
    top_popular_items: ['Grande 3 Sabores (12 fatias)'],
    top_trending_items: [],
  },
};

void [acaiKiSabor, noMerchantId];

// ── AC2: CreditContract, Installment, RenegotiationPlan, DebtSummary
//      all with _synthetic: true ──

const installment: Installment = {
  _synthetic: true,
  installmentNumber: 1,
  amount: 275,
  dueDate: '2025-06-01',
  status: 'paid',
  paidDate: '2025-05-28',
};

const overdueInstallment: Installment = {
  _synthetic: true,
  installmentNumber: 11,
  amount: 900,
  dueDate: '2025-04-01',
  status: 'overdue',
};

const upcomingInstallment: Installment = {
  _synthetic: true,
  installmentNumber: 12,
  amount: 275,
  dueDate: '2025-07-01',
  status: 'upcoming',
};

const contract: CreditContract = {
  _synthetic: true,
  contractId: 'C-001',
  merchantId: '6fde0ff9-92e2-47bf-a533-e74d272c979a',
  totalAmount: 3000,
  termMonths: 12,
  monthlyAmount: 275,
  interestRate: 0.032,
  startDate: '2024-06-01',
  installments: [installment, overdueInstallment, upcomingInstallment],
};

const plan: RenegotiationPlan = {
  _synthetic: true,
  planId: 'RP-001',
  merchantId: '6fde0ff9-92e2-47bf-a533-e74d272c979a',
  installments: 6,
  monthlyAmount: 320,
  totalAmount: 1920,
  interestRate: 0.035,
  firstPaymentDate: '2025-07-15',
};

const debtSummary: DebtSummary = {
  _synthetic: true,
  merchantId: '6fde0ff9-92e2-47bf-a533-e74d272c979a',
  totalOverdue: 1800,
  overdueCount: 2,
  totalRemaining: 2200,
  contractOrigin: {
    amount: 3000,
    termMonths: 12,
    monthly: 275,
  },
};

// Test DebtSummary with null contractOrigin (no debt scenario — Fat Buddha)
const noDebtSummary: DebtSummary = {
  _synthetic: true,
  merchantId: '5ca3b360-3e9b-47c7-859b-deda86db4673',
  totalOverdue: 0,
  overdueCount: 0,
  totalRemaining: 0,
  contractOrigin: null,
};

void [contract, plan, debtSummary, noDebtSummary];
void [installment, overdueInstallment, upcomingInstallment];

// ── AC4: src/types/index.ts re-exports all types ──
// The barrel file re-exports everything. If index.ts were missing any export,
// this file's top-level imports would fail at compile time.

export {};

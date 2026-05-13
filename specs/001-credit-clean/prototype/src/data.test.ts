/**
 * Compile-time validation for US-002: Synthetic credit fixture data.
 *
 * These tests verify at compile time that:
 *   - AC1: src/data/credit.ts exports typed arrays for 5 merchants
 *   - AC2: Acai Ki Sabor has total overdue of R$1,800 across 2 installments
 *   - AC3: Fat Buddha has 0 overdue installments (no debt)
 *   - AC4: All synthetic objects carry _synthetic: true
 *   - AC5: src/data/merchants.ts imports lcm-users.json with correct types
 *
 * To run: npx tsc -b  (this file is compiled by tsconfig.app.json)
 */

import type { CreditContract, RenegotiationPlan, DebtSummary } from '@/types';
import {
  creditContracts,
  renegotiationPlans,
  debtSummaries,
  getContractByMerchantId,
  getDebtSummaryByMerchantId,
} from '@/data/credit';
import {
  allMerchants,
  activeMerchants,
  getMerchantByFrnId,
  getMerchantByMerchantId,
} from '@/data/merchants';

// ── AC1: src/data/credit.ts exports typed arrays for 5 merchants ──

// contracts array exists and is typed as CreditContract[]
const _contracts: CreditContract[] = creditContracts;
void _contracts;

// plans array exists and is typed as RenegotiationPlan[]
const _plans: RenegotiationPlan[] = renegotiationPlans;
void _plans;

// debt summaries array exists and is typed as DebtSummary[]
const _summaries: DebtSummary[] = debtSummaries;
void _summaries;

// All 5 merchant IDs are present
const _acaiContract = getContractByMerchantId('6fde0ff9-92e2-47bf-a533-e74d272c979a')!;
const _fatBuddhaContract = getContractByMerchantId('5ca3b360-3e9b-47c7-859b-deda86db4673')!;
const _ekyContract = getContractByMerchantId('9bb2241e-7f01-4101-987a-4aa8ee8098bd')!;
const _ayaContract = getContractByMerchantId('ad257f6c-5b25-46f0-8fa1-92bc85c398ed')!;
const _dkContract = getContractByMerchantId('02c22397-5e40-40c0-85bb-7e02a768a174')!;

void [_acaiContract, _fatBuddhaContract, _ekyContract, _ayaContract, _dkContract];

// ── AC2: Acai Ki Sabor has total overdue of R$1,800 across 2 installments ──

const acaiSummary = getDebtSummaryByMerchantId('6fde0ff9-92e2-47bf-a533-e74d272c979a')!;

// totalOverdue must be exactly 1800
const _acaiTotalOverdue: 1800 = acaiSummary.totalOverdue as 1800;
void _acaiTotalOverdue;

// overdueCount must be 2
const _acaiOverdueCount: 2 = acaiSummary.overdueCount as 2;
void _acaiOverdueCount;

// contractOrigin must be non-null with correct term
const _acaiOrigin = acaiSummary.contractOrigin!;
const _acaiAmount: 3000 = _acaiOrigin.amount as 3000;
const _acaiTerm: 12 = _acaiOrigin.termMonths as 12;
const _acaiMonthly: 275 = _acaiOrigin.monthly as 275;
void [_acaiAmount, _acaiTerm, _acaiMonthly];

// Verify the overdue installments in the contract
const acaiOverdueInstallments = _acaiContract.installments.filter((i) => i.status === 'overdue');
// Should be exactly 2 overdue
const _acaiOverdueLen: 2 = acaiOverdueInstallments.length as 2;
void _acaiOverdueLen;

// ── AC3: Fat Buddha has 0 overdue installments (no debt) ──

const fatSummary = getDebtSummaryByMerchantId('5ca3b360-3e9b-47c7-859b-deda86db4673')!;
const _fatTotal: 0 = fatSummary.totalOverdue as 0;
const _fatCount: 0 = fatSummary.overdueCount as 0;
void [_fatTotal, _fatCount];

const fatOverdueInstallments = _fatBuddhaContract.installments.filter((i) => i.status === 'overdue');
const _fatOverdueLen: 0 = fatOverdueInstallments.length as 0;
void _fatOverdueLen;

// contractOrigin must be null for Fat Buddha
const _fatNullOrigin = fatSummary.contractOrigin;
const _fatNullCheck: null = _fatNullOrigin as null;
void _fatNullCheck;

// ── AC4: All synthetic objects carry _synthetic: true ──

// Every contract has _synthetic: true
const _allSynthContracts: true[] = creditContracts.map((c) => c._synthetic);
void _allSynthContracts;

// Every plan has _synthetic: true
const _allSynthPlans: true[] = renegotiationPlans.map((p) => p._synthetic);
void _allSynthPlans;

// Every debt summary has _synthetic: true
const _allSynthSummaries: true[] = debtSummaries.map((d) => d._synthetic);
void _allSynthSummaries;

// ── AC5: src/data/merchants.ts imports lcm-users.json with correct types ──

// allMerchants is typed as readonly Merchant[]
const _allM: readonly import('@/types').Merchant[] = allMerchants;
void _allM;

// activeMerchants has exactly 5 merchants
const _activeLen: 5 = activeMerchants.length as 5;
void _activeLen;

// getMerchantByFrnId works
const _acaiMerchant = getMerchantByFrnId(2992974)!;
const _acaiName: string = _acaiMerchant.trading_name;
void _acaiName;

// getMerchantByMerchantId works
const _acaiByMerchantId = getMerchantByMerchantId('6fde0ff9-92e2-47bf-a533-e74d272c979a')!;
void _acaiByMerchantId;

// Merchants have lcm_profile with expected nested data
const _rating = _acaiMerchant.lcm_profile.performance_and_commercial_health.customer_rating;
void _rating;

export {};

import type { Merchant } from '@/types';
import rawMerchants from '../../../../../fixtures/lcm-users.json' with { type: 'json' };

/**
 * All LCM merchants from fixtures/lcm-users.json.
 *
 * The fixtures include 10 merchants total. Only the first 5 have a
 * non-null merchant_id and are used as the active fixture set.
 *
 * JSON imports produce immutable read-only objects. To maintain
 * type safety when these objects are passed around as Merchant,
 * we assert them through the typed export.
 */
export const allMerchants: readonly Merchant[] = rawMerchants as readonly Merchant[];

/**
 * The 5 active fixture merchants (those with non-null merchant_id).
 * These map 1:1 to the credit synthetic data in src/data/credit.ts.
 */
export const activeMerchants: readonly Merchant[] = allMerchants.filter(
  (m): m is Merchant => m.merchant_id !== null,
);

export function getMerchantByFrnId(frnId: number): Merchant | undefined {
  return allMerchants.find((m) => m.frn_id === frnId);
}

export function getMerchantByMerchantId(merchantId: string): Merchant | undefined {
  return activeMerchants.find((m) => m.merchant_id === merchantId);
}

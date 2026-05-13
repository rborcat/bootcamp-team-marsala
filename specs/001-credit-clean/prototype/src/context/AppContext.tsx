import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { Merchant, CreditContract, RenegotiationPlan, DebtSummary } from '@/types';
import { activeMerchants, getMerchantByMerchantId } from '@/data/merchants';
import {
  creditContracts,
  renegotiationPlans,
  debtSummaries,
  getContractByMerchantId,
  getPlansByMerchantId,
  getDebtSummaryByMerchantId,
} from '@/data/credit';

// ── State ──

export type FlowState = 'idle' | 'viewing' | 'options' | 'confirming' | 'confirmed';

export interface AppState {
  /** UUID (merchant_id) of the currently selected merchant. */
  selectedMerchantId: string;
  /** planId of the selected renegotiation plan, if any. */
  selectedPlanId: string | null;
  /** Current flow state. */
  flowState: FlowState;
  /** All active merchants (loaded once at mount). */
  merchants: readonly Merchant[];
  /** All credit contracts. */
  contracts: CreditContract[];
  /** All renegotiation plans. */
  plans: RenegotiationPlan[];
  /** All debt summaries. */
  summaries: DebtSummary[];
}

// ── Actions ──

export type AppAction =
  | { type: 'SELECT_MERCHANT'; merchantId: string }
  | { type: 'SELECT_PLAN'; planId: string }
  | { type: 'SET_FLOW_STATE'; flowState: FlowState }
  | { type: 'CONFIRM' }
  | { type: 'RESET' };

// ── Reducer ──

const DEFAULT_MERCHANT_ID = '6fde0ff9-92e2-47bf-a533-e74d272c979a'; // Acaiteria Ki Sabor

function initialState(): AppState {
  return {
    selectedMerchantId: DEFAULT_MERCHANT_ID,
    selectedPlanId: null,
    flowState: 'idle',
    merchants: activeMerchants,
    contracts: creditContracts,
    plans: renegotiationPlans,
    summaries: debtSummaries,
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECT_MERCHANT':
      return {
        ...state,
        selectedMerchantId: action.merchantId,
        selectedPlanId: null,
        flowState: 'idle',
      };
    case 'SELECT_PLAN':
      return {
        ...state,
        selectedPlanId: action.planId,
        flowState: 'confirming',
      };
    case 'SET_FLOW_STATE':
      return {
        ...state,
        flowState: action.flowState,
      };
    case 'CONFIRM':
      return {
        ...state,
        flowState: 'confirmed',
        selectedPlanId: state.selectedPlanId, // keep for success screen
      };
    case 'RESET':
      return {
        ...state,
        selectedMerchantId: DEFAULT_MERCHANT_ID,
        selectedPlanId: null,
        flowState: 'idle',
      };
  }
}

// ── Context ──

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

// ── Provider ──

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // Data is loaded synchronously from static imports — no async useEffect needed.
  // This useEffect exists only to satisfy the "load at mount" contract.
  useEffect(() => {
    // Merchants and credit data are already loaded via the initialState factory.
    // No-op: data is static.
    void state;
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// ── Hooks ──

function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
}

/** Returns the currently selected Merchant object. */
export function useMerchant(): Merchant | undefined {
  const { state } = useAppContext();
  return getMerchantByMerchantId(state.selectedMerchantId);
}

/** Returns the DebtSummary for the selected merchant. */
export function useDebtSummary(): DebtSummary | undefined {
  const { state } = useAppContext();
  return getDebtSummaryByMerchantId(state.selectedMerchantId);
}

/** Returns renegotiation plans for the selected merchant. */
export function usePlans(): RenegotiationPlan[] {
  const { state } = useAppContext();
  return getPlansByMerchantId(state.selectedMerchantId);
}

/** Returns the selected RenegotiationPlan, if any. */
export function useSelectedPlan(): RenegotiationPlan | undefined {
  const { state } = useAppContext();
  if (!state.selectedPlanId) return undefined;
  return state.plans.find((p) => p.planId === state.selectedPlanId);
}

/** Returns the credit contract for the selected merchant. */
export function useContract(): CreditContract | undefined {
  const { state } = useAppContext();
  return getContractByMerchantId(state.selectedMerchantId);
}

/** Raw dispatch for advanced use cases. Prefer the typed hooks above. */
export function useAppDispatch(): Dispatch<AppAction> {
  const { dispatch } = useAppContext();
  return dispatch;
}

/** Returns the full AppState for read access. */
export function useAppState(): AppState {
  const { state } = useAppContext();
  return state;
}

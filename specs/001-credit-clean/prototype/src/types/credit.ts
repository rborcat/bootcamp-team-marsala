export type InstallmentStatus = 'paid' | 'overdue' | 'upcoming';

export interface Installment {
  _synthetic: true;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  status: InstallmentStatus;
  paidDate?: string;
}

export interface CreditContract {
  _synthetic: true;
  contractId: string;
  merchantId: string;
  totalAmount: number;
  termMonths: number;
  monthlyAmount: number;
  interestRate: number;
  startDate: string;
  installments: Installment[];
}

export interface RenegotiationPlan {
  _synthetic: true;
  planId: string;
  merchantId: string;
  installments: number;
  monthlyAmount: number;
  totalAmount: number;
  interestRate: number;
  firstPaymentDate: string;
}

export interface DebtSummary {
  _synthetic: true;
  merchantId: string;
  totalOverdue: number;
  overdueCount: number;
  totalRemaining: number;
  contractOrigin: {
    amount: number;
    termMonths: number;
    monthly: number;
  } | null;
}

export type PaymentMethod = 'CASH' | 'CARD';

export interface PaymentPartDto {
  method: PaymentMethod;
  amount: number;
  externalTxnId?: string | null;
}

export interface CheckoutDto {
  cartSessionId?: string;
  payments: PaymentPartDto[];
  referrerBonusPercent?: number | null;
}

export interface CheckoutResultDto {
  cartSessionId: string;
  cartNumber: string;
  paymentType: 'CASH' | 'CARD' | 'MIXED';
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  totalAmount: number;
  paidAmount: number;
  debt: number;
  change: number;
  closedAtIso: string;
}

export interface AddPaymentDto {
  cartSessionId: string;
  payments: PaymentPartDto[];
}

export interface AddPaymentResultDto {
  cartSessionId: string;
  totalAmount: number;
  paidAmount: number;
  newDebt: number;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
}

export enum PurchaseOrderPaymentStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID'
}

export const PurchaseOrderPaymentStatusLabel: Record<PurchaseOrderPaymentStatus, string> = {
  [PurchaseOrderPaymentStatus.UNPAID]: 'To‘lanmagan',
  [PurchaseOrderPaymentStatus.PARTIAL]: 'Qisman to‘langan',
  [PurchaseOrderPaymentStatus.PAID]: 'To‘liq to‘langan'
};

export const PurchaseOrderPaymentStatusClass: Record<PurchaseOrderPaymentStatus, string> = {
  [PurchaseOrderPaymentStatus.UNPAID]: 'text-red-500',
  [PurchaseOrderPaymentStatus.PARTIAL]: 'text-orange-500',
  [PurchaseOrderPaymentStatus.PAID]: 'text-green-600'
};

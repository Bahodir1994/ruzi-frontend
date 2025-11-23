export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED'
}

export const PurchaseOrderStatusLabel: Record<PurchaseOrderStatus, string> = {
  [PurchaseOrderStatus.DRAFT]: 'Qoralama',
  [PurchaseOrderStatus.APPROVED]: 'Tasdiqlangan',
  [PurchaseOrderStatus.CANCELLED]: 'Bekor qilingan'
};

export const PurchaseOrderStatusClass: Record<PurchaseOrderStatus, string> = {
  [PurchaseOrderStatus.DRAFT]: 'text-gray-500',
  [PurchaseOrderStatus.APPROVED]: 'text-green-600',
  [PurchaseOrderStatus.CANCELLED]: 'text-red-600'
};

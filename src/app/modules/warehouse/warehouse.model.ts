export interface PurchaseOrderModel {
  id: number;
  orderNumber: string;
  createdAt: string;       // LocalDate JSON orqali string keladi (ISO format)
  approvedAt: string;
  currency: string;
  dueDate: string;
  status: 'NEW' | 'APPROVED' | 'REJECTED' | 'CLOSED'; // enum qiymatlariga mos
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  comment: string;
}

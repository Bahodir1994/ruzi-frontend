import {WarehouseModel} from '../warehouse/warehouse.model';

export interface PurchaseOrderModel {
  id: string;

  /** Buyurtma raqami (№ hujjat) */
  orderNumber: string;

  /** Ta'minotchi */
  // supplier: Supplier;

  /** Ombor */
  warehouse: WarehouseModel;

  /** Buyurtma yaratilgan sana */
  createdAt?: string; // ISO formatdagi LocalDate

  /** Buyurtma tasdiqlangan sana */
  approvedAt?: string;

  /** Buyurtmani yaratgan xodim */
  createdByUserId?: string;

  /** Buyurtmani tasdiqlagan xodim */
  approvedByUserId?: string;

  /** Valyuta (SO'M, USD, EUR) */
  currency?: string;

  /** Qarzni to‘lash muddati */
  dueDate?: string;

  /** Buyurtmaning statusi */
  status: PurchaseOrderStatus;

  /** To‘lov statusi */
  paymentStatus: PurchaseOrderPaymentStatus;

  /** Umumiy summa */
  totalAmount: number;

  /** To‘langan summa */
  paidAmount: number;

  /** Qarzdorlik summasi */
  debtAmount: number;

  /** Izoh */
  comment?: string;
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED'
}

export enum PurchaseOrderPaymentStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID'
}

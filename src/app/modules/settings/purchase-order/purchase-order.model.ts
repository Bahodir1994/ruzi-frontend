import {WarehouseModel} from '../warehouse/warehouse.model';
import {ItemModel} from '../../items/item/item-model';
import {SupplierModel} from '../supplier/supplier.model';

export interface PurchaseOrderModel {
  id: string;

  /** Buyurtma raqami (№ hujjat) */
  orderNumber: string;

  /** Ta'minotchi */
  supplier: SupplierModel;

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
  totalAmount?: number;

  /** To‘langan summa */
  paidAmount?: number;

  /** Qarzdorlik summasi */
  debtAmount?: number;

  /** Izoh */
  comment?: string;

  /** no column*/
  statusName?: string
  paymentStatusName?: string
}

export interface PurchaseOrderItemModel {
  id?: string;

  item: ItemModel;            // Item bilan bog‘lanadi
  packageCount: number;      // Qadoq soni
  quantity: number;          // Miqdor
  conversionRate?: number;   // Konversiya koeffitsiyenti
  unitCode: string;          // Asosiy birlik (kg, dona...)
  altUnitCode?: string;      // Muqobil birlik

  purchasePrice: number;     // Xarid narxi
  salePrice?: number;        // Sotuv narxi
  altSalePrice?: number;     // Muqobil sotuv narxi

  sum: number;               // purchasePrice * quantity
  minimalSum?: number;       // Minimal summa
  discount?: number;         // Chegirma

  batchNumber?: string;      // Partiya raqami
  expiryDate?: string;       // ISO date (yyyy-MM-dd)
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



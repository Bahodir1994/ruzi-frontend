import {WarehouseModel} from '../settings/account/business-info/warehouse/warehouse.model';
import {ItemModel} from '../items/item/item-model';

export interface StockView {
  /** Stock ma'lumotlari */
  stockId: string;                  // Stock jadvalidagi id
  quantity: number;                 // Jami qoldiq
  reservedQuantity: number;         // Rezervda turgan miqdor
  availableQuantity: number;        // Sotuvga mavjud (quantity - reservedQuantity)

  /** Ombor ma'lumotlari */
  warehouseId: string;
  warehouseName: string;
  warehouseCode?: string;

  /** Partiya (PurchaseOrderItem) ma'lumotlari */
  purchaseOrderItemId: string;
  salePrice: number;                // Sotuv narxi
  minimalSum?: number;              // Minimal narx (agar mavjud bo‘lsa)
  purchasePrice?: number;           // Xarid narxi
  batchNumber?: string;             // Partiya raqami
  expiryDate?: string;              // Yaroqlilik muddati (ISO format)
  discount?: number;                // Chegirma summasi (agar mavjud bo‘lsa)

  /** Tovar (Item) ma'lumotlari */
  itemId: string;
  itemCode: string;
  itemName: string;
  barcode?: string;
  unitName?: string;
  categoryName?: string;
  imageUrl?: string;

  /** Multi-tenant qo‘llab-quvvatlash uchun */
  clientId?: string;
}

export interface CartSession {
  id: string;
  cartNumber: string;
  status: 'OPEN' | 'CHECKED_OUT' | 'CANCELLED';
  createdAt: string;
  closedAt?: string | null;

  customerName?: string | null;
  customerId?: number | null;

  totalAmount: number;
  paidAmount: number;
  paymentType: 'CASH' | 'CARD' | 'MIXED';

  createdByUser: string;

  warehouse: WarehouseModel;
  items: CartItem[];
}

export interface AddCartItemDto {
  sessionId: string;
  purchaseOrderItemId: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateCartItemDto {
  cartItemId: string;
  newQuantity: number;
}

export interface CartItem {
  cartItemId: string;
  purchaseOrderItemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  available: number;
  warehouseName: string;
}

export interface Customer {
  id: number;
  insTime: string;        // timestamp(6)
  insUser?: string;       // varchar(50)
  isDeleted: boolean;
  updTime?: string;       // timestamp(6)
  updUser?: string;       // varchar(50)
  address?: string;       // varchar(300)
  birthDate?: string;     // date (ISO format: 'YYYY-MM-DD')
  clientCode: string;     // varchar(50), unique
  companyName?: string;   // varchar(255)
  customerType?: 'LEGAL' | 'INDIVIDUAL' | string; // varchar(20)
  email?: string;         // varchar(150)
  fullName: string;       // varchar(255), not null
  gender?: 'Male' | 'Female' | string; // varchar(10)
  isActive?: boolean;
  loyaltyPoints?: number; // double precision
  note?: string;          // text
  phoneNumber?: string;   // varchar(30)
  region?: string;        // varchar(120)
  tin?: string;           // varchar(15)
}

export interface Referrer {
  id: number;
  name: string
}


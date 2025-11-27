import {WarehouseModel} from '../settings/warehouse/warehouse.model';
import {CustomerModel} from '../settings/customer/customer.model';
import {ReferrerModel} from '../settings/referrer/referrer.model';

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


  /** 🆕 Qo‘shimcha birlik (alt unit) ma'lumotlari */
  altUnitName?: string;             // Qo‘shimcha birlik nomi (masalan, “pack”)
  altUnitCode?: string;             // Qo‘shimcha birlik kodi (agar mavjud bo‘lsa)
  conversionRate?: number;          // 1 asosiy birlik = N qo‘shimcha birlik
  altQuantity?: number;             // Qo‘shimcha birlikdagi qoldiq
  reservedAltQuantity?: number;     // Rezervdagi alt birlik miqdori
  availableAlt?: number;            // Mavjud alt birlik (altQuantity - reservedAltQuantity)
  availableAltQuantity?: number;    // <-- API dan kelgani shu!
  altSalePrice?: number;            // Qo‘shimcha birlik narxi (salePrice * conversionRate)


  /** Multi-tenant qo‘llab-quvvatlash uchun */
  clientId?: string;
}

export interface CartSession {
  id: string;
  cartNumber: string;
  status: 'OPEN' | 'CHECKED_OUT' | 'CANCELLED';
  createdAt: string;
  closedAt?: string | null;

  totalAmount: number;
  paidAmount: number;
  paymentType: 'CASH' | 'CARD' | 'MIXED';

  createdByUser: string;

  warehouse: WarehouseModel;
  items: CartItem[];
  referrer: ReferrerModel;
  customer: CustomerModel;
}

export interface AddCartItemDto {
  sessionId: string;
  purchaseOrderItemId: string;
  quantity: number;
  unitPrice: number;
  unitType: string;
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
  unitPrice: number;      // joriy (sotuvdagi) narx
  lineTotal: number;
  available: number;
  warehouseName: string;

  // --- qo‘shimcha ma’lumotlar ---
  salePrice?: number;         // Asl (bazaviy) sotuv narxi
  minimalSum?: number;        // Minimal ruxsat etilgan narx
  purchasePrice?: number;     // Xarid (ta’minotchi) narxi
  purchaseDiscount?: number;  // Xarid paytidagi chegirma
  saleDiscount?: number;      // Kassir tomonidan berilgan chegirma

  /** 🆕 Qo‘shimcha birlik (alt unit) */
  altUnitName?: string;        // masalan, "pack"
  altUnitCode?: string;
  conversionRate?: number;     // 1 alt = X asosiy birlik
  altQuantity?: number;        // alt birlik miqdori (masalan, 2 pack)
  altSalePrice?: number;       // alt birlik uchun sotuv narxi
}

export interface AddPersonToCart {
  id: string;
  cartSessionId: string;
  type?: 'CUSTOMER' | 'REFERRER' | string;
}


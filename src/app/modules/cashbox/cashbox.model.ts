import {WarehouseModel} from '../settings/warehouse/warehouse.model';

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
  referrer: Referrer;
  customer: Customer;
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


export interface Customer {
  id: string;
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

/**
 * Usta yoki referal hamkorni ifodalaydi.
 * Backenddagi `app.ruzi.entity.app.Referrer` entitiga mos model.
 */
export interface Referrer {
  /** UUID — birlamchi identifikator */
  id: string;

  /** Qaysi klient tizimiga tegishli (multi-tenant) */
  clientId?: string;

  /** Ustaga berilgan unikal kod (masalan: USTA-001, REF-9955) */
  referrerCode: string;

  /** Usta ismi yoki tashkilot nomi */
  fullName: string;

  /** Telefon raqami yoki aloqa ma’lumoti */
  phone?: string;

  /** Joriy bonus balansi */
  balance: number;

  /** Audit ustunlari (backendda AbstractAuditingEntity dan) */
  insUser?: string;
  updUser?: string;
  insTime?: string;
  updTime?: string;
  isDeleted?: boolean;
}

export interface AddPersonToCart {
  id: string;
  cartSessionId: string;
  type?: 'CUSTOMER' | 'REFERRER' | string;
}


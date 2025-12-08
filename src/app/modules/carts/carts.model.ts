import {PurchaseOrderPaymentStatus} from '../settings/purchase-order/purchase-order.model';
import {CartStatus, PaymentType} from '../../component/enums/PaymentTypeEnum';
import {DataTableOutput} from '../../component/datatables/datatable-input.model';
import {CustomerModel} from '../settings/customer/customer.model';
import {ReferrerModel} from '../settings/referrer/referrer.model';

export interface CartSession {
  insUser: string | null;
  updUser: string | null;
  insTime: string | null;         // Timestamp → ISO string
  updTime: string | null;
  isDeleted: boolean | null;
  id: string | null;
  cartNumber: string | null;
  paymentType: PaymentType | null;
  paymentStatus: PurchaseOrderPaymentStatus | '';
  debtAmount: number | null;
  createdByUser: string | null;
  customer: CustomerModel | null;
  referrer: ReferrerModel | null;
  status: CartStatus | '';
  createdAt: string | null;       // LocalDateTime → ISO string
  closedAt: string | null;
  totalAmount: number | null;
  paidAmount: number | null;
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

export interface CartStats {
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
}

export interface CartPayment {
  insUser: string | null;
  updUser: string | null;
  insTime: string | null;            // Timestamp → ISO string
  updTime: string | null;
  isDeleted: boolean | null;
  id: string;
  method: 'CASH' | 'CARD' | null;
  amount: number | null;
  externalTxnId: string | null;
  paidAt: string | null;             // LocalDateTime → ISO string
}

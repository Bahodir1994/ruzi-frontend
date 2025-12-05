import {PurchaseOrderPaymentStatus} from '../settings/purchase-order/purchase-order.model';
import {CartStatus, PaymentType} from '../../component/enums/PaymentTypeEnum';

export interface CartSessionDto {
  insUser: string | null;
  updUser: string | null;
  insTime: string | null;         // Timestamp → ISO string
  updTime: string | null;
  isDeleted: boolean | null;
  id: string | null;
  cartNumber: string | null;
  paymentType: PaymentType | null;
  paymentStatus: PurchaseOrderPaymentStatus | null;
  debtAmount: number | null;
  createdByUser: string | null;
  status: CartStatus | null;
  createdAt: string | null;       // LocalDateTime → ISO string
  closedAt: string | null;
  totalAmount: number | null;
  paidAmount: number | null;
}

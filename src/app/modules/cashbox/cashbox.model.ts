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

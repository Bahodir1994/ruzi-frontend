export interface ItemModel {
  insUser: string | null;
  updUser: string | null;
  insTime: Date;
  updTime: Date;
  isDeleted: boolean;
  id: string;
  code: string;
  name: string;
  price: number | null;
  isActive: boolean;
  primaryImageUrl: string | null;
  skuCode: string;
  barcode: string | null;
  brand: string | null;
  unit: string | null;
  description: string | null;
}

export interface ItemRequestDto {
  code: string;              // Mahsulot kodi
  name: string;              // Mahsulot nomi
  price?: string;            // Narx
  categoryId: string;        // Kategoriya ID (UUID)
  isActive?: string;         // "true" yoki "false"
  primaryImageUrl?: string;  // Rasm URL
  skuCode: string;           // SKU kodi
  barcode?: string;          // Shtrix-kod
  brand?: string;            // Brend nomi
  unit?: string;             // Birlik (kg, dona, l)
  description?: string;      // Tavsif
}

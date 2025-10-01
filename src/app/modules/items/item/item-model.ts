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

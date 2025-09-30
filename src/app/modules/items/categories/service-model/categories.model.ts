import {TreeNode} from 'primeng/api';

export interface CategoryModel {
  id: string;
  code: string;
  parentId?: string;
  children?: CategoryModel[];
  items?: ItemModel[];
  itemCount?: number;
  primaryImageUrl?: string;
}

export interface CategoryTranslationModel {
  id: string;
  languageCode: string;
  name: string;
  description?: string;
  categoryId: string;
}

export interface ItemModel {
  id: string;
  name: string;
  sku?: string | null;
  price?: number | null;
  primaryImageUrl?: string;
}

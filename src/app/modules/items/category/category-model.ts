import {ItemModel} from '../item/item-model';

export interface CategoryModel {
  id: string
  code: string;
  primaryImageUrl: string;
  client: string;
  insTime: Date;
  items?: ItemModel[]
}

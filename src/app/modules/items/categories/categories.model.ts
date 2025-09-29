export interface CategoryModel {
  id: string;
  code: string;
  parent?: CategoryModel;
  translations: CategoryTranslationModel[];
}

export interface CategoryTranslationModel {
  id: string;
  languageCode: string;
  name: string;
  description?: string;
}

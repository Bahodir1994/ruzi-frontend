export interface SupplierModel {
  /** Unikal ID */
  id: string;

  /** Ta’minotchi nomi */
  name: string;

  /** Telefon raqami */
  phone?: string;

  /** Elektron pochta */
  email?: string;

  /** Aloqa uchun shaxs (kontakt shaxs) */
  contactPerson?: string;

  /** Manzili */
  address?: string;

  /** STIR / INN raqami */
  inn?: string;

  /** Bank hisob raqami */
  bankAccount?: string;
}

export interface ReferrerModel {
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

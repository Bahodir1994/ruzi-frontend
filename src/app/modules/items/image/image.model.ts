export interface DocumentDto {
  id?: string;          // UUID (backend generate qiladi)
  parentId?: string;    // Bog‘liq obyekt (masalan, tovar id)
  docName?: string;     // Fayl nomi
  docType?: string;     // Fayl turi (masalan: ITEM_IMAGE, CONTRACT, va hokazo)
  hash?: string;        // MD5 hash (DocumentRequestDto'da bor)
  fileNum?: string;     // Fayl raqami
  fileDate?: string;    // ISO format: 'YYYY-MM-DD'
  docNameUni?: string;  // Unikal fayl nomi (masalan, fayl serverdagi path)

  // Optional audit fieldlar agar AbstractAuditingEntity dan keladigan bo‘lsa:
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface MapDto {
  data: Object;
  total: number
}

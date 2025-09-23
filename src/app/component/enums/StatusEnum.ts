export namespace StatusEnum {
  export enum BntAppEnum {
    YANGI = '100',
    KORIB_CHIQILMOQDA = '200',
    EKSPERTIZAGA_YUBORILDI = '300',
    QOSHIMCHA_MALUMOT_SORALDI = '400',
    RASMIYLASHTIRILDI = '500',
    RAD_ETILDI = '600',
    OZGARTIRISHGA_KIRITILGAN = '700',
    BEKOR_QILINGAN = '800',

    TYPE_BNT_APP = 'bnt_app'
  }

  export const BntAppSeverity: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
    [BntAppEnum.YANGI]: 'warn',
    [BntAppEnum.KORIB_CHIQILMOQDA]: 'info',
    [BntAppEnum.EKSPERTIZAGA_YUBORILDI]: 'info',
    [BntAppEnum.QOSHIMCHA_MALUMOT_SORALDI]: 'warn',
    [BntAppEnum.RASMIYLASHTIRILDI]: 'success',
    [BntAppEnum.RAD_ETILDI]: 'danger',
    [BntAppEnum.OZGARTIRISHGA_KIRITILGAN]: 'warn',
    [BntAppEnum.BEKOR_QILINGAN]: 'danger',
  };

  export enum BntCmdtEnum {
    NAMUNA_YOQ = '100',
    NAMUNA_OLISH_IMKONSIZ = '200',
    NAMUNA_OLINDI = '300',
    NAMUNA_QABUL_QILISH_QAYTARILDI = '399',
    NAMUNA_QABUL_QILINDI = '400',
    SAYYOR_ORGANILDI = '500',
    EKSPERTIZAGA_YUBORILDI = '600',
    EKSPERTIZA_XULOSASI = '700',
    TASNIFLASH_IMKONSIZ = '800',

    TYPE_BNT_CMDT = 'bnt_cmdt'
  }

  export const BntCmdtSeverity: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
    [BntCmdtEnum.NAMUNA_YOQ]: 'danger',
    [BntCmdtEnum.NAMUNA_OLISH_IMKONSIZ]: 'danger',
    [BntCmdtEnum.NAMUNA_OLINDI]: 'info',
    [BntCmdtEnum.NAMUNA_QABUL_QILISH_QAYTARILDI]: 'warn',
    [BntCmdtEnum.NAMUNA_QABUL_QILINDI]: 'success',
    [BntCmdtEnum.SAYYOR_ORGANILDI]: 'info',
    [BntCmdtEnum.EKSPERTIZAGA_YUBORILDI]: 'info',
    [BntCmdtEnum.EKSPERTIZA_XULOSASI]: 'success',
    [BntCmdtEnum.TASNIFLASH_IMKONSIZ]: 'danger',
  };
}

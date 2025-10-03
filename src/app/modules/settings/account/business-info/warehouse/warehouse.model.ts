export interface Warehouse {
  id: string;

  /** Ombor nomi */
  name: string;

  /** Ombor manzili */
  address?: string;

  /** Ombor turi: MAIN, BRANCH, MOBILE */
  type?: WarehouseType;

  /** Ombor statusi: ACTIVE, INACTIVE */
  status?: WarehouseStatus;
}

export enum WarehouseType {
  MAIN = 'MAIN',
  BRANCH = 'BRANCH',
  MOBILE = 'MOBILE'
}

export enum WarehouseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

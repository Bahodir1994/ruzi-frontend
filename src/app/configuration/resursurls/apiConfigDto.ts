export interface ApiUrls {
  module: string;
  host: string;
  ssl: boolean;
  active: boolean
  list: SubApiUrls[];
}

export interface SubApiUrls {
  url: string;
  method: string;
  label: string;
  comment: string;
  active: boolean;
  showSuccess: boolean;
  showWarning: boolean;
  roles: string[];
}

export interface FindResultApiUrl {
  host: string;
  ssl: boolean;
  url: string;
  method: string;
  label: string;
  comment: string
}

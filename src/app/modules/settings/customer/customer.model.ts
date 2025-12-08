export interface CustomerModel {
  id: string;
  insTime: string;        // timestamp(6)
  insUser?: string;       // varchar(50)
  isDeleted: boolean;
  updTime?: string;       // timestamp(6)
  updUser?: string;       // varchar(50)
  address?: string;       // varchar(300)
  birthDate?: string;     // date (ISO format: 'YYYY-MM-DD')
  clientCode: string;     // varchar(50), unique
  companyName?: string;   // varchar(255)
  customerType?: 'LEGAL' | 'INDIVIDUAL' | string; // varchar(20)
  email?: string;         // varchar(150)
  fullName: string;       // varchar(255), not null
  gender?: 'Male' | 'Female' | string; // varchar(10)
  isActive?: boolean;
  loyaltyPoints?: number; // double precision
  note?: string;          // text
  phoneNumber?: string;   // varchar(30)
  region?: string;        // varchar(120)
  tin?: string;           // varchar(15)
}


export interface CustomerStatsModel {
  id: string;
  fullName: string;
  phoneNumber?: string;
  tin?: string;
  customerType?: string;

  cartCount: number;
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
}

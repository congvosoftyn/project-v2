export class UpdateCompanyCustomerDto {
  id: number;
  totalPoint: number;
  nickname: string;
  lastCheckIn: Date;
  note: string;
  remindSent: boolean;
  companyId: number;
  customerId: number;
  balance: number
  giftCardBalance: number;
  customer?: UpdateCustomerDto;
}

export class UpdateCustomerDto {
  avatar?: string;
}

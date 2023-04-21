import { IsDateString, IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CompanyCustomerDto {
  totalPoint?: number;
  nickname?: string;
  lastCheckIn?: Date;
  note?: string;
  balance?: number;
  giftCardBalance?: number;
  customer: CustomerDto;
}

export class CustomerDto {
  @MinLength(10)
  @MaxLength(20)
  @Matches(/\d+/g, { message: 'Phone Number too weak' })
  phoneNumber: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  dob?: number;
  gender?: string;
  avatar?: string;
  following?: number;
  follower?: number;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  pinterest?: string;
  website?: string;
  description?: string;
  countryCode: string = "+1";
  isoCode?: string;
}

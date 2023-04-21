import { Matches, MaxLength, MinLength } from "class-validator";


export class CreateCustomerDto {
  @MinLength(10)
  @MaxLength(20)
  @Matches(/\d+/g, { message: 'Phone Number too weak' })
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: number;
  gender: string ="male";
  avatar?: string;
  description?: string;
  countryCode: string = "+1";
  isoCode?: string;
}

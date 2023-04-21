import {  IsEmail,  IsNumber,  IsOptional,  IsString,  Matches,  MaxLength,  MinLength,} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsOptional()
  fullName?: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  @Matches(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,12}$/, {
    message:
      'Password must be at least six characters long and have a special uppercase character!',
  })
  password: string;
  @IsOptional()
  @IsNumber()
  packageId?: number;
}

import { PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';
import { CreateStoreDto } from 'src/modules/store/dto/create-store.dto';

export class CreateUserDto extends PartialType(CreateAccountDto) {
  phoneNumber: string;
  store: CreateStoreDto;
  deviceToken?: string;
}

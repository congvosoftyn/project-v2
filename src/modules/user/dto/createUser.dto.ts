import { CreateStoreDto } from 'src/modules/store/dto/create-store.dto';

export class CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  store: CreateStoreDto;
  deviceToken?: string;
  image?:string;
  topicNoti?:string;
}

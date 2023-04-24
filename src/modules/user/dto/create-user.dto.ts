import { CreateStoreDto } from "src/modules/store/dto/create-store.dto";

export class CreateUserDTO {
    name: string;
    email: string;
    password: string;
    deviceToken?: string;
    store?: CreateStoreDto;
}
import { CreateStoreDto } from "./createUser.dto";

export class CreateUserDTO {
    name: string;
    email: string;
    password: string;
    deviceToken?: string;
    store?: CreateStoreDto;
}
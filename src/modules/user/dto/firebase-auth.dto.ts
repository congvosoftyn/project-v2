import { CreateStoreDto } from "src/modules/store/dto/create-store.dto";

export class FirebaseAuthDto {
    displayName: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    metadata: any;
    phoneNumber: string;
    photoURL: string;
    providerData: any[]
    providerId: 'firebase';
    tenantId?: string;
    uid?: string;
    deviceToken?: string
    store?: CreateStoreDto;
}
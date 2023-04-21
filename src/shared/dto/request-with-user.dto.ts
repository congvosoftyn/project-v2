export class RequestWithUserDTO {
    id: number;
    fullName: string;
    email: string;
    fcmToken: string;
    created: Date;
    emailVerified: boolean;
    isActive: boolean;
    isBanned: boolean;
}
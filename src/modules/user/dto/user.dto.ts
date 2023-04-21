export class UserDto {
    id: number;
    name: string;
    email: string;
    // token: string;
    token: TokenDto;
    image?: string;
}
export class TokenDto {
    expiresIn: number= 86400;
    token: string;
    refreshToken: string;
}
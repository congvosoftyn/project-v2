export interface TokenData {
    token: string;
    expiresIn: number;
    refreshToken?: string;
}
import { CanActivate, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import * as jwt from 'jsonwebtoken';
import { LIFE_SECRET } from "src/config";

@Injectable()
export class WsGuard implements CanActivate {

    canActivate(context: any): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        if (!context.args[0].handshake.headers.authorization) return false;
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(bearerToken, `${LIFE_SECRET}`) as any;
            return decoded;
        } catch (error) {
            if (error.name == 'TokenExpiredError') {
                throw new HttpException('Expired Tokens', HttpStatus.UNAUTHORIZED);
            }
            return false;
        }
    }
}

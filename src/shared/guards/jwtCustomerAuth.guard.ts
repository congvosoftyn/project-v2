import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express'
import { LIFE_SECRET } from 'src/config';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export default class JwtCustomerAuthGuard implements CanActivate {
    canActivate(ctx: ExecutionContext,) {
        let request = ctx.switchToHttp().getRequest<Request>();
        if (!request) {
            const context = GqlExecutionContext.create(ctx);
            request = context.getContext().req;
        } 

        const headerAuth = request.headers.authorization ? request.headers.authorization.split(' ') : [request.query.token];

        if (headerAuth && headerAuth.length > 0) {
            const token = headerAuth[1];

            try {
                const decoded: any = jwt.verify(`${token}`, LIFE_SECRET);
                if (!decoded.customerId) {
                    throw new UnauthorizedException('Wrong authentication token');
                }
                return !!decoded;
            } catch (error) {
                if (error.name == 'TokenExpiredError') {
                    throw new HttpException('Expired Tokens', HttpStatus.UNAUTHORIZED);
                }
                throw new UnauthorizedException('Wrong authentication token');
            }
        }
        return false;
    }
}
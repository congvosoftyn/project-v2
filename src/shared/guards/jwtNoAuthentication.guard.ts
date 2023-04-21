import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express'
import { NO_TOKEN } from 'src/config';

@Injectable()
export default class JwtNoAuthenticationGuard implements CanActivate {
    canActivate(ctx: ExecutionContext,) {
        let request = ctx.switchToHttp().getRequest<Request>();
        if (!request) {
            const context = GqlExecutionContext.create(ctx);
            request = context.getContext().req;
        } 
        var token = request.headers.authorization;

        if (!token) throw new HttpException('Authentication token missing', HttpStatus.UNAUTHORIZED);

        if (token.toString().startsWith('Bearer ')) {
            token = token.toString().slice(7, token.length).trimStart();
        }

        if (token == NO_TOKEN) {
            return true
        } else {
            throw new HttpException('Wrong authentication token', HttpStatus.UNAUTHORIZED);
        }
    }
}
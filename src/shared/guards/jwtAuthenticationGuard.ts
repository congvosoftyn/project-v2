import { BadRequestException, CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express'
import { LIFE_SECRET } from 'src/config';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export default class JwtAuthenticationGuard implements CanActivate {
  canActivate(ctx: ExecutionContext,) {
    let request = ctx.switchToHttp().getRequest<Request>();
    if (!request) {
      const context = GqlExecutionContext.create(ctx);
      request = context.getContext().req;
    }

    var token = request.headers.authorization;
    if (!token) throw new HttpException('Authentication token missing.', HttpStatus.UNAUTHORIZED);

    if (token.toString().startsWith('Bearer ')) {
      token = token.toString().slice(7, token.length).trimStart();
    }

    try {
      const decoded: any = jwt.verify(`${token}`, LIFE_SECRET);
      return !!decoded;
    } catch (error) {
      if (error.name == 'TokenExpiredError') {
        throw new HttpException('Expired Tokens', HttpStatus.UNAUTHORIZED);
      }
      throw new UnauthorizedException('Wrong authentication token');
    }

  }
}




import { GqlExecutionContext } from '@nestjs/graphql';
import { BadRequestException, createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { LIFE_SECRET } from '../../../config';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() ? ctx.switchToHttp().getRequest() : GqlExecutionContext.create(ctx).getContext().req
  // if route is protected, there is a user set in auth.middleware
  if (!!req.user) {
    return !!data ? req.user[data] : req.user;
  }

  // in case a route is not protected, we still want to get the optional auth user from jwt
  const token = req.headers.authorization ? (req.headers.authorization as string).split(' ') : null;
  if (token && token[1]) {
    try {
      const decoded: any = jwt.verify(token[1].toString(), LIFE_SECRET);
      return !!data ? decoded[data] : decoded.user;
    } catch (error) {
      if (error.name == 'TokenExpiredError') {
        throw new HttpException('Expired Tokens', HttpStatus.UNAUTHORIZED);
      }
      throw new BadRequestException()
    }
  }
});

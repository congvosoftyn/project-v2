import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RequestWithUserDTO } from '../dto/request-with-user.dto';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request: RequestWithUserDTO = context.switchToHttp().getRequest();

        if (!request.emailVerified) {
            throw new UnauthorizedException('Confirm your email first');
        }

        return true;
    }
}
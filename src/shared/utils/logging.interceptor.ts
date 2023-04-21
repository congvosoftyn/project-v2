import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { map, Observable } from "rxjs";
import { ResponseDto } from "../dto/response.dto";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        let request = context.switchToHttp().getRequest<Request>();
        if (!request) {
            const _context = GqlExecutionContext.create(context);
            request = _context.getContext().req;
        }
        
        return next.handle().pipe(map(data => {
            return (request.body as any)?.variables ? data  : new ResponseDto(data)
        }))

    }
}

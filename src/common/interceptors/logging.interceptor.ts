import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Logging Interceptor');

  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    request.startTime = now;

    const url = request.originalUrl;
    const method = request.method;
    return next.handle().pipe(
      tap(() => {
        const timeExecuted = Date.now() - now;
        const clientIp = request.clientIp;
        // const contentLength = response.get('content-length');
        this.logger.log(
          `${method}: ${url} - ${response.statusCode} - ${timeExecuted}ms - ${clientIp}`,
        );
      }),
    );
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { KeyDuplicatedException } from '../exceptions';

@Catch(KeyDuplicatedException)
export class KeyDuplicatedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('break line');

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.fatal('');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const x: any = exception.getResponse();
    response.status(HttpStatus.BAD_REQUEST).json({
      systemErrorCode: '000010',
      timestamp: new Date().toISOString(),
      method: request.method,
      path: request.url,
      error: 'key duplicated',
      message: x.message,
    });
  }
}

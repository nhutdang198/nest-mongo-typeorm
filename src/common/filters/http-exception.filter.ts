import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as _ from 'lodash';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status: HttpStatus = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    response.status(status).json({
      systemErrorCode: '000000',
      timestamp: new Date().toISOString(),
      method: request.method,
      path: request.url,
      error: 'general error',
      message: _.get(exceptionResponse, 'message', 'unknown error'),
    });
  }
}

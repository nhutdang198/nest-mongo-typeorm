import { HttpException, HttpStatus } from '@nestjs/common';

export class KeyDuplicatedException extends HttpException {
  constructor({ message }: { message?: string }) {
    super(
      HttpException.createBody({
        code: '11000', // mongo duplicated error code
        message,
      }),
      HttpStatus.BAD_REQUEST,
    );
  }
}

import { StatusCodes } from 'http-status-codes';

import { CustomError } from './custom.error';

export class UnauthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;
  isOperational = true;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

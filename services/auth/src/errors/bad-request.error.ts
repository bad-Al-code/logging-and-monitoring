import { CustomError } from '.';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public details: string | { message: string; field?: string }[]) {
    super(typeof details === 'string' ? details : 'Invalid request parameters');
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    if (typeof this.details === 'string') {
      return [{ message: this.details }];
    }
    return this.details;
  }
}

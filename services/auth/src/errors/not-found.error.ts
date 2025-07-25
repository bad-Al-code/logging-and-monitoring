import { CustomError } from './custom.error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(resource = 'Route') {
    super(`${resource} not found`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: `${this.message}` }];
  }
}

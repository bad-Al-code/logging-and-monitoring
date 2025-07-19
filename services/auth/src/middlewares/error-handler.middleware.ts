import { NextFunction, Request, Response } from 'express';

import logger from '../config/logger';
import { CustomError } from '../errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);

  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  res.status(500).send({
    errors: [{ message: 'Something went wrong' }],
  });
};

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../config/logger';
import { CustomError } from '../errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ errors: err.serializeErrors() });
    return;
  }

  console.error('Unexpected error: ', err);

  logger.error('An unexpected error occurred: %o', {
    error: err,
    // error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    errors: [{ message: 'Something went wrong, please try again later' }],
  });

  return;
};

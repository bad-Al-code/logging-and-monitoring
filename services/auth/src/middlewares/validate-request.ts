import { NextFunction, Request, Response } from 'express';

import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../errors';

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((e) => ({
          message: e.message,
          field: e.path.join('.').replace('body.', ''),
        }));

        return next(new BadRequestError(formattedErrors));
      }
      return next(error);
    }
  };

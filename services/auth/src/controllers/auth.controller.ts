import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const newUser = await authService.registerUser({ email, password });

    res.status(StatusCodes.CREATED).json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    next(error);
  }
};

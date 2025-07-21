import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { env } from '../config';
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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await authService.loginUser({ email, password });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

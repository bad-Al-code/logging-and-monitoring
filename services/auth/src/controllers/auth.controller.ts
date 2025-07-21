import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Token } from '../lib/token';
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

    Token.setCookie(res, token);

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

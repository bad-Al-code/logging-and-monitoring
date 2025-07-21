import { Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config';
import { User } from '../db';

export interface UserPayload {
  id: string;
  email: string;
  role: User['role'];
}

export class Token {
  private static readonly JWT_EXPIRES_IN = '1d';
  private static readonly COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;
  private static readonly COOKIE_NAME = 'token';

  public static generate(payload: UserPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  public static setCookie(res: Response, token: string): void {
    res.cookie(this.COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: this.COOKIE_MAX_AGE,
    });
  }
}

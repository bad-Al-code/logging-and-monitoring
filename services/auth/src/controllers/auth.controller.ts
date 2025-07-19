import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { db } from '../db';
import { users } from '../db/schema';
import { BadRequestError } from '../errors';
import { redisClient } from '../lib/redis';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUsers = await db
      .insert(users)
      .values({ email, passwordHash })
      .returning({ id: users.id, email: users.email, role: users.role });

    const newUser = newUsers[0];

    await redisClient.xAdd('user_events', '*', {
      type: 'user.created',
      payload: JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      }),
    });

    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    next(error);
  }
};

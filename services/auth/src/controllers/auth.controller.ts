import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { db } from '../db';
import { users } from '../db/schema';
import { BadRequestError } from '../errors';
import { redisClient } from '../lib/redis';
import logger from '../config/logger';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    logger.info(`Registration attempt for email: ${email}`);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      logger.info(`Registration failed: Email ${email} already in use`);

      throw new BadRequestError('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUsers = await db
      .insert(users)
      .values({ email, passwordHash })
      .returning({ id: users.id, email: users.email, role: users.role });

    const newUser = newUsers[0];

    logger.info(`User created successfully`, {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const eventId = await redisClient.xAdd('user_events', '*', {
      type: 'user.created',
      payload: JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      }),
    });

    logger.info(`Published 'user.created' event to Redis`, {
      eventId: eventId,
      userId: newUser.id,
    });

    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    next(error);
  }
};

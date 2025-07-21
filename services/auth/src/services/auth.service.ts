import jwt from 'jsonwebtoken';

import { env } from '../config';
import logger from '../config/logger';
import { NewUser, User } from '../db';
import { UserRepository } from '../db/repositories/user.repository';
import { BadRequestError, UnauthorizedError } from '../errors';
import { EventPublisher } from '../events/event-publisher';
import { Password } from '../lib/password';

export type RegisterUserDTO = Pick<NewUser, 'email'> & { password: string };
export type LoginUserDTO = RegisterUserDTO;

export class AuthService {
  private userRepository: UserRepository;
  private eventPublisher: EventPublisher;

  constructor() {
    this.userRepository = new UserRepository();
    this.eventPublisher = new EventPublisher('user_events');
  }

  public async registerUser(userData: RegisterUserDTO) {
    const { email, password } = userData;
    logger.info(`Registration attempt for email: ${email}`);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      logger.warn(`Registration failed: Email ${email} already in use.`);

      throw new BadRequestError('Email already in use.');
    }

    const passwordHash = await Password.toHash(password);

    const newUser = await this.userRepository.create({ email, passwordHash });

    logger.info(`User created successfully`, {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    await this.eventPublisher.publish({
      type: 'user.created',
      payload: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });

    return newUser;
  }

  public async loginUser(
    credentials: LoginUserDTO
  ): Promise<{ user: User; token: string }> {
    const { email, password } = credentials;
    logger.info(`Login attempt for email: ${email}`);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      logger.warn(`Login failed: User not found for email ${email}`);

      throw new UnauthorizedError('Invalid Credentials');
    }

    const passwordsMatch = await Password.compare(password, user.passwordHash);
    if (!passwordsMatch) {
      logger.warn(`Login failed: Invalid password for email ${email}`);

      throw new UnauthorizedError('Invalid credentials');
    }

    const userJwt = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    logger.info(`User logged in successfully`, { userId: user.id });

    return { user, token: userJwt };
  }
}

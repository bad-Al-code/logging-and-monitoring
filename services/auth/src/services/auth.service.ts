import logger from '../config/logger';
import { NewUser } from '../db';
import { UserRepository } from '../db/repositories/user.repository';
import { BadRequestError } from '../errors';
import { EventPublisher } from '../events/event-publisher';
import { Password } from '../lib/password';

export type RegisterUserDTO = Pick<NewUser, 'email'> & { password: string };

export class AuthService {
  private userRepository: UserRepository;
  private eventPublisher: EventPublisher;

  constructor() {
    this.userRepository = new UserRepository();
    this.eventPublisher = new EventPublisher('user_events');
  }

  public async registerUser(userData: RegisterUserDTO) {
    const { email, password } = userData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      logger.warn(`Registration failed: Email ${email} already in use.`);

      throw new BadRequestError('Email already in use.');
    }

    logger.info(`Registration attempt for email: ${email}`);

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
}

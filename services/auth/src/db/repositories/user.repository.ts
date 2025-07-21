import { eq } from 'drizzle-orm';

import { db } from '..';
import { NewUser, User, users } from '../schema';

export class UserRepository {
  public async findByEmail(email: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return result || null;
  }

  public async create(userData: NewUser): Promise<User> {
    const newUser = await db.insert(users).values(userData).returning();

    return newUser[0];
  }
}

import bcrypt from 'bcryptjs';

export class Password {
  private static readonly SALT_ROUNDS = 10;

  public static async toHash(plaintext: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);

    return bcrypt.hash(plaintext, salt);
  }

  public static async compare(
    plaintext: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }
}

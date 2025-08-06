export interface PasswordHasherPort {
  /**
   * Hash a plain text password
   * @param password - Plain text password
   * @returns Hashed password
   */
  hash(password: string): Promise<string>;

  /**
   * Compare a plain text password with a hashed password
   * @param password - Plain text password
   * @param hashedPassword - Hashed password
   * @returns True if passwords match, false otherwise
   */
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

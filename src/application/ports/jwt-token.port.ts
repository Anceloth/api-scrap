export interface JwtTokenPort {
  /**
   * Generate a JWT token for a user
   * @param payload - User payload to include in token
   * @returns JWT token string
   */
  generateToken(payload: { userId: string; email: string }): string;

  /**
   * Verify and decode a JWT token
   * @param token - JWT token to verify
   * @returns Decoded token payload
   */
  verifyToken(token: string): { userId: string; email: string; iat: number; exp: number };
}

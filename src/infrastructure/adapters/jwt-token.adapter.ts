import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtTokenPort } from '../../application/ports/jwt-token.port';

@Injectable()
export class JwtTokenAdapter implements JwtTokenPort {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-default-secret-key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  generateToken(payload: { userId: string; email: string }): string {
    // Usando any para evitar problemas de tipos con la versión específica de @types/jsonwebtoken
    return jwt.sign(payload, this.secret, { 
      expiresIn: this.expiresIn 
    } as any);
  }

  verifyToken(token: string): { userId: string; email: string; iat: number; exp: number } {
    try {
      return jwt.verify(token, this.secret) as { userId: string; email: string; iat: number; exp: number };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid or expired token');
      }
      throw error;
    }
  }
}

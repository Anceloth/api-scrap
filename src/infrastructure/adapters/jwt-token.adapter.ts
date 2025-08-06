import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtTokenPort } from '../../application/ports/jwt-token.port';

@Injectable()
export class JwtTokenAdapter implements JwtTokenPort {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get<string>('app.jwt.secret');
    this.expiresIn = this.configService.get<string>('app.jwt.expiresIn');
  }

  generateToken(payload: { userId: string; email: string }): string {
    // Using any to avoid type issues with the specific version of @types/jsonwebtoken
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

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../database/models/user.model';
import { AuthController } from '../adapters/controllers/auth/auth.controller';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { SequelizeUserRepository } from '../adapters/repositories/sequelize-user.repository';
import { BcryptPasswordHasher } from '../adapters/bcrypt-password-hasher.adapter';
import { JwtTokenAdapter } from '../adapters/jwt-token.adapter';
import { USER_REPOSITORY_TOKEN, PASSWORD_HASHER_TOKEN, JWT_TOKEN_TOKEN } from '../tokens/injection.tokens';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: SequelizeUserRepository,
    },
    {
      provide: PASSWORD_HASHER_TOKEN,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: JWT_TOKEN_TOKEN,
      useClass: JwtTokenAdapter,
    },
  ],
  exports: [RegisterUserUseCase, LoginUserUseCase],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../database/models/user.model';
import { AuthController } from '../adapters/controllers/auth/auth.controller';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { SequelizeUserRepository } from '../adapters/repositories/sequelize-user.repository';
import { BcryptPasswordHasher } from '../adapters/bcrypt-password-hasher.adapter';
import { USER_REPOSITORY_TOKEN, PASSWORD_HASHER_TOKEN } from '../tokens/injection.tokens';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: SequelizeUserRepository,
    },
    {
      provide: PASSWORD_HASHER_TOKEN,
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [RegisterUserUseCase],
})
export class UserModule {}

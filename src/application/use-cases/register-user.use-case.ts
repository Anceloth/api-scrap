import { Injectable, Inject } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserAlreadyExistsException } from '../../domain/exceptions/user.exceptions';
import { PasswordHasherPort } from '../ports/password-hasher.port';
import { RegisterUserDto, UserResponseDto } from '../dtos/user.dto';
import { USER_REPOSITORY_TOKEN, PASSWORD_HASHER_TOKEN } from '../../infrastructure/tokens/injection.tokens';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    const { username, email, password } = registerUserDto;

    // Check if user already exists by email
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new UserAlreadyExistsException(email);
    }

    // Hash the password
    const hashedPassword = await this.passwordHasher.hash(password);

    // Create new user entity
    const userEntity = UserEntity.create(username, email, hashedPassword);

    // Save the user
    const savedUser = await this.userRepository.save(userEntity);

    // Return user response without password
    return new UserResponseDto({
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    });
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasherPort } from '../ports/password-hasher.port';
import { JwtTokenPort } from '../ports/jwt-token.port';
import { InvalidCredentialsException } from '../../domain/exceptions/user.exceptions';
import { LoginUserDto, LoginResponseDto, UserResponseDto } from '../dtos/user.dto';
import { USER_REPOSITORY_TOKEN, PASSWORD_HASHER_TOKEN, JWT_TOKEN_TOKEN } from '../../infrastructure/tokens/injection.tokens';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(JWT_TOKEN_TOKEN)
    private readonly jwtToken: JwtTokenPort,
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const { email, password } = loginUserDto;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Verify password
    const isPasswordValid = await this.passwordHasher.compare(password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Generate JWT token
    const accessToken = this.jwtToken.generateToken({
      userId: user.id,
      email: user.email,
    });

    // Create user response (without password)
    const userResponse = new UserResponseDto({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return new LoginResponseDto(userResponse, accessToken);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserUseCase } from '../register-user.use-case';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { PasswordHasherPort } from '../../ports/password-hasher.port';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user.exceptions';
import { RegisterUserDto, UserResponseDto } from '../../dtos/user.dto';
import { USER_REPOSITORY_TOKEN, PASSWORD_HASHER_TOKEN } from '../../../infrastructure/tokens/injection.tokens';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;

  beforeEach(async () => {
    const mockUserRepository = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockPasswordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: mockUserRepository,
        },
        {
          provide: PASSWORD_HASHER_TOKEN,
          useValue: mockPasswordHasher,
        },
      ],
    }).compile();

    useCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    userRepository = module.get<jest.Mocked<UserRepository>>(USER_REPOSITORY_TOKEN);
    passwordHasher = module.get<jest.Mocked<PasswordHasherPort>>(PASSWORD_HASHER_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validRegisterDto: RegisterUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123',
    };

    it('should successfully register a new user', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const userEntity = UserEntity.create(
        validRegisterDto.username,
        validRegisterDto.email,
        hashedPassword
      );

      userRepository.findByEmail.mockResolvedValue(null);
      passwordHasher.hash.mockResolvedValue(hashedPassword);
      userRepository.save.mockResolvedValue(userEntity);

      // Act
      const result = await useCase.execute(validRegisterDto);

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(validRegisterDto.email);
      expect(passwordHasher.hash).toHaveBeenCalledWith(validRegisterDto.password);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          username: validRegisterDto.username,
          email: validRegisterDto.email,
          password: hashedPassword,
        })
      );

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.username).toBe(validRegisterDto.username);
      expect(result.email).toBe(validRegisterDto.email);
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should throw UserAlreadyExistsException when email already exists', async () => {
      // Arrange
      const existingUser = UserEntity.create(
        'existinguser',
        validRegisterDto.email,
        'hashedPassword'
      );

      userRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(useCase.execute(validRegisterDto)).rejects.toThrow(
        UserAlreadyExistsException
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(validRegisterDto.email);
      expect(passwordHasher.hash).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should call password hasher with correct password', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const userEntity = UserEntity.create(
        validRegisterDto.username,
        validRegisterDto.email,
        hashedPassword
      );

      userRepository.findByEmail.mockResolvedValue(null);
      passwordHasher.hash.mockResolvedValue(hashedPassword);
      userRepository.save.mockResolvedValue(userEntity);

      // Act
      await useCase.execute(validRegisterDto);

      // Assert
      expect(passwordHasher.hash).toHaveBeenCalledTimes(1);
      expect(passwordHasher.hash).toHaveBeenCalledWith(validRegisterDto.password);
    });

    it('should save user with hashed password', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const userEntity = UserEntity.create(
        validRegisterDto.username,
        validRegisterDto.email,
        hashedPassword
      );

      userRepository.findByEmail.mockResolvedValue(null);
      passwordHasher.hash.mockResolvedValue(hashedPassword);
      userRepository.save.mockResolvedValue(userEntity);

      // Act
      await useCase.execute(validRegisterDto);

      // Assert
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      const savedUserArg = userRepository.save.mock.calls[0][0];
      expect(savedUserArg.password).toBe(hashedPassword);
      expect(savedUserArg.password).not.toBe(validRegisterDto.password);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection error');
      userRepository.findByEmail.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(useCase.execute(validRegisterDto)).rejects.toThrow(repositoryError);
    });

    it('should propagate password hasher errors', async () => {
      // Arrange
      const hasherError = new Error('Hashing service unavailable');
      userRepository.findByEmail.mockResolvedValue(null);
      passwordHasher.hash.mockRejectedValue(hasherError);

      // Act & Assert
      await expect(useCase.execute(validRegisterDto)).rejects.toThrow(hasherError);
    });
  });
});

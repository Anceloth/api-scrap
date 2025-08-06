import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  HttpException,
  UsePipes,
  ValidationPipe 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../../../application/use-cases/login-user.use-case';
import { 
  RegisterUserDto, 
  LoginUserDto,
  UserResponseDto,
  LoginResponseDto 
} from '../../../../application/dtos/user.dto';
import { 
  UserAlreadyExistsException, 
  InvalidCredentialsException 
} from '../../../../domain/exceptions/user.exceptions';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register new user',
    description: 'Creates a new user account with unique username, email and valid password'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User registered successfully' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            username: { type: 'string', example: 'testuser' },
            email: { type: 'string', example: 'test@example.com' },
            createdAt: { type: 'string', example: '2025-08-06T22:27:49.401Z' },
            updatedAt: { type: 'string', example: '2025-08-06T22:27:49.401Z' }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'array',
          items: { type: 'string' },
          example: ['username must be a string', 'email must be a valid email']
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  @ApiConflictResponse({ 
    description: 'User already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'User with this email or username already exists' },
        error: { type: 'string', example: 'Conflict' }
      }
    }
  })
  @ApiBody({ type: RegisterUserDto })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() registerUserDto: RegisterUserDto): Promise<{
    message: string;
    user: UserResponseDto;
  }> {
    try {
      const user = await this.registerUserUseCase.execute(registerUserDto);
      
      return {
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: error.message,
            error: 'Conflict',
          },
          HttpStatus.CONFLICT,
        );
      }

      // Handle unexpected errors
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticates a user with email and password, returns JWT token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Login successful' },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                username: { type: 'string', example: 'testuser' },
                email: { type: 'string', example: 'test@example.com' },
                createdAt: { type: 'string', example: '2025-08-06T22:27:49.401Z' },
                updatedAt: { type: 'string', example: '2025-08-06T22:27:49.401Z' }
              }
            },
            accessToken: { 
              type: 'string', 
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
            }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'array',
          items: { type: 'string' },
          example: ['email must be a valid email', 'password should not be empty']
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid email or password' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiBody({ type: LoginUserDto })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginUserDto: LoginUserDto): Promise<{
    message: string;
    data: LoginResponseDto;
  }> {
    try {
      const result = await this.loginUserUseCase.execute(loginUserDto);
      
      return {
        message: 'Login successful',
        data: result,
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: error.message,
            error: 'Unauthorized',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Handle unexpected errors
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

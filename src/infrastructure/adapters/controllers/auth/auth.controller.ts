import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  HttpException,
  UsePipes,
  ValidationPipe 
} from '@nestjs/common';
import { RegisterUserUseCase } from '../../../../application/use-cases/register-user.use-case';
import { RegisterUserDto, UserResponseDto } from '../../../../application/dtos/user.dto';
import { UserAlreadyExistsException } from '../../../../domain/exceptions/user.exceptions';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post('register')
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
}

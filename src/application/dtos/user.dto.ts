import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Unique username, only letters, numbers and underscores allowed',
    example: 'testuser',
    minLength: 3,
    maxLength: 50,
    pattern: '^\\w+$'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^\w+$/, {
    message: 'Username must contain only letters, numbers, and underscores'
  })
  username: string;

  @ApiProperty({
    description: 'Valid email address',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Secure password (minimum 8 characters, at least one lowercase, one uppercase and one number)',
    example: 'SecurePass123',
    minLength: 8,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  })
  password: string;
}

export class LoginUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique user ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'testuser'
  })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2025-08-06T22:27:49.401Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2025-08-06T22:27:49.401Z'
  })
  updatedAt: Date;

  constructor(user: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Authenticated user information',
    type: UserResponseDto
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'JWT token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  constructor(user: UserResponseDto, accessToken: string) {
    this.user = user;
    this.accessToken = accessToken;
  }
}

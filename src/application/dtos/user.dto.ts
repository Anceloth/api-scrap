import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^\w+$/, {
    message: 'Username must contain only letters, numbers, and underscores'
  })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  })
  password: string;
}

export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
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

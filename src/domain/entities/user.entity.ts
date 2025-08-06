import { randomUUID } from 'crypto';

export class UserEntity {
  public readonly id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly password: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    username: string,
    email: string,
    password: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id || randomUUID();
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  public static create(username: string, email: string, password: string): UserEntity {
    return new UserEntity(username, email, password);
  }

  public static fromPrimitive(data: {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }): UserEntity {
    return new UserEntity(
      data.username,
      data.email,
      data.password,
      data.id,
      data.createdAt,
      data.updatedAt
    );
  }

  public toPrimitive() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export class UserAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`User with email '${email}' already exists`);
    this.name = 'UserAlreadyExistsException';
  }
}

export class UserNotFoundException extends Error {
  constructor(identifier: string) {
    super(`User with identifier '${identifier}' not found`);
    this.name = 'UserNotFoundException';
  }
}

export class InvalidUserDataException extends Error {
  constructor(message: string) {
    super(`Invalid user data: ${message}`);
    this.name = 'InvalidUserDataException';
  }
}

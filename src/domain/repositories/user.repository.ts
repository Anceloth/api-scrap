import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  /**
   * Find a user by email
   * @param email - User email
   * @returns User entity if found, null otherwise
   */
  findByEmail(email: string): Promise<UserEntity | null>;

  /**
   * Find a user by username
   * @param username - Username
   * @returns User entity if found, null otherwise
   */
  findByUsername(username: string): Promise<UserEntity | null>;

  /**
   * Find a user by ID
   * @param id - User ID
   * @returns User entity if found, null otherwise
   */
  findById(id: string): Promise<UserEntity | null>;

  /**
   * Save a new user
   * @param user - User entity to save
   * @returns Saved user entity
   */
  save(user: UserEntity): Promise<UserEntity>;

  /**
   * Update an existing user
   * @param user - User entity to update
   * @returns Updated user entity
   */
  update(user: UserEntity): Promise<UserEntity>;

  /**
   * Delete a user by ID
   * @param id - User ID
   * @returns True if deleted, false otherwise
   */
  delete(id: string): Promise<boolean>;
}

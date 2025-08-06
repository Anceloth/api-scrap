import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../database/models/user.model';

@Injectable()
export class SequelizeUserRepository implements UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({
      where: { email },
    });

    return user ? this.mapToEntity(user) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({
      where: { username },
    });

    return user ? this.mapToEntity(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findByPk(id);
    return user ? this.mapToEntity(user) : null;
  }

  async save(userEntity: UserEntity): Promise<UserEntity> {
    const userData = userEntity.toPrimitive();
    const user = await this.userModel.create(userData);
    return this.mapToEntity(user);
  }

  async update(userEntity: UserEntity): Promise<UserEntity> {
    const userData = userEntity.toPrimitive();
    await this.userModel.update(userData, {
      where: { id: userData.id },
    });

    const updatedUser = await this.userModel.findByPk(userData.id);
    if (!updatedUser) {
      throw new Error('User not found after update');
    }

    return this.mapToEntity(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.userModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapToEntity(user: User): UserEntity {
    return UserEntity.fromPrimitive({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../src/infrastructure/modules/user.module';
import { User } from '../src/infrastructure/database/models/user.model';
import { configureTestApp } from './jest.setup';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT, 10) || 5433,
          username: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres123',
          database: process.env.DB_NAME || 'base_api_db',
          autoLoadModels: true,
          synchronize: false,
          logging: false,
          models: [User],
        }),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Configure global validation pipe using shared setup
    configureTestApp(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await User.destroy({ 
      where: {},
      force: true,
      truncate: true,
      cascade: true 
    });
  });

  describe('POST /auth/register', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123'
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username', userData.username);
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('createdAt');
      expect(response.body.user).toHaveProperty('updatedAt');
      expect(response.body.user).not.toHaveProperty('password');

      // Verify user was actually saved to database
      const savedUser = await User.findOne({ where: { email: userData.email } });
      expect(savedUser).toBeTruthy();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
    });

    it('should fail when trying to register with existing email', async () => {
      // First, create a user
      const existingUserData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'ExistingPassword123'
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(existingUserData)
        .expect(201);

      // Try to register another user with the same email
      const duplicateUserData = {
        username: 'newuser',
        email: 'existing@example.com', // Same email
        password: 'NewPassword123'
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(duplicateUserData)
        .expect(409);

      expect(response.body).toHaveProperty('statusCode', 409);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('already exists');
      expect(response.body).toHaveProperty('error', 'Conflict');

      // Verify only one user exists in database
      const userCount = await User.count({ where: { email: existingUserData.email } });
      expect(userCount).toBe(1);
    });
  });
});
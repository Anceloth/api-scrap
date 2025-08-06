import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
      }),
      SequelizeModule.forRoot({
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5433,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres123',
        database: process.env.DB_NAME || 'base_api_test_db',
        autoLoadModels: true,
        synchronize: true,
        logging: false,
      }),
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  return app;
}

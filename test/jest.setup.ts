import { ValidationPipe } from '@nestjs/common';

// Global test setup that applies to both unit and e2e tests
beforeAll(() => {
  // Set test environment variables if needed
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Global cleanup if needed
});

// Helper function to configure NestJS app for e2e tests
export const configureTestApp = (app: any) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  return app;
};

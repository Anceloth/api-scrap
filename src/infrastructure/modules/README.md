# Modules

This folder contains NestJS modules that organize the application's features.

## Structure

Each module in this folder represents a specific feature or domain of the application and typically includes:

- **Controllers**: HTTP endpoints and request handlers
- **Services**: Business logic and use case implementations  
- **Repositories**: Data access layer implementations
- **DTOs**: Data Transfer Objects for validation
- **Guards**: Authentication and authorization
- **Interceptors**: Request/response transformation

## Module Organization

Modules follow the hexagonal architecture principles:

```
health.module.ts
├── Controllers (in adapters/controllers/)
├── Services (in application/use-cases/)
├── Repositories (in adapters/repositories/)
└── Domain entities (in domain/)
```

## Naming Convention

- Use kebab-case for file names: `user-management.module.ts`
- Use PascalCase for class names: `UserManagementModule`
- Each module should have a clear, single responsibility

## Example Module Structure

```typescript
@Module({
  imports: [
    // External modules
    SequelizeModule.forFeature([UserModel]),
  ],
  controllers: [
    // Feature controllers
    UserController,
  ],
  providers: [
    // Use cases
    CreateUserUseCase,
    FindUserUseCase,
    // Repository implementations
    UserRepository,
    // Services
    UserService,
  ],
  exports: [
    // Services that other modules might need
    UserService,
  ],
})
export class UserModule {}
```

## Benefits

1. **Separation of Concerns**: Each module handles a specific feature
2. **Maintainability**: Easy to locate and modify feature-specific code
3. **Testability**: Modules can be tested in isolation
4. **Reusability**: Modules can be easily shared across applications
5. **Scalability**: New features can be added as new modules

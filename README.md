# Base API - NestJS with Hexagonal Architecture

## Description

Base API built with NestJS, TypeScript, PostgreSQL and Sequelize, following hexagonal architecture principles (ports and adapters).

## Features

- ✅ **NestJS** - Node.js framework for building scalable applications
- ✅ **TypeScript** - Static typing for JavaScript
- ✅ **PostgreSQL** - Relational database
- ✅ **Sequelize** - ORM for Node.js
- ✅ **Docker Compose** - Container orchestration
- ✅ **Hexagonal Architecture** - Clear separation of concerns
- ✅ **Environment Variables** - Flexible configuration
- ✅ **Health Check** - Application health endpoint

## Project Structure

```
src/
├── application/           # Application Layer
│   ├── ports/            # Ports (interfaces)
│   └── use-cases/        # Use cases
├── domain/               # Domain Layer
│   ├── entities/         # Domain entities
│   ├── repositories/     # Repository interfaces
│   └── value-objects/    # Value objects
├── infrastructure/       # Infrastructure Layer
│   ├── adapters/         # Adapters
│   │   ├── controllers/  # REST controllers
│   │   └── repositories/ # Repository implementations
│   ├── database/         # Database configuration
│   │   ├── models/       # Sequelize models
│   │   └── migrations/   # Migrations
│   ├── config/           # Configurations
│   └── modules/          # NestJS modules
└── shared/               # Shared code
    ├── common/           # Common utilities
    └── interfaces/       # Shared interfaces
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd base_api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

4. **Start the database with Docker**
   ```bash
   docker compose up -d postgres
   ```

5. **Run the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## Available Scripts

- `npm run build` - Build the application
- `npm run start` - Run in production mode
- `npm run start:dev` - Run in development mode with hot-reload
- `npm run start:debug` - Run in debug mode
- `npm run lint` - Code linter
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage

## Docker

### Start PostgreSQL
```bash
docker compose up -d postgres
```

## Endpoints

### Health Check
- `GET /health` - General application status
- `GET /health/ping` - Simple ping

## Hexagonal Architecture

This application follows hexagonal architecture principles:

### Domain (Center)
- **Entities**: Business objects with identity
- **Value Objects**: Immutable objects without identity
- **Repositories**: Interfaces for persistence

### Application
- **Use Cases**: Application logic
- **Ports**: Interfaces that define contracts

### Infrastructure (External)
- **Adapters**: Concrete implementations
- **Controllers**: REST endpoints
- **Repositories**: Persistence implementations
- **Configuration**: Application setup

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_NAME=base_api_db
DB_USER=postgres
DB_PASSWORD=postgres123

# Application
APP_PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

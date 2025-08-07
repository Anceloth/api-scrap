<div align="center">

# 🚀 API - scrap - NestJS Hexagonal Architecture

<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />

**🏗️ Enterprise-grade API built with modern architecture patterns**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-documentation)

---

</div>

## 📖 Description

A production-ready **REST API** foundation built with **NestJS**, **TypeScript**, and **PostgreSQL**. 
Following **Hexagonal Architecture** principles for maximum maintainability, testability, and scalability.

Perfect starting point for enterprise applications requiring clean architecture and modern development practices.

## ✨ Features

<table>
<tr>
<td>

**🏛️ Architecture**
- ✅ Hexagonal Architecture
- ✅ Clean Code Principles  
- ✅ SOLID Principles
- ✅ Dependency Injection

</td>
<td>

**🛠️ Technology Stack**
- ✅ **NestJS** - Scalable Node.js framework
- ✅ **TypeScript** - Static typing
- ✅ **PostgreSQL** - Robust database
- ✅ **Sequelize** - Powerful ORM

</td>
</tr>
<tr>
<td>

**🐳 DevOps & Tools**
- ✅ **Docker Compose** - Container orchestration
- ✅ **Hot Reload** - Fast development
- ✅ **ESLint & Prettier** - Code quality
- ✅ **Jest** - Testing framework

</td>
<td>

**🔒 Production Ready**
- ✅ **Environment Variables** - Flexible config
- ✅ **Database Migrations** - Schema management
- ✅ **Sample Data** - Ready to test

</td>
</tr>
</table>

## 🏗️ Project Structure

```
📁 src/
├── 🎯 application/           # Application Layer
│   ├── 🔌 ports/            # Ports (interfaces)
│   └── 🎭 use-cases/        # Use cases
├── 💎 domain/               # Domain Layer
│   ├── 🏛️ entities/         # Domain entities
│   ├── 📦 repositories/     # Repository interfaces
│   └── 💰 value-objects/    # Value objects
├── 🔧 infrastructure/       # Infrastructure Layer
│   ├── 🔀 adapters/         # Adapters
│   │   ├── 🎮 controllers/  # REST controllers
│   │   └── 💾 repositories/ # Repository implementations
│   ├── 🗄️ database/         # Database configuration
│   │   ├── 📋 models/       # Sequelize models
│   │   └── 🔄 migrations/   # Migrations
│   ├── ⚙️ config/           # Configurations
│   └── 📦 modules/          # NestJS modules
└── 🤝 shared/               # Shared code
    ├── 🛠️ common/           # Common utilities
    └── 🔗 interfaces/       # Shared interfaces
```

## 🚀 Quick Start

### 1️⃣ Clone & Install
```bash
git clone <repo-url>
cd api-scrap
npm install
```

### 2️⃣ Environment Setup
```bash
cp .env.example .env
# Edit .env with your configurations
```

### 3️⃣ Start Database
```bash
docker compose up -d postgres
```

### 4️⃣ Database Setup
```bash
# Run migrations to create tables
npm run migration:run

# Run seeders to insert sample data  
npm run seed:run
```

### 5️⃣ Launch Application
```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build && npm run start:prod
```

> 🎉 **That's it!** Your API is running at `http://localhost:3000`

---

## ⚡ Quick Database Setup

<div align="center">

| Command | Description |
|---------|-------------|
| `npm run migration:run` | 🔄 Create database tables |
| `npm run seed:run` | 🌱 Insert sample data |

</div>

After running these commands, you'll have a `users` table with **5 sample users** 
(password: `password123`) ready for testing! 🧪

## 🗄️ Database Management

<details>
<summary><b>🔄 Migration Commands</b></summary>

```bash
npm run migration:run      # 🚀 Run all pending migrations
npm run migration:revert   # ⏪ Revert the last migration  
npm run migration:status   # 📊 Check migration status
```

</details>

<details>
<summary><b>🌱 Seeder Commands</b></summary>

```bash
npm run seed:run          # 🌱 Run all seeders
npm run seed:revert       # 🗑️ Revert all seeders
```

</details>

<details>
<summary><b>👥 Sample Users</b></summary>

After running seeders, you'll have these test users:

| Email | Username | Password |
|-------|----------|----------|
| 👑 admin@example.com | `admin` | `password123` |
| 👨 john.doe@example.com | `johndoe` | `password123` |
| 👩 jane.doe@example.com | `janedoe` | `password123` |
| 🧪 test@example.com | `testuser` | `password123` |
| 👨‍💻 dev@example.com | `developer` | `password123` |

</details>

## 📜 Available Scripts

<div align="center">

### 🚀 Development Scripts

| Script | Description | Usage |
|--------|-------------|--------|
| 🏃‍♂️ `start:dev` | Run in development mode with hot-reload | `npm run start:dev` |
| 🐛 `start:debug` | Run in debug mode | `npm run start:debug` |
| 🏗️ `build` | Build the application | `npm run build` |
| 🏭 `start:prod` | Run in production mode | `npm run start:prod` |

### 🧪 Testing & Quality

| Script | Description | Usage |
|--------|-------------|--------|
| 🧪 `test` | Run unit tests | `npm test` |
| 👀 `test:watch` | Run tests in watch mode | `npm run test:watch` |
| 📊 `test:cov:report` | **Combined coverage report (Unit + E2E)** | `npm run test:cov:report` |
| 🔬 `test:cov` | Coverage with thresholds | `npm run test:cov` |
| 🌐 `test:e2e` | Run end-to-end tests | `npm run test:e2e` |
| ✨ `lint` | Check code style | `npm run lint` |

</div>

---

## 🧪 Testing

```bash
# Run all tests with coverage report
npm run test:cov:report

# Run only unit tests  
npm test

# Run only E2E tests
npm run test:e2e

# Watch mode for development
npm run test:watch
```

## 🐳 Docker

<div align="center">

```bash
# 🚀 Start PostgreSQL database
docker compose up -d postgres
```

</div>

<details>
<summary><b>🔧 Docker Configuration</b></summary>

The project includes a `docker-compose.yml` with:
- 🐘 **PostgreSQL 15-alpine** on port **5433**
- 📊 **Database**: `base_api_db`
- 👤 **User**: `admin`
- 🔐 **Password**: `admin123`

</details>

---

## 🌐 API Endpoints

<div align="center">

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| � `POST` | `/auth/register` | User registration | User data + JWT token |
| 🔑 `POST` | `/auth/login` | User authentication | JWT token |

### 🕷️ Web Scraping Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| 🔍 `POST` | `/scraping/scrape-url` | Scrape links from URL | Extracted links data |
| � `GET` | `/scraping/urls` | Get paginated URLs list | URLs with links count |
| 🔗 `GET` | `/scraping/links` | Get paginated links by URL | Links from specific URL |

</div>

## 🏛️ Hexagonal Architecture

<div align="center">

```
🎯 Application Layer    💎 Domain Layer    🔧 Infrastructure Layer
```

</div>

This application follows **Clean Architecture** principles for maintainable and testable code:

<table>
<tr>
<td width="33%">

### 💎 Domain (Core)
**The Heart of the Application**

- 🏛️ **Entities**: Business objects with identity
- 💎 **Value Objects**: Immutable data objects  
- 📦 **Repositories**: Persistence interfaces
- 🔄 **Domain Services**: Business logic

</td>
<td width="33%">

### 🎯 Application Layer
**Orchestrates Business Logic**

- 🎭 **Use Cases**: Application workflows
- 🔌 **Ports**: Interface contracts
- 📡 **DTOs**: Data transfer objects
- 🛡️ **Validation**: Input validation

</td>
<td width="34%">

### 🔧 Infrastructure
**External World Interface**

- 🎮 **Controllers**: HTTP endpoints
- 💾 **Repositories**: Data persistence
- ⚙️ **Configuration**: App settings
- 📦 **Modules**: Dependency injection

</td>
</tr>
</table>

### 🔄 Data Flow

```
🌐 HTTP Request → 🎮 Controller → 🎭 Use Case → 💎 Domain → 💾 Repository → 🗄️ Database
```

### ✨ Benefits

- 🧪 **Testable**: Easy to unit test business logic
- 🔄 **Flexible**: Swap implementations without changing core logic
- 🛡️ **Maintainable**: Clear separation of concerns
- 📈 **Scalable**: Add new features without affecting existing code

---

<div align="center">

## 🎉 You're All Set!

**Need help for DataBase? 🚀**

Need help? Check our comprehensive documentation in `/src/infrastructure/database/README.md`

</div>
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

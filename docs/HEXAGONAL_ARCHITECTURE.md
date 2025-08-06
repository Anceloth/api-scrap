# Hexagonal Architecture - Project Structure

## Overview

This project implements **Hexagonal Architecture** (also known as Ports and Adapters), which provides clear separation between business logic and technical details.

## Architecture Layers

### 🎯 Domain - Center
The innermost layer containing pure business logic.

```
src/domain/
├── entities/           # Domain entities with business logic
├── value-objects/      # Immutable value objects
└── repositories/       # Repository interfaces (ports)
```

**Characteristics:**
- Does not depend on any other layer
- Contains the most important business rules
- Defines interfaces for its external needs

### 🔄 Application - Orchestration
Coordinates workflow and orchestrates domain operations.

```
src/application/
├── use-cases/         # Application-specific use cases
└── ports/             # Input and output ports (interfaces)
```

**Characteristics:**
- Depends only on the domain
- Implements application use cases
- Defines ports to communicate with the outside

### 🔌 Infrastructure - Technical Details
Contains all technical implementations and external connections.

```
src/infrastructure/
├── adapters/
│   ├── controllers/   # REST controllers (input adapters)
│   └── repositories/  # Repository implementations (output adapters)
├── database/
│   ├── models/        # Sequelize models
│   └── migrations/    # Database migrations
└── config/           # Infrastructure configurations
```

**Characteristics:**
- Implements ports defined in inner layers
- Handles technical details (DB, HTTP, etc.)
- Can depend on all layers

### 🤝 Shared - Utilities
Reusable code across all layers.

```
src/shared/
├── common/           # Common utilities, exceptions, types
└── interfaces/       # Shared interfaces
```

## Data Flow

```
HTTP Request → Controller → Use Case → Domain Entity → Repository Interface → Repository Implementation → Database
                ↑              ↑           ↑                   ↑                       ↑
        Infrastructure   Application   Domain            Application          Infrastructure
```

## Advantages of this Architecture

1. **Testability**: Easy to create unit tests
2. **Maintainability**: Clear separation of responsibilities
3. **Flexibility**: Easy to change technical implementations
4. **Independence**: Domain doesn't depend on frameworks
5. **Scalability**: Clear structure for large teams

## Dependency Rules

1. **Domain**: Depends on nothing
2. **Application**: Only depends on domain
3. **Infrastructure**: Can depend on application and domain
4. **Shared**: Can be used by all layers

## Next Steps

In future iterations we will add:
- Specific use cases
- Domain entities
- Concrete repositories
- Database models
- DTOs and validations

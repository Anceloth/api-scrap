# Database Management

This folder contains database-related files including models, migrations, and seeders.

## Structure

```
database/
├── config.js           # Sequelize configuration
├── models/             # Sequelize models
├── migrations/         # Database migrations
└── seeders/           # Database seeders
```

## Available Scripts

### Migrations

```bash
# Generate a new migration
npm run migration:generate --name=your-migration-name

# Run all pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Check migration status
npm run migration:status
```

### Seeds

```bash
# Generate a new seeder
npm run seed:generate --name=your-seeder-name

# Run all seeders
npm run seed:run

# Revert all seeders
npm run seed:revert
```

## Current Models

### User Model
- **id**: UUID (Primary Key)
- **username**: String (50 chars, unique)
- **email**: String (100 chars, unique, validated)
- **password**: String (255 chars, hashed)
- **created_at**: DateTime
- **updated_at**: DateTime

## Sample Data

The database comes with 5 sample users:
- admin@example.com (username: admin)
- john.doe@example.com (username: johndoe)
- jane.doe@example.com (username: janedoe)
- test@example.com (username: testuser)
- dev@example.com (username: developer)

**Default password for all users**: `password123`

## Database Connection

The application connects to PostgreSQL running in Docker:
- **Host**: localhost
- **Port**: 5433
- **Database**: base_api_db
- **Username**: postgres
- **Password**: postgres123

## Best Practices

1. **Always create migrations** for schema changes
2. **Use seeders** for development and testing data
3. **Hash passwords** before storing them
4. **Use UUIDs** for primary keys
5. **Add indexes** for frequently queried fields
6. **Validate data** at both model and database level

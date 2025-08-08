# 📁 API Collections

This directory contains ready-to-use API collections for testing the **API-Scrap** endpoints.

## 📋 Available Collections

### 🟠 Postman Collection
- **File**: `API-Scrap.postman_collection.json`
- **Environment**: `API-Scrap.postman_environment.json`
- **Includes**: All API endpoints with automatic token management

### 🟣 Insomnia Collection  
- **File**: `API-Scrap.insomnia_collection.json`
- **Includes**: All API endpoints with environment variables

---

## 🚀 Quick Setup

### For Postman Users

1. **Import Collection**:
   - Open Postman
   - Click `Import` → `Upload Files`
   - Select `API-Scrap.postman_collection.json`

2. **Import Environment**:
   - Click `Import` again
   - Select `API-Scrap.postman_environment.json`
   - Set as active environment

3. **Start Testing**:
   - Ensure your API is running on `http://localhost:3000`
   - Run the **Login User** request first
   - Token will be automatically saved for subsequent requests

### For Insomnia Users

1. **Import Collection**:
   - Open Insomnia
   - Click `Application` → `Preferences` → `Data` → `Import Data`
   - Select `API-Scrap.insomnia_collection.json`

2. **Configure Environment**:
   - Environment variables are included in the collection
   - Base URL: `http://localhost:3000`
   - Token: Will be empty initially (copy from login response)

3. **Start Testing**:
   - Ensure your API is running
   - Run the **Login User** request first
   - Copy the token from response and update the `token` variable

---

## 📚 Included Endpoints

### 🔐 Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user account |
| `/auth/login` | POST | Authenticate and get JWT token |

### 🕷️ Web Scraping
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/scraping/scrape-url` | POST | Scrape links from URL |
| `/scraping/urls` | GET | Get paginated URLs list |
| `/scraping/links` | GET | Get paginated links by URL |

---

## 🔧 Environment Variables

Both collections include these environment variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` / `baseUrl` | `http://localhost:3000` | API base URL |
| `token` | `""` | JWT authentication token |

---

## 🧪 Testing Flow

1. **Start the API**: `npm run start:dev`

2. **Register or Login**: 
   - Use existing user: `admin@example.com` / `password123`
   - Or register a new user

3. **Test Scraping**: 
   - Use `Scrape URL` with a valid URL
   - Check results with `Get URLs` and `Get Links`

4. **Explore Pagination**: 
   - Try different `page` and `limit` parameters
   - Test edge cases (invalid URLs, empty results)

---

## 📝 Sample Request Bodies

### Register User
```json
{
  "username": "newuser",
  "email": "newuser@example.com", 
  "password": "password123"
}
```

### Login User
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Scrape URL
```json
{
  "url": "https://www.w3schools.com"
}
```

---

## 🎯 Features

### ✨ Postman Features
- **Automatic Token Management**: Login requests automatically save JWT tokens
- **Environment Variables**: Easy switching between development/production
- **Test Scripts**: Automated token extraction and validation
- **Documentation**: Rich descriptions for each endpoint

### ✨ Insomnia Features  
- **Clean Interface**: Organized request groups and descriptions
- **Environment Support**: Built-in variable management
- **Export/Import**: Easy sharing between team members
- **Response Formatting**: Automatic JSON formatting

---

## 🛠️ Customization

### Change Base URL
- **Postman**: Update the `baseUrl` in environment settings
- **Insomnia**: Update the `base_url` in environment variables

### Add New Endpoints
- Follow the existing naming convention with emojis
- Include proper descriptions and examples
- Add authentication headers where needed

---

## 📋 Prerequisites

- ✅ API running on `http://localhost:3000`
- ✅ Database with sample data (run migrations and seeders)
- ✅ Postman or Insomnia installed

---

**Happy Testing! 🚀**

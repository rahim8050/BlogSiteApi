# AGENTS.md - Developer Guide

## Project Overview
This is a Laravel 12 REST API for a blog site with authentication (Sanctum), posts, categories, tags, and comments.

## Technology Stack
- **Backend**: Laravel 12, PHP 8.2+
- **Database**: MySQL
- **Authentication**: Laravel Sanctum (Token-based)
- **Testing**: PHPUnit

---

## PHP Coding Standards

### 1. Code Style (Laravel Pint)
All code must follow Laravel's code style using **Pint**:
```bash
./vendor/bin/pint
```
Run Pint before every commit:
```bash
vendor/bin/pint
```

### 2. Static Analysis (PHPStan)
Run PHPStan for static analysis:
```bash
vendor/bin/phpstan analyse
```

### 3. Pre-commit Hooks
The project uses pre-commit hooks configured in `.pre-commit-config.yaml`:
- Laravel Pint for code formatting
- PHPStan for static analysis

Install hooks with:
```bash
pre-commit install
```

### 4. Coding Conventions
- Use PHP 8.2+ features (readonly properties, named arguments)
- Use type hints everywhere (return types, parameter types)
- Follow PSR-12 coding standards (handled by Pint)
- Use `public const` for constants instead of `define()`
- Use dependency injection via constructor
- Use strict types: `declare(strict_types=1);`

### 5. File Organization
```
app/
├── Http/Controllers/    # API Controllers
├── Models/             # Eloquent Models
├── Policies/           # Authorization Policies
├── Providers/          # Service Providers
database/
├── migrations/         # Database Migrations
├── factories/          # Model Factories
├── seeders/            # Database Seeders
routes/
├── api.php             # API Routes
├── web.php             # Web Routes
```

---

## API Documentation

### Base URL
```
http://localhost:8010/api
```

### Authentication
All authenticated endpoints require a Bearer token in the header:
```
Authorization: Bearer <token>
```

---

### Endpoints

#### 1. Authentication

**POST /register**
- Description: Register a new user
- Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "reader"  // admin, editor, author, reader
}
```
- Response (201):
```json
{
  "token": "...",
  "user": { "id": 1, "name": "...", "email": "...", "role": "..." }
}
```

**POST /login**
- Description: Login and get access token
- Body (JSON):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- Response (200):
```json
{
  "token": "...",
  "user": { "id": 1, "name": "...", "email": "...", "role": "..." }
}
```

**POST /logout** (Authenticated)
- Description: Revoke current access token
- Headers: `Authorization: Bearer <token>`
- Response (200):
```json
{ "message": "Logged out" }
```

---

#### 2. Posts

**GET /posts**
- Description: List all posts (public)
- Query Parameters:
  - `search` (optional): Search by title or body
  - `page` (optional): Pagination page
- Response (200):
```json
{
  "data": [
    { "id": 1, "title": "...", "body": "...", "slug": "...", ... }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 10, ... }
}
```

**GET /posts/{post}**
- Description: Get single post (public)
- Response (200):
```json
{
  "id": 1,
  "title": "...",
  "body": "...",
  "slug": "...",
  "user": { "id": 1, "name": "..." },
  "category": { "id": 1, "name": "..." },
  "tags": [ { "id": 1, "name": "..." } ],
  "comments": [ { "id": 1, "body": "...", "user": {...} } ]
}
```

**POST /posts** (Authenticated - Author/Editor/Admin)
- Description: Create a new post
- Headers: `Authorization: Bearer <token>`
- Body (Multipart):
```json
{
  "title": "My Post Title",
  "body": "Post content here...",
  "category_id": 1,
  "tags": [1, 2, 3],
  "cover_image": <file>
}
```
- Response (201): Created post object

**PUT /posts/{post}** (Authenticated - Owner/Admin/Editor)
- Description: Update a post
- Headers: `Authorization: Bearer <token>`
- Body: Same as create
- Response (200): Updated post object

**DELETE /posts/{post}** (Authenticated - Owner/Admin)
- Description: Delete a post
- Headers: `Authorization: Bearer <token>`
- Response (204): Empty response

---

#### 3. Categories

**GET /categories** (Authenticated)
- Description: List all categories
- Headers: `Authorization: Bearer <token>`
- Response (200):
```json
[
  { "id": 1, "name": "Technology", ... }
]
```

**POST /categories** (Authenticated - Admin/Editor)
- Description: Create category
- Headers: `Authorization: Bearer <token>`
- Body (JSON):
```json
{ "name": "Technology" }
```
- Response (201): Created category

**GET /categories/{category}** (Authenticated)
- Response (200): Category object

**PUT /categories/{category}** (Authenticated - Admin/Editor)
- Body (JSON): `{ "name": "New Name" }`
- Response (200): Updated category

**DELETE /categories/{category}** (Authenticated - Admin)
- Response (204): Empty

---

#### 4. Tags

**GET /tags** (Authenticated)
- Description: List all tags
- Headers: `Authorization: Bearer <token>`

**POST /tags** (Authenticated - Admin/Editor)
- Body (JSON): `{ "name": "laravel" }`

**GET /tags/{tag}** (Authenticated)

**PUT /tags/{tag}** (Authenticated - Admin/Editor)

**DELETE /tags/{tag}** (Authenticated - Admin)

---

#### 5. Comments

**GET /posts/{post}/comments** (Public)
- Description: Get comments for a post

**POST /posts/{post}/comments** (Authenticated)
- Headers: `Authorization: Bearer <token>`
- Body (JSON):
```json
{ "body": "Great article!" }
```

**DELETE /comments/{comment}** (Authenticated - Owner/Admin)
- Headers: `Authorization: Bearer <token>`
- Response (204)

---

## User Roles & Permissions

| Role    | Permissions                                    |
|---------|-----------------------------------------------|
| admin   | Full access to all resources                  |
| editor  | Manage posts, categories, tags               |
| author  | Create/update own posts                       |
| reader  | Read-only access (can comment)               |

---

## Running the Project

### 1. Setup
```bash
# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Create database and run migrations
php artisan migrate

# Start server on port 8010
php artisan serve --host=0.0.0.0 --port=8010
```

### 2. Testing
```bash
# Run all tests
php artisan test

# Run with coverage
php artisan test --coverage
```

### 3. Code Quality
```bash
# Format code
vendor/bin/pint

# Static analysis
vendor/bin/phpstan analyse

# Both
vendor/bin/pint && vendor/bin/phpstan analyse
```
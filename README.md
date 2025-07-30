# Blog API

This API is a simple blog backend built with Laravel 12. It exposes RESTful endpoints for posts, categories, tags and comments and uses Laravel Sanctum for authentication.

## Setup

1. Install Composer dependencies:
   ```bash
   composer install
   ```
2. Copy `.env.example` to `.env` and update your database configuration.
3. Run migrations:
   ```bash
   php artisan migrate
   ```
4. Serve the application:
   ```bash
   php artisan serve
   ```

## Endpoints

- `POST /api/register` – Register a new user.
- `POST /api/login` – Get an authentication token.
- `POST /api/logout` – Revoke the current token.
- `GET /api/posts` – List posts (searchable and paginated).
- `POST /api/posts` – Create a post (auth required).
- `GET /api/posts/{post}` – Show a single post.
- `PUT /api/posts/{post}` – Update a post (owner only).
- `DELETE /api/posts/{post}` – Delete a post (owner only).
- `POST /api/posts/{post}/comments` – Comment on a post.

All responses are JSON.

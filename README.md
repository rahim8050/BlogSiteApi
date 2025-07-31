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

- `POST /api/register` – Register a new user. The request must include
  `name`, `email`, `password`, `password_confirmation`, and a `role`
  (`admin`, `editor`, `author`, or `reader`). The response returns an API
  token and the created user including the selected role. If no role is
  provided the request will fail.
- `POST /api/login` – Get an authentication token.
- `POST /api/logout` – Revoke the current token.

The available user roles are `admin`, `editor`, `author`, and `reader`.
Seed data defaults to `reader`, but registration now requires clients to
explicitly choose a role.

- `GET /api/posts` – List posts (searchable and paginated).
- `POST /api/posts` – Create a post (auth required).
- `GET /api/posts/{post}` – Show a single post.
- `PUT /api/posts/{post}` – Update a post (owner only).
- `DELETE /api/posts/{post}` – Delete a post (owner only).
- `POST /api/posts/{post}/comments` – Comment on a post.

All responses are JSON.

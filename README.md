# SkinX Assignment — Fullstack Engineer

A fullstack post management application built with Next.js, NestJS, PostgreSQL, and Docker.

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | Next.js 14 (App Router)       |
| Backend   | NestJS 10                     |
| Database  | PostgreSQL 15 + TypeORM       |
| Auth      | JWT (Passport.js)             |
| Container | Docker Compose                |

## Project Structure

```
skin-x/
├── docker-compose.yml
├── assignment/
│   └── posts.json            # Source data (mounted into backend)
├── backend/                  # NestJS — feature-based
│   └── src/features/
│       ├── auth/             # Login, JWT, Passport strategies
│       ├── users/            # User entity & service
│       ├── posts/            # Post & Tag entities, CRUD, filter
│       └── seed/             # Auto-seed on startup
└── frontend/                 # Next.js — feature-based
    └── src/
        ├── app/              # App Router pages
        ├── features/
        │   ├── auth/         # Login form, API, types
        │   └── posts/        # List, detail, tag filter, types
        ├── shared/           # Axios client, Navbar
        └── middleware.ts     # Route auth guard
```

## Running the Project

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Start

```bash
docker compose up -d --build
```

This will:
1. Start PostgreSQL and wait until healthy
2. Build and start the NestJS backend — seeds the database on first boot
3. Build and start the Next.js frontend

### Access

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:3001 |

### Default Login

| Username | Password  |
|----------|-----------|
| `admin`  | `admin123`|

### Stop

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```

## API Endpoints

All endpoints except `/api/auth/login` require `Authorization: Bearer <token>`.

| Method | Path               | Description               |
|--------|--------------------|---------------------------|
| POST   | /api/auth/login    | Login, returns JWT        |
| GET    | /api/posts         | List posts (paginated)    |
| GET    | /api/posts?tag=X   | Filter posts by tag       |
| GET    | /api/posts/tags    | List all available tags   |
| GET    | /api/posts/:id     | Get single post detail    |

### Query parameters for `GET /api/posts`

| Param | Default | Description         |
|-------|---------|---------------------|
| tag   | —       | Filter by tag name  |
| page  | 1       | Page number         |
| limit | 10      | Items per page      |

## Features

- **Authentication** — JWT-based login, token stored in cookie, auto-redirect on 401
- **Post list** — paginated, sorted by date descending
- **Tag filter** — click any tag to filter posts; click again to clear
- **Post detail** — renders HTML content safely via DOMPurify (XSS protection)
- **Auto-seed** — backend seeds all posts from `posts.json` on first startup

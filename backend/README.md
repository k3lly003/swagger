# Ganzafrica Backend

This is the backend API for the Ganzafrica application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Server](#running-the-server)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Database](#database)
- [Testing](#testing)
- [Deployment](#deployment)

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v14+)
- pnpm (for monorepo management)

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd backend
pnpm install
```

### Environment Variables

Create a `.env` file in the root of the backend directory based on the example provided in `.env.example`:

```bash
DATABASE_URL="postgres://postgres:123456qwerty@localhost:5432/DBexample"
NODE_ENV=development
WEBSITE_URL="http://localhost:3000"
PORTAL_URL="http://localhost:3001"
API_PORT=3002
SESSION_SECRET=super_secret_development_key_at_least_32_chars
PASETO_SECRET=another_super_secret_development_key_at_least_32_chars
EMAIL_FROM="example@gmail.com"
EMAIL_PASSWORD="your_email_password"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

### Database Setup

1. Create a PostgreSQL database:

```bash
createdb ganzafrica
```

2. Generate migration files:

```bash
pnpm run db:generate
```

3. Run migrations:

```bash
pnpm run db:migrate
```

### Running the Server

Development mode with hot reloading:

```bash
pnpm run dev
```

Production build and start:

```bash
pnpm run build
pnpm start
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── db/             # Database schema & migrations
│   │   ├── schema/     # Schema definitions
│   │   └── migrations/ # Migration files
│   ├── middlewares/    # Express middlewares
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── validations/    # Request validation schemas
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── drizzle/            # Generated migration files
├── swagger/            # Swagger documentation
├── .env                # Environment variables
├── .env.example        # Example environment variables
└── README.md           # This file
```

## API Documentation

The API documentation is available at `/api/docs` when the server is running.

## Authentication

The API uses PASETO tokens for authentication with HTTP-only cookies. The following endpoints are available for authentication:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `POST /api/auth/logout` - Log out a user
- `POST /api/auth/verify-email` - Verify user email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user info

## Database

The database schema is defined using Drizzle ORM. The schema files are located in the `src/db/schema` directory.

### Database Management

- View database schema: `pnpm run db:studio`
- Generate migrations: `pnpm run db:generate`
- Run migrations: `pnpm run db:migrate`
- Push schema changes to database: `pnpm run db:push` (for development only)

## Testing

Run tests:

```bash
pnpm test
```

## Deployment

Build the application:

```bash
pnpm run build
```

The built application will be available in the `dist` directory, which can be deployed to a Node.js hosting service.

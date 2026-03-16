# Palmiqi Backend

Starter backend structure using TypeScript, Fastify, Node.js, PostgreSQL, and Prisma ORM.

## Stack

- TypeScript + Fastify
- PostgreSQL
- Prisma ORM
- JWT auth
- Fastify route schema validation
- Swagger API docs

## Project Structure

```text
prisma/
  schema.prisma
src/
  config/
  controllers/
  lib/
  middlewares/
  routes/
  services/
  types/
  utils/
  app.ts
  server.ts
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
copy .env.example .env
```

3. Update `DATABASE_URL` for your PostgreSQL database.

4. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

5. Start the server:

```bash
npm run dev
```

For a production build:

```bash
npm run build
npm start
```

6. Open Swagger UI:

```text
http://localhost:4000/docs
```

## Main API Areas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/me`
- `PUT /api/profile`
- `PUT /api/preferences`
- `POST /api/feedback`
- `PUT /api/readings/mulank`
- `PUT /api/daily-predictions`
- `GET /api/mood-logs`
- `POST /api/mood-logs`

## links

Database Model - https://app.chartdb.io/invite/164930cc39a34e23806792


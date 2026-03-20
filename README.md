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
  core/
    config/
    database/
    errors/
    http/
    storage/
    types/
  modules/
    auth/
    identity/
    profile/
    preferences/
    feedback/
    insights/
    mood/
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

4. Configure auth and uploads:

- Set `GOOGLE_CLIENT_ID` for a single Google OAuth client, or `GOOGLE_CLIENT_IDS` as a comma-separated list for Android/iOS/web clients.
- Set the S3 variables used for palm image uploads.

5. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

6. Start the server:

```bash
npm run dev
```

For a production build:

```bash
npm run build
npm start
```

7. Open Swagger UI:

```text
http://localhost:4000/docs
```

## Main API Areas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/me`
- `PUT /api/profile`
- `POST /api/profile/palm-upload-url`
- `PUT /api/preferences`
- `POST /api/feedback`
- `PUT /api/readings/mulank`
- `PUT /api/daily-predictions`
- `GET /api/mood-logs`
- `POST /api/mood-logs`

## links

Database Model - https://app.chartdb.io/invite/164930cc39a34e23806792

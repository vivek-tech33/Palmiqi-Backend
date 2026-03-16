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

## Assumptions From Your Diagram

- `User` is the main auth table.
- `Account` supports social login providers.
- `Profile`, `Preference`, `MulankReading`, and current `DailyPrediction` are modeled as one-to-one with `User`.
- `Feedback` and `MoodLog` are modeled as one-to-many because users usually create multiple entries over time.
- Nested structures in `MulankReading` and `DailyPrediction.predictions` are stored in PostgreSQL `jsonb` columns through Prisma `Json`.

If you want, the next pass can add:

- refresh token persistence
- OTP/email verification flow
- role-based auth
- file uploads for palm images
- separate tables instead of JSON for predictions/insights

## Google Login

This backend supports Google sign-in by verifying a Google ID token from the frontend.

1. Create a Google OAuth client.
2. Put the client ID into `.env` as `GOOGLE_CLIENT_ID`.
3. From the frontend, send the Google `idToken` to:

```http
POST /api/auth/google
Content-Type: application/json
```

```json
{
  "idToken": "google-id-token-from-frontend"
}
```

Behavior:

- if the Google account already exists in `Account`, the user is logged in
- if the email exists in `User` and Google says it is verified, the Google account is linked
- if the email does not exist, a new user and Google account are created

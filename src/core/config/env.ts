import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name];

  if (value === undefined || value === "") {
    if (fallback !== undefined) {
      return fallback;
    }

    throw new Error(`${name} is required`);
  }

  return value;
}

const nodeEnv = process.env.NODE_ENV ?? "development";

if (!["development", "test", "production"].includes(nodeEnv)) {
  throw new Error("NODE_ENV must be development, test, or production");
}

const port = Number(process.env.PORT ?? 4000);

if (Number.isNaN(port)) {
  throw new Error("PORT must be a number");
}

const env = {
  NODE_ENV: nodeEnv,
  PORT: port,
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
} as const;

export default env;

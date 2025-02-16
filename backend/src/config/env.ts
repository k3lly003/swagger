import { z } from "zod";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables from .env file
function loadEnv() {
  const backendEnvPath = path.resolve(__dirname, "../../.env");
  const rootEnvPath = path.resolve(__dirname, "../../../.env");

  if (fs.existsSync(backendEnvPath)) {
    dotenv.config({ path: backendEnvPath });
  } else if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
  } else {
    dotenv.config();
  }
}

loadEnv();

// Define environment variables schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Application
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  API_PORT: z.coerce.number().default(3002),
  API_BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3002),

  // URLs
  WEBSITE_URL: z.string().url(),
  PORTAL_URL: z.string().url(),

  // Authentication
  SESSION_SECRET: z.string().min(32),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),

  // Email
  EMAIL_FROM: z.string().email(),
  EMAIL_PASSWORD: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),

  // Security
  CORS_ORIGINS: z.string().transform((val) => val.split(",")),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX: z.coerce.number().default(100), // 100 requests per window
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

export default env;

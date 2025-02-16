import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

function loadEnv() {
  // Try to load from backend directory
  const backendEnvPath = path.resolve(__dirname, ".env");

  // Then try to load from root directory
  const rootEnvPath = path.resolve(__dirname, "../.env");

  if (fs.existsSync(backendEnvPath)) {
    console.log(`Loading environment from ${backendEnvPath}`);
    dotenv.config({ path: backendEnvPath });
  } else if (fs.existsSync(rootEnvPath)) {
    console.log(`Loading environment from ${rootEnvPath}`);
    dotenv.config({ path: rootEnvPath });
  } else {
    console.warn("No .env file found, using environment variables");
    dotenv.config();
  }
}

// Load environment variables
loadEnv();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

/**
 * Drizzle configuration
 */
export default {
  schema: "./src/db/schema/**/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  verbose: true,
  strict: true,
} satisfies Config;

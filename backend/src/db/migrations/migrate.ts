import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import path from "path";
import * as dotenv from "dotenv";
import { setupTriggers } from "./setup-triggers";

// Load environment variables
const envPath = path.resolve(__dirname, "../../../.env");
dotenv.config({ path: envPath });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

async function runMigrations() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    console.log("Starting database migrations...");
    const db = drizzle(pool);

    // Run the SQL migrations
    await migrate(db, {
      migrationsFolder: path.resolve(__dirname, "../../../drizzle"),
    });
    console.log("SQL migrations completed");

    // Setup triggers
    await setupTriggers();
    console.log("Triggers setup completed");

    console.log("All database migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations().catch(console.error);
}

export { runMigrations };

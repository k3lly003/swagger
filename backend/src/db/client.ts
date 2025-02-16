import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, PoolClient } from "pg";
import { env } from "../config";
import Logger from "../config/logger";
import * as schema from "./schema";

const logger = new Logger("DatabaseClient");

// Create a Postgres connection pool
const connectionPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
});

// Add error handling
connectionPool.on("error", (err) => {
  logger.error("Unexpected database error:", err);
  // In a production system, this would trigger monitoring alerts
});

// Initialize Drizzle with our schema
export const db = drizzle(connectionPool, { schema });

// Extend the pool with middleware functionality
export async function withDbTransaction<T>(
  callback: (txDb: any) => Promise<T>,
): Promise<T> {
  const client = await connectionPool.connect();
  try {
    await client.query("BEGIN");
    const txDb = drizzle(client, { schema });
    const result = await callback(txDb);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

// Setup context for audit logging
export async function setDbContext(
  userId: number | string | null,
  ipAddress: string | null,
) {
  const client = await connectionPool.connect();
  try {
    if (userId) {
      // Convert string IDs to numbers if needed
      const parsedId = typeof userId === "string" ? parseInt(userId) : userId;
      await client.query("SET LOCAL app.current_user_id = $1", [parsedId]);
    }
    if (ipAddress) {
      await client.query("SET LOCAL app.current_ip_address = $1", [ipAddress]);
    }
  } finally {
    client.release();
  }
}

// Close the database connection when the application shuts down
process.on("SIGINT", () => {
  logger.info("Closing database connections...");
  connectionPool.end().then(() => {
    logger.info("Database connections closed");
    process.exit(0);
  });
});

// Function to check database connectivity
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await connectionPool.connect();
    try {
      await client.query("SELECT 1");
      logger.info("Database connection successful");
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error("Database connection failed", error);
    return false;
  }
}

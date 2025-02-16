import { Pool } from "pg";
import fs from "fs";
import path from "path";

export async function setupTriggers() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    console.log("Setting up database triggers...");

    const sqlPath = path.resolve(__dirname, "../triggers.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    await pool.query(sql);

    console.log("Triggers setup complete!");
  } catch (error) {
    console.error("Error setting up triggers:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

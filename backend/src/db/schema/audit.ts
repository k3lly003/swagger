import { integer, pgTable, text, jsonb } from "drizzle-orm/pg-core";
import { timestampFields } from "./common";
import { users } from "./users";

export const audit_logs = pgTable("audit_logs", {
  id: integer("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  resource_type: text("resource_type").notNull(),
  resource_id: integer("resource_id"),
  changes: jsonb("changes"),
  ip_address: text("ip_address"),
  ...timestampFields,
});

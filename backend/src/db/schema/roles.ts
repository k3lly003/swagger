import {
  integer,
  pgTable,
  text,
  serial,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { timestampFields } from "./common";
import { users } from "./users";

// Roles Table
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  ...timestampFields,
});

// User Roles Table for mapping users to roles
export const user_roles = pgTable(
  "user_roles",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role_id: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    ...timestampFields,
  },
  (table) => {
    return {
      userRoleIdx: uniqueIndex("user_role_idx").on(
        table.user_id,
        table.role_id,
      ),
    };
  },
);

export const permissions = pgTable("permissions", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  resource: text("resource").notNull(),
  action: text("action").notNull(),
  ...timestampFields,
});

export const role_permissions = pgTable("role_permissions", {
  id: integer("id").primaryKey(),
  role_id: integer("role_id")
    .notNull()
    .references(() => roles.id),
  permission_id: integer("permission_id")
    .notNull()
    .references(() => permissions.id),
});

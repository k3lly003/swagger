import {
  pgTable,
  serial,
  text,
  boolean,
  jsonb,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { timestampFields } from "./common";
import { twoFactorMethodEnum } from "./enums";
import { roles } from "./roles";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role_id: integer("role_id")
    .notNull()
    .references(() => roles.id),
  password_hash: text("password_hash").notNull(),
  avatar_url: text("avatar_url"),
  two_factor_enabled: boolean("two_factor_enabled").notNull().default(false),
  two_factor_method: twoFactorMethodEnum("two_factor_method"),
  backup_codes: jsonb("backup_codes"),
  email_verified: boolean("email_verified").notNull().default(false),
  phone_number: text("phone_number"),
  phone_verified: boolean("phone_verified").notNull().default(false),
  last_password_change: timestamp("last_password_change"),
  last_login: timestamp("last_login"),
  is_active: boolean("is_active").notNull().default(true),
  account_locked: boolean("account_locked").notNull().default(false),
  failed_login_attempts: integer("failed_login_attempts").notNull().default(0),
  last_failed_attempt: timestamp("last_failed_attempt"),
  ...timestampFields,
});

export const user_profiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  bio: text("bio"),
  phone: text("phone"),
  address: text("address"),
  social_links: jsonb("social_links"),
  preferences: jsonb("preferences"),
  ...timestampFields,
});

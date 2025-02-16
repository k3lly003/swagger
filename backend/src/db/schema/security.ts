import {
  pgTable,
  text,
  serial,
  boolean,
  jsonb,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { timestampFields } from "./common";
import { users } from "./users";
import { verificationTypeEnum } from "./enums";

export const password_reset_tokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  token_hash: text("token_hash").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  ip_address: text("ip_address").notNull(),
  ...timestampFields,
});

export const verification_tokens = pgTable("verification_tokens", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  type: verificationTypeEnum("type").notNull(),
  token_hash: text("token_hash").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  ...timestampFields,
});

export const sessions = pgTable("sessions", {
  id: integer("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  token_hash: text("token_hash").notNull(),
  refresh_token_hash: text("refresh_token_hash"),
  expires_at: timestamp("expires_at").notNull(),
  last_activity: timestamp("last_activity").notNull(),
  ip_address: text("ip_address").notNull(),
  user_agent: text("user_agent").notNull(),
  device_info: jsonb("device_info"),
  is_valid: boolean("is_valid").notNull().default(true),
  ...timestampFields,
});

export const two_factor_temp_tokens = pgTable("two_factor_temp_tokens", {
  id: integer("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  token_hash: text("token_hash").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  ...timestampFields,
});

export const two_factor_credentials = pgTable("two_factor_credentials", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  method: text("method").notNull(),
  secret: text("secret"),
  verified: boolean("verified").notNull().default(false),
  ...timestampFields,
});

import {
  integer,
  pgTable,
  text,
  timestamp,
  jsonb,
  serial,
  varchar,
  index,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";
import { timestampFields } from "./common";
import { users } from "./users";
import { projectStatusEnum, projectMemberRoleEnum } from "./enums";

export const project_categories = pgTable("project_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  ...timestampFields,
});

// Projects Table
export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("full_description"),
    status: projectStatusEnum("status").notNull().default("planned"),
    category_id: integer("category_id")
      .references(() => project_categories.id)
      .notNull(),
    goals: jsonb("goals").$type<{
      items: Array<{
        id: string;
        title: string;
        description: string;
        completed?: boolean;
        order?: number;
      }>;
    }>(),
    
    outcomes: jsonb("outcomes").$type<{
      items: Array<{
        id: string;
        title: string;
        description: string;
        status?: string;
        order?: number;
      }>;
    }>(),

    location: varchar("location", { length: 255 }),
    media: jsonb("media").$type<{
      items: Array<{
        id: string;
        type: "image" | "video";
        url: string;
        cover: boolean;
        tag?: "feature" | "description" | "others";
        title?: string;
        description?: string;
        size?: number;
        duration?: number;
        thumbnailUrl?: string;
        order?: number;
      }>;
    }>(),
    
    other_information: jsonb("other_information").$type<{
      [key: string]: any;
    }>(),
    start_date: timestamp("start_date", { withTimezone: true }).notNull(),
    end_date: timestamp("end_date", { withTimezone: true }),

    created_by: integer("created_by")
      .notNull()
      .references(() => users.id),
    ...timestampFields,
  },
  (table) => {
    return {
      categoryIdx: index("projects_category_id_idx").on(table.category_id),
      createdByIdx: index("projects_created_by_idx").on(table.created_by),
      statusIdx: index("projects_status_idx").on(table.status),
    };
  },
);

// Project Members Table
export const project_members = pgTable(
  "project_members",
  {
    id: serial("id").primaryKey(),
    project_id: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id),
    role: projectMemberRoleEnum("role").notNull().default("member"),
    start_date: timestamp("start_date", { withTimezone: true }).notNull(),
    end_date: timestamp("end_date", { withTimezone: true }),
    is_active: boolean("is_active").notNull().default(true),
    ...timestampFields,
  },
  (table) => {
    return {
      projectIdx: index("project_members_project_id_idx").on(table.project_id),
      userIdx: index("project_members_user_id_idx").on(table.user_id),
      uniqueMembership: uniqueIndex("unique_project_user").on(
        table.project_id,
        table.user_id,
      ),
    };
  },
);

// Project Updates Table
export const project_updates = pgTable(
  "project_updates",
  {
    id: serial("id").primaryKey(),
    project_id: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    author_id: integer("author_id")
      .notNull()
      .references(() => users.id),
    title: varchar("title", { length: 200 }),
    content: jsonb("content").notNull(),
    media: jsonb("media").$type<{
      items: Array<{
        id: string;
        type: "image" | "video";
        url: string;
        cover: boolean;
        tag?: "feature" | "description" | "others";
        title?: string;
        description?: string;
      }>;
    }>(),
    update_type: varchar("update_type", { length: 50 }).default("general"),
    ...timestampFields,
  },
  (table) => {
    return {
      projectIdx: index("project_updates_project_id_idx").on(table.project_id),
      authorIdx: index("project_updates_author_id_idx").on(table.author_id),
    };
  },
);
import {
  integer,
  pgTable,
  text,
  timestamp,
  jsonb,
  serial,
  varchar,
  index,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { timestampFields } from "./common";
import { users } from "./users";
import { newsStatusEnum, newsCategoryEnum } from "./enums";

// News Tags Table
export const news_tags = pgTable("news_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  ...timestampFields,
});

// News Tags Relation Table (many-to-many)
export const news_to_tags = pgTable(
  "news_to_tags",
  {
    news_id: integer("news_id")
      .notNull()
      .references(() => news.id, { onDelete: "cascade" }),
    tag_id: integer("tag_id")
      .notNull()
      .references(() => news_tags.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.news_id, table.tag_id] }),
      newsIdx: index("news_to_tags_news_id_idx").on(table.news_id),
      tagIdx: index("news_to_tags_tag_id_idx").on(table.tag_id),
    };
  },
);

// News Table
export const news = pgTable(
  "news",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    status: newsStatusEnum("status").notNull().default("not_published"),
    publish_date: timestamp("publish_date", { withTimezone: true }),
    category: newsCategoryEnum("category").notNull().default("news"),
    key_lessons: text("key_lessons"),
    media: jsonb("media").$type<{
      items: Array<{
        id: string;
        type: "image" | "video";
        url: string;
        cover: boolean;
        size?: number;
        duration?: number;
        thumbnailUrl?: string;
        order?: number;
      }>;
    }>(),

    created_by: integer("created_by")
      .notNull()
      .references(() => users.id),
    ...timestampFields,
  },
  (table) => {
    return {
      statusIdx: index("news_status_idx").on(table.status),
      categoryIdx: index("news_category_idx").on(table.category),
      createdByIdx: index("news_created_by_idx").on(table.created_by),
      publishDateIdx: index("news_publish_date_idx").on(table.publish_date),
    };
  },
);

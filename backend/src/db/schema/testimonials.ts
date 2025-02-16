import {
  integer,
  pgTable,
  text,
  varchar,
  serial,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { timestampFields } from "./common";

// Testimonials Table
export const testimonials = pgTable(
  "testimonials",
  {
    id: serial("id").primaryKey(),
    author_name: varchar("author_name", { length: 200 }).notNull(),
    position: varchar("position", { length: 200 }),
    image: text("image"),
    description: text("description").notNull(),
    company: varchar("company", { length: 200 }),
    occupation: varchar("occupation", { length: 200 }),
    date: timestamp("date", { withTimezone: true }).defaultNow(),
    rating: integer("rating"),
    ...timestampFields,
  },
  (table) => {
    return {
      authorNameIdx: index("testimonials_author_name_idx").on(
        table.author_name,
      ),
      companyIdx: index("testimonials_company_idx").on(table.company),
      ratingIdx: index("testimonials_rating_idx").on(table.rating),
    };
  },
);

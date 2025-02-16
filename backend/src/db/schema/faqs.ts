import {
  integer,
  pgTable,
  text,
  timestamp,
  serial,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { timestampFields } from "./common";
import { users } from "./users";

// FAQs Table
export const faqs = pgTable(
  "faqs",
  {
    id: serial("id").primaryKey(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    is_active: boolean("is_active").notNull().default(true),
    view_count: integer("view_count").notNull().default(0),

    ...timestampFields,
  },
  (table) => {
    return {
      isActiveIdx: index("faqs_is_active_idx").on(table.is_active),
    };
  },
);

export default faqs;

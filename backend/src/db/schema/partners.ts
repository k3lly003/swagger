import {
  integer,
  pgTable,
  text,
  varchar,
  serial,
  index,
} from "drizzle-orm/pg-core";
import { timestampFields } from "./common";

// Partners Table
export const partners = pgTable(
  "partners",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    logo: text("logo"),
    website_url: varchar("website_url", { length: 255 }),
    location: varchar("location", { length: 255 }),
    ...timestampFields,
  },
  (table) => {
    return {
      nameIdx: index("partners_name_idx").on(table.name),
      locationIdx: index("partners_location_idx").on(table.location),
    };
  },
);

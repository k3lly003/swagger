import {
  integer,
  pgTable,
  text,
  serial,
  varchar,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { timestampFields } from "./common";

// Team Types Table
export const team_types = pgTable("team_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  ...timestampFields,
});

// Teams Table
export const teams = pgTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    position: varchar("position", { length: 200 }),
    photo_url: varchar("photo_url", { length: 255 }),
    bio: text("bio"),
    email: varchar("email", { length: 255 }),
    profile_link: varchar("profile_link", { length: 255 }),
    skills: jsonb("skills").$type<string[]>(),
    team_type_id: integer("team_type_id")
      .references(() => team_types.id)
      .notNull(),
    ...timestampFields,
  },
  (table) => {
    return {
      teamTypeIdx: index("teams_team_type_id_idx").on(table.team_type_id),
      emailIdx: index("teams_email_idx").on(table.email),
    };
  },
);

// Default export
export default { team_types, teams };

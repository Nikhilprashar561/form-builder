import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const visibilityEnum = pgEnum("visibility_mode", ["public", "unlisted"]);
export const statusEnum = pgEnum("form_status", ["draft", "published", "unpublished", "archived"]);

export const formTable = pgTable(
  "form",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    title: varchar("title", { length: 55 }).notNull(),
    description: varchar("description", { length: 300 }),

    createdBy: uuid("created_by").references(() => usersTable.id),

    slug: text("slug").notNull().unique(), // Custom shareable form links
    formLink: varchar("form_link", { length: 100 }).notNull(),
    
    status: statusEnum("status").default("draft").notNull(),
    visibilityMode: visibilityEnum("visibility_mode").default("unlisted").notNull(),

    isPasswordProtected: boolean("is_password_protected").default(false).notNull(),
    passwordHash: text("password_hash"),
    
    expiresAt: timestamp("expires_at"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("forms_user_id_idx").on(table.createdBy),
    slugIdx: index("forms_slug_idx").on(table.slug),
    visibilityIdx: index("forms_visibility_idx").on(table.visibilityMode),
  }),
);

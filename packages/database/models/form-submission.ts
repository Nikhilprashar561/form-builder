import { index, jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { formTable } from "./form";

export interface formSubmissionValue {
  formFieldId: string;
  value: string;
}

export type FormSubmissionValuesRow = formSubmissionValue[];

export const formSubmission = pgTable(
  "form_submission",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .notNull()
      .references(() => formTable.id, { onDelete: "cascade" }),
    respondentId: uuid("respondent_id").references(() => usersTable.id, { onDelete: "cascade" }),

    values: jsonb("value").$type<FormSubmissionValuesRow>(),

    // optional, if they user logged in
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => ({
    formIdIdx: index("responses_form_id_idx").on(table.formId),
    submittedAtIdx: index("responses_submitted_at_idx").on(table.submittedAt),
  }),
);

import db, { desc, eq } from "@repo/database";
import {
  getSubmitFormInput,
  GetSubmitFormInputType,
  submitFormInput,
  SubmitFormInputType,
} from "./model";
import { formSubmission } from "@repo/database/schema";
import { TRPCError } from "@trpc/server";

class FormSubmission {
  public async submitForm(payload: SubmitFormInputType) {
    const { formId, values } = await submitFormInput.parseAsync(payload);

    const result = await db
      .insert(formSubmission)
      .values({ formId, values })
      .returning({ id: formSubmission.id });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to submit form response",
      });
    }

    return {
      message: "Form submitted successfully",
      submissionId: result[0].id,
    };
  }

  public async getFormSubmissions(payload: GetSubmitFormInputType) {
    const { formId } = await getSubmitFormInput.parseAsync(payload);

    const result = await db
      .select({
        id: formSubmission.id,
        values: formSubmission.values,
        createdAt: formSubmission.createdAt,
      })
      .from(formSubmission)
      .where(eq(formSubmission.formId, formId))
      .orderBy(desc(formSubmission.createdAt));

    return result.map((row) => ({
      ...row,
      createdAt: row.createdAt?.toISOString() ?? "",
    }));
  }
}

export { FormSubmission };

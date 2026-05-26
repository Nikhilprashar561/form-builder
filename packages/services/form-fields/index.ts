import db, { eq, max } from "@repo/database";
import { formsFields } from "@repo/database/schema";
import { createNewFormFieldInput, CreateNewFormFieldInputType } from "./model";

function toLabelKey(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

class FormFields {
  private async getNextIndex(formId: string): Promise<string> {
    const result = await db
      .select({ maxIndex: max(formsFields.index) })
      .from(formsFields)
      .where(eq(formsFields.formId, formId));

    const current = result[0]?.maxIndex;
    const next = current ? parseFloat(current) + 1 : 1;
    return next.toFixed(2);
  }

  public async createNewFormField(payload: CreateNewFormFieldInputType) {
   
  }

  public async updateNewCreatedFormField() {}

  public async deleteCreatedFormField() {}

  public async getOneSpecificFormField() {}

  public async getAllFormFieldsOfOneForm() {}
}

export { FormFields };

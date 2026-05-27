// packages/services/form-fields/index.ts
import db, { eq, max, asc } from "@repo/database";
import { formsFields } from "@repo/database/schema";
import {
  CreateNewFormFieldInputType,
  UpdateCreatedFormFieldInputType,
  DeleteCreatedFormFieldInputType,
  GetOneSpecificFormFieldInputType,
  GetAllFormFieldsOfOneFormInputType,
} from "./model";

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
    const labelKey = toLabelKey(payload.label);
    const nextIndex = await this.getNextIndex(payload.formId);

    const [created] = await db
      .insert(formsFields)
      .values({
        label: payload.label,
        labelKey,
        placeholder: payload.placeholder ?? null,
        isRequired: payload.isRequired,
        type: payload.type,
        formId: payload.formId,
        order: payload.order,
        index: nextIndex,
      })
      .returning({ id: formsFields.id });

    if (!created) throw new Error("Failed to create form field");

    return { id: created.id };
  }

  public async updateCreatedFormField(payload: UpdateCreatedFormFieldInputType) {
    const updateData: Partial<typeof formsFields.$inferInsert> = {};

    if (payload.label !== undefined) {
      updateData.label = payload.label;
      updateData.labelKey = toLabelKey(payload.label); // keep labelKey in sync
    }
    if (payload.placeholder !== undefined) updateData.placeholder = payload.placeholder;
    if (payload.isRequired !== undefined) updateData.isRequired = payload.isRequired;
    if (payload.type !== undefined) updateData.type = payload.type;
    if (payload.order !== undefined) updateData.order = payload.order;

    const [updated] = await db
      .update(formsFields)
      .set(updateData)
      .where(eq(formsFields.id, payload.fieldId))
      .returning({ id: formsFields.id });

    if (!updated) throw new Error("Form field not found or update failed");

    return { message: "Form field updated successfully", fieldId: updated.id };
  }

  public async deleteCreatedFormField(payload: DeleteCreatedFormFieldInputType) {
    const [deleted] = await db
      .delete(formsFields)
      .where(eq(formsFields.id, payload.fieldId))
      .returning({ id: formsFields.id });

    if (!deleted) throw new Error("Form field not found or already deleted");

    return { message: "Form field deleted successfully" };
  }

  public async getOneSpecificFormField(payload: GetOneSpecificFormFieldInputType) {
    const [field] = await db
      .select({
        id: formsFields.id,
        label: formsFields.label,
        placeholder: formsFields.placeholder,
        isRequired: formsFields.isRequired,
        type: formsFields.type,
        order: formsFields.order,
      })
      .from(formsFields)
      .where(eq(formsFields.id, payload.fieldId));

    if (!field) throw new Error("Form field not found");

    return field;
  }

  public async getAllFormFieldsOfOneForm(payload: GetAllFormFieldsOfOneFormInputType) {
    const fields = await db
      .select({
        id: formsFields.id,
        label: formsFields.label,
        placeholder: formsFields.placeholder,
        isRequired: formsFields.isRequired,
        type: formsFields.type,
        order: formsFields.order,
      })
      .from(formsFields)
      .where(eq(formsFields.formId, payload.formId))
      .orderBy(asc(formsFields.order));

    return fields;
  }
}

export { FormFields };

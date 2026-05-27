import db, { asc, eq } from "@repo/database";
import {
  createNewFormInput,
  CreateNewFormInputType,
  getCreatedFormInput,
  GetCreatedFormInputType,
  getOneSpecificForm,
  GetOneSpecificFormInputType,
  updateCreatedFormInput,
  UpdateCreatedFormInputType,
} from "./model";
import { formsFields, formTable } from "@repo/database/schema";
import { TRPCError } from "@trpc/server";
import { env } from "../env";

class FormService {
  
  public async createNewForm(paylaod: CreateNewFormInputType) {
    const {
      title,
      description,
      createdBy,
      slug,
      status,
      visibilityMode,
      isPasswordProtected,
      passwordHash,
      expiresAt,
    } = await createNewFormInput.parseAsync(paylaod);

    // Store into DB
    // Check Created or not
    // if created then return it

    const formUrl = `${env.FRONTEND_URL}/${slug}`;

    const currentDate = new Date();
    const expireDate = new Date(expiresAt);
    if (expireDate.getTime() < currentDate.getTime())
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid Expire time",
      });

    const result = await db
      .insert(formTable)
      .values({
        title,
        description,
        createdBy,
        slug,
        status,
        visibilityMode,
        isPasswordProtected,
        passwordHash,
        expiresAt,
        formLink: formUrl,
      })
      .returning({ id: formTable.id });

    if (result.length === 0 || !result || !result[0]?.id)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Form creation failed",
      });

    return { id: result[0].id };
  }

  public async getCreatedForms(payload: GetCreatedFormInputType) {
    const { userId } = await getCreatedFormInput.parseAsync(payload);

    const forms = await db
      .select({
        id: formTable.id,
        title: formTable.title,
        description: formTable.description,
        slug: formTable.slug,
        status: formTable.status,
        visibilityMode: formTable.visibilityMode,
        isPasswordProtected: formTable.isPasswordProtected,
        expiresAt: formTable.expiresAt,
      })
      .from(formTable)
      .where(eq(formTable.createdBy, userId));

    return forms;
  }

  public async updateCreatedForm(payload: UpdateCreatedFormInputType) {
    const {
      formId,
      title,
      description,
      slug,
      status,
      visibilityMode,
      isPasswordProtected,
      passwordHash,
      expiresAt,
    } = await updateCreatedFormInput.parseAsync(payload);

    // Build the update object with only provided fields
    const updateData: Record<string, any> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (slug !== undefined) updateData.slug = slug;
    if (status !== undefined) updateData.status = status;
    if (visibilityMode !== undefined) updateData.visibilityMode = visibilityMode;
    if (isPasswordProtected !== undefined) updateData.isPasswordProtected = isPasswordProtected;
    if (passwordHash !== undefined) updateData.passwordHash = passwordHash;
    if (expiresAt !== undefined) {
      const expireDate = new Date(expiresAt!);
      const currentDate = new Date();

      if (expireDate.getTime() < currentDate.getTime()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Expire time",
        });
      }

      updateData.expiresAt = expireDate;
    }

    const result = await db
      .update(formTable)
      .set(updateData)
      .where(eq(formTable.id, formId))
      .returning({ id: formTable.id });

    if (result.length === 0 || !result[0]?.id) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Form not found or update failed",
      });
    }

    return { id: result[0].id };
  }

  public async deleteCreatedForm(payload: GetOneSpecificFormInputType) {
    const { formId } = await getOneSpecificForm.parseAsync(payload);

    const result = await db
      .delete(formTable)
      .where(eq(formTable.id, formId))
      .returning({ id: formTable.id });

    if (result.length === 0 || !result[0]?.id) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Form not found or deletion failed",
      });
    }

    return { message: "Form deleted successfully", id: result[0].id };
  }

  public async getOneSpcificForm(payload: GetOneSpecificFormInputType) {
    const { formId } = await getOneSpecificForm.parseAsync(payload);

    const rows = await db
      .select({
        // Form columns
        id: formTable.id,
        title: formTable.title,
        description: formTable.description,
        slug: formTable.slug,
        status: formTable.status,
        visibilityMode: formTable.visibilityMode,
        isPasswordProtected: formTable.isPasswordProtected,
        expiresAt: formTable.expiresAt,
        createdAt: formTable.createdAt,
        updatedAt: formTable.updatedAt,
        // Field columns (nullable due to leftJoin)
        field: {
          id: formsFields.id,
          label: formsFields.label,
          labelKey: formsFields.labelKey,
          type: formsFields.type,
          placeholder: formsFields.placeholder,
          isRequired: formsFields.isRequired,
          index: formsFields.index,
        },
      })
      .from(formTable)
      .leftJoin(formsFields, eq(formsFields.formId, formTable.id))
      .where(eq(formTable.id, formId))
      .orderBy(asc(formsFields.index));

    if (rows.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Form not found",
      });
    }

    const firstRow = rows[0]!;

    const fields = rows
      .filter(
        (row): row is typeof row & { field: NonNullable<typeof row.field> } =>
          row.field?.id != null,
      )
      .map((row) => ({
        id: row.field.id,
        label: row.field.label,
        labelKey: row.field.labelKey,
        type: row.field.type,
        placeholder: row.field.placeholder,
        isRequired: row.field.isRequired,
        index: Number(row.field.index),
      }));

    return {
      id: firstRow.id,
      title: firstRow.title,
      description: firstRow.description ?? null,
      slug: firstRow.slug,
      status: firstRow.status,
      visibilityMode: firstRow.visibilityMode,
      isPasswordProtected: firstRow.isPasswordProtected,
      expiresAt: firstRow.expiresAt,
      createdAt: firstRow.createdAt ?? null,
      updatedAt: firstRow.updatedAt ?? null,
      fields,
    };
  }
}

export { FormService };

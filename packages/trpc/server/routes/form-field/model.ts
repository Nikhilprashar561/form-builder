// packages/trpc/server/routes/form-field/model.ts
import { z } from "zod";

const fieldTypeEnum = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

export const createNewFormFieldInput = z.object({
  label: z.string().describe("Field label"),
  placeholder: z.string().optional().nullable().describe("Field placeholder"),
  isRequired: z.boolean().default(false).describe("Is field required"),
  type: fieldTypeEnum.describe("Field type"),
  formId: z.string().uuid().describe("UUID of the form"),
  order: z.number().describe("Field order number"),
});

export const createNewFormFieldOutput = z.object({
  id: z.string().uuid().describe("UUID of the created form field"),
});

export const updateCreatedFormFieldInput = z.object({
  fieldId: z.string().uuid().describe("UUID of the form field to update"),
  label: z.string().optional().describe("Field label"),
  placeholder: z.string().optional().nullable().describe("Field placeholder"),
  isRequired: z.boolean().optional().describe("Is field required"),
  type: fieldTypeEnum.optional().describe("Field type"),
  order: z.number().optional().describe("Field order number"),
});

export const updateCreatedFormFieldOutput = z.object({
  message: z.string().describe("Update confirmation message"),
  fieldId: z.string().uuid().describe("UUID of the updated form field"),
});

export const deleteCreatedFormFieldInput = z.object({
  fieldId: z.string().uuid().describe("UUID of the form field to delete"),
});

export const deleteCreatedFormFieldOutput = z.object({
  message: z.string().describe("Deletion confirmation message"),
});

export const getOneSpecificFormFieldInput = z.object({
  fieldId: z.string().uuid().describe("UUID of the form field to get"),
});

export const getOneSpecificFormFieldOutput = z.object({
  id: z.string().uuid(),
  label: z.string(),
  placeholder: z.string().optional().nullable(),
  isRequired: z.boolean().nullable(),
  type: fieldTypeEnum,
  order: z.number(),
});

export const getAllFormFieldsOfOneFormInput = z.object({
  formId: z.string().uuid().describe("UUID of the form"),
});

export const getAllFormFieldsOfOneFormOutput = z.array(getOneSpecificFormFieldOutput);

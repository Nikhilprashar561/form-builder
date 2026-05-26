import { z } from "zod";

export const createNewFormFieldInput = z.object({ // Create Accessible form field input validation schema
  label: z.string().describe("Field label"),
  placeholder: z.string().optional().describe("Field placeholder"),
  isRequired: z.boolean().default(false).describe("Is field required"),
  type: z.enum(["text", "textarea", "select", "checkbox", "radio"]).describe("Field type"),
  formId: z.string().uuid().describe("UUID of the form"),
  order: z.number().optional().describe("Field Order number").nullable(),
});

export const createNewFormFieldOutput = z.object({ // Create Accessible form field output validation schema
  id: z.string().uuid().describe("UUID of the created form field"),
});

export const updateCreatedFormFieldInput = z.object({ // Update Accessible form field input validation schema
  fieldId: z.string().uuid().describe("UUID of the form field to update"),
  label: z.string().optional().describe("Field label"),
  placeholder: z.string().optional().describe("Field placeholder"),
  isRequired: z.boolean().optional().describe("Is field required"),
  type: z
    .enum(["text", "textarea", "select", "checkbox", "radio"])
    .optional()
    .describe("Field type"),
  order: z.number().optional().describe("Field Order number"),
});

export const updateCreatedFormFieldOutput = z.object({ // Update Accessible form field output validation schema
  message: z.string().describe("Update confirmation message"),
  fieldId: z.string().uuid().describe("UUID of the updated form field"),
});

export const deleteCreatedFormFieldInput = z.object({ // Delete Accessible form field input validation schema
  fieldId: z.string().uuid().describe("UUID of the form field to delete"),
});

export const deleteCreatedFormFieldOutput = z.object({ // Delete Accessible form field output validation schema
  message: z.string().describe("Deletion confirmation message"),
});

export const getOneSpecificFormFieldInput = z.object({ // 
  fieldId: z.string().uuid().describe("UUID of the form field to get"),
});

export const getOneSpecificFormFieldOutput = z.object({
  id: z.string().uuid().describe("UUID of the form field"),
  label: z.string().describe("Field label"),
  placeholder: z.string().optional().describe("Field placeholder"),
  isRequired: z.boolean().describe("Is field required"),
  type: z.enum(["text", "textarea", "select", "checkbox", "radio"]).describe("Field type"),
  order: z.number().describe("Field Order number"),
});

export const getAllFormFieldsOfOneFormInput = z.object({
  formId: z.string().uuid().describe("UUID of the form to get its fields"),
});

export const getAllFormFieldsOfOneFormOutput = z
  .array(getOneSpecificFormFieldOutput)
  .describe("Array of form fields of a specific form");

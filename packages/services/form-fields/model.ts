import { z } from "zod"

const fieldTypeEnum = z.enum(["text", "textarea", "select", "checkbox", "radio"]);

export const createNewFormFieldInput = z.object({
    label: z.string().describe("Field label"),
    placeholder: z.string().optional().describe("Field placeholder").nullable(),
    isRequired: z.boolean().describe("Is field required"),
    type: fieldTypeEnum.describe("Field type"),
    formId: z.string().uuid().describe("UUID of the form"),
    order: z.number().describe('Field Order number')
})


export type CreateNewFormFieldInputType = z.infer<typeof createNewFormFieldInput>;

export const updateCreatedFormFieldInput = z.object({
    fieldId: z.string().uuid().describe("UUID of the form field to update"),
    label: z.string().optional().describe("Field label"),
    placeholder: z.string().optional().describe("Field placeholder"),
    isRequired: z.boolean().optional().describe("Is field required"),
    type: fieldTypeEnum.optional().describe("Field type"),
    order: z.number().optional().describe('Field Order number')
})

export type UpdateCreatedFormFieldInputType = z.infer<typeof updateCreatedFormFieldInput>;

export const deleteCreatedFormFieldInput = z.object({
    fieldId: z.string().uuid().describe("UUID of the form field to delete"),
})

export type DeleteCreatedFormFieldInputType = z.infer<typeof deleteCreatedFormFieldInput>;

export const getOneSpecificFormFieldInput = z.object({
    fieldId: z.string().uuid().describe("UUID of the form field to get"),
})

export type GetOneSpecificFormFieldInputType = z.infer<typeof getOneSpecificFormFieldInput>;

export const getAllFormFieldsOfOneFormInput = z.object({
    formId: z.string().uuid().describe("UUID of the form to get its fields"),
})

export type GetAllFormFieldsOfOneFormInputType = z.infer<typeof getAllFormFieldsOfOneFormInput>;


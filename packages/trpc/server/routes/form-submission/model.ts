import { z } from "zod"

export const submitFormInput = z.object({
    formId: z.string().uuid().describe('UUID of the form being submitted'),
    values: z.array(z.object({
        formFieldId: z.string().uuid().describe('UUID of the form field'),
        value: z.string().describe('Answer value for this field')
    })).min(1, 'At least one field value is required')
})

export const submitFormOutput = z.object({
    message: z.string().describe('Submission confirmation message'),
    submissionId: z.string().uuid().describe('UUID of the created form submission')
})

export const getSubmitFormInput = z.object({
    formId: z.string().uuid().describe('UUID of the form to get its submissions'),
})

export const getSubmitFormOutput = z.array(z.object({
    id: z.string().uuid().describe('UUID of the form submission'),
    createdAt: z.string().describe('Timestamp of when the form submission was created'),
    values: z.array(z.object({
        formFieldId: z.string().uuid().describe('UUID of the form field'),
        value: z.string().describe('Answer value for this field')
    })).describe('Array of field values submitted for the form').nullable(),
})).describe('Array of form submissions for a specific form') 

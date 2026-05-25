import { z } from "zod";

export const createNewFormInput = z.object({ // Create New Form
    title: z.string().describe("Created form title"),
    description: z.string().describe("Form Description").optional(),
    createdBy: z.string().uuid().describe("UUID of register user"),
    slug: z.string().describe("Unique URL of form"),
    status: z.enum(["draft", "published", "unpublished", "archived"]).describe("Form Current Status"),
    visibilityMode: z.enum(["public", "unlisted"]).describe("Form Visibility"),
    isPasswordProtected: z.boolean().describe("Password Protected form"),
    passwordHash: z.string().optional().describe("Form password"),
    expiresAt: z.string().describe("Form Expire time"),
});

export const createdFormOutput = z.object({
    id: z.string().uuid().describe("UUID of the created form"),
})

export const getCreatedFormInput = z.object({ // Get Created Forms of a specific user
    userId: z.string().uuid().describe("UUID of the user"),
})

export const getCreatedFormOutput = z.array(z.object({
    id: z.string().uuid().describe("UUID of the created form"),
    title: z.string().describe("Created form title"),
    description: z.string().describe("Form Description").optional(),
    createdBy: z.string().uuid().describe("UUID of register user"),
    slug: z.string().describe("Unique URL of form"),
    status: z.enum(["draft", "published", "unpublished", "archived"]).describe("Form Current Status"),
    visibilityMode: z.enum(["public", "unlisted"]).describe("Form Visibility"),
    isPasswordProtected: z.boolean().describe("Password Protected form"),
    expiresAt: z.string().describe("Form Expire time"),
})).describe("Array of forms created by a specific user")

export const getOneSpecificFormInput = z.object({ // Get One Specific Form
    formId: z.string().uuid().describe("UUID of the form")
})

export const getOneSpecificFormOutput = z.object({
    id: z.string().uuid().describe("UUID of the created form"),
    title: z.string().describe("Created form title"),
    description: z.string().describe("Form Description").optional(),
    createdBy: z.string().uuid().describe("UUID of register user"),
    slug: z.string().describe("Unique URL of form"),
    status: z.enum(["draft", "published", "unpublished", "archived"]).describe("Form Current Status"),
    visibilityMode: z.enum(["public", "unlisted"]).describe("Form Visibility"),
    isPasswordProtected: z.boolean().describe("Password Protected form"),
    expiresAt: z.string().describe("Form Expire time"),
})

export const updateCreatedFormInput = z.object({ // Update Form
    formId: z.string().uuid().describe("UUID of the form to update"),
    title: z.string().optional().describe("Created form title"),
    description: z.string().describe("Form Description").optional(),
    slug: z.string().optional().describe("Unique URL of form"),
    status: z.enum(["draft", "published", "unpublished", "archived"]).optional().describe("Form Current Status"),
    visibilityMode: z.enum(["public", "unlisted"]).optional().describe("Form Visibility"),
    isPasswordProtected: z.boolean().optional().describe("Password Protected form"),
    passwordHash: z.string().optional().describe("Form password"),
    expiresAt: z.string().optional().describe("Form Expire time"),
})

export const updateCreatedFormOutput = z.object({
    message: z.string().describe("Update confirmation message"),
    formId: z.string().uuid().describe("UUID of the updated form"),
})

export const deleteCreatedFormInput = z.object({ // Delete 
    formId: z.string().uuid().describe("UUID of the form to delete"),
})

export const deleteCreatedFormOutput = z.object({
    message: z.string().describe("Deletion confirmation message"),
})  

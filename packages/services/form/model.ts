import { boolean, z } from "zod";

const formVisibility = z.enum(["public", "unlisted"]);
const statusEnum = z.enum(["draft", "published", "unpublished", "archived"]);

export const createNewFormInput = z.object({
  title: z.string().describe("Created form title"),
  description: z.string().describe("Form Description").optional(),
  createdBy: z.string().uuid().describe("UUID of register user"),
  slug: z.string().describe("Unique URL of form"),
  status: statusEnum.describe("Form Current Status"),
  visibilityMode: formVisibility.describe("Form Visibility"),
  isPasswordProtected: boolean().describe("Password Protected form"),
  passwordHash: z.string().optional().describe("Form password"),
  expiresAt: z.coerce.date().describe("Form Expire time"),
});

export type CreateNewFormInputType = z.infer<typeof createNewFormInput>;

export const getCreatedFormInput = z.object({
  userId: z.string().uuid().describe("UUID of the user"),
});

export type GetCreatedFormInputType = z.infer<typeof getCreatedFormInput>;

export const getOneSpecificForm = z.object({
    formId: z.string().uuid().describe("UUID of the form")
})

export type GetOneSpecificFormInputType = z.infer<typeof getOneSpecificForm>

export const updateCreatedFormInput = z.object({
  formId: z.string().uuid().describe("UUID of the form to update"),
  title: z.string().optional().describe("Created form title"),
  description: z.string().describe("Form Description").optional(),
  slug: z.string().optional().describe("Unique URL of form"),
  status: statusEnum.optional().describe("Form Current Status"),
  visibilityMode: formVisibility.optional().describe("Form Visibility"),
  isPasswordProtected: boolean().optional().describe("Password Protected form"),
  passwordHash: z.string().optional().describe("Form password"),
  expiresAt: z.coerce.date().describe("Form Expire time").nullable().optional(),
});

export type UpdateCreatedFormInputType = z.infer<typeof updateCreatedFormInput>;

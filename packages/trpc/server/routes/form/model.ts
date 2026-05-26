import { z } from "zod";
import { getOneSpecificFormFieldOutput } from "../form-field/model";

// #1 Create a new form

export const createNewFormInput = z.object({
  // Create New Form
  title: z.string().describe("Created form title"),
  description: z.string().describe("Form Description").optional(),
  createdBy: z.string().uuid().describe("UUID of register user"),
  slug: z.string().describe("Unique URL of form"),
  status: z.enum(["draft", "published", "unpublished", "archived"]).describe("Form Current Status"),
  visibilityMode: z.enum(["public", "unlisted"]).describe("Form Visibility"),
  isPasswordProtected: z.boolean().describe("Password Protected form"),
  passwordHash: z.string().optional().describe("Form password"),
  expiresAt: z.coerce.date().describe("Form Expire time"),
});

export const createdFormOutput = z.object({
  id: z.string().uuid().describe("UUID of the created form"),
});

// #2 Get one specific form

export const getCreatedFormInput = z.object({
  // Get Created Forms of a specific user
  id: z.string().uuid().describe("UUID of the user"),
});

export const getCreatedFormOutput = z.array(
  z.object({
    id: z.string().uuid().describe("UUID of the created form"),
    title: z.string().describe("Created form title"),
    description: z.string().describe("Form Description").optional(),
    slug: z.string().describe("Unique URL of form"),
    status: z
      .enum(["draft", "published", "unpublished", "archived"])
      .describe("Form Current Status"),
    visibilityMode: z.enum(["public", "unlisted"]).describe("Form Visibility"),
    isPasswordProtected: z.boolean().describe("Password Protected form"),
    expiresAt: z.string().describe("Form Expire time"),
  }),
);

// #3 Get one Form with it's field

export const getOneSpecificFormInput = z.object({
  // Get One Specific Form
  formId: z.string().uuid().describe("UUID of the form"),
});

export const getOneSpecificFormOutput = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  slug: z.string(),
  status: z.enum(["draft", "published", "unpublished", "archived"]),
  visibilityMode: z.enum(["public", "unlisted"]),
  isPasswordProtected: z.boolean(),
  expiresAt: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  fields: z.array(
    z.object({
      id: z.string().uuid(),
      label: z.string().max(100),
      labelKey: z.string().max(100),
      type: z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]),
      placeholder: z.string().nullable().optional(),
      isRequired: z.boolean(),
      index: z.string(),
    }),
  ),
});

// #4 Update One Form

export const updateCreatedFormInput = z.object({
  // Update Form
  formId: z.string().uuid().describe("UUID of the form to update"),
  title: z.string().optional().describe("Created form title"),
  description: z.string().describe("Form Description").optional(),
  slug: z.string().optional().describe("Unique URL of form"),
  status: z
    .enum(["draft", "published", "unpublished", "archived"])
    .optional()
    .describe("Form Current Status"),
  visibilityMode: z.enum(["public", "unlisted"]).optional().describe("Form Visibility"),
  isPasswordProtected: z.boolean().optional().describe("Password Protected form"),
  passwordHash: z.string().optional().describe("Form password"),
  expiresAt: z.coerce.date().describe("Form Expire time").nullable().optional(),
});

export const updateCreatedFormOutput = z.object({
  message: z.string().describe("Update confirmation message"),
  formId: z.string().uuid().describe("UUID of the updated form"),
});

// #5 For Delete Form

export const deleteCreatedFormInput = z.object({
  // Delete
  formId: z.string().uuid().describe("UUID of the form to delete"),
});

export const deleteCreatedFormOutput = z.object({
  message: z.string().describe("Deletion confirmation message"),
});

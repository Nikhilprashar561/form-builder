import { z } from "zod";

export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().describe("User fullName"),
  email: z.email().describe("User email address"),
  password: z.string().describe("user password"),
});

export type CreateUserWithEmailAndPasswordInputType = z.infer<
  typeof createUserWithEmailAndPasswordInput
>;

export const userEmailOtpInput = z.object({
  otp: z.string().length(6).describe("Verification email otp"),
});

export type userEmailOtpInputType = z.infer<typeof userEmailOtpInput>;

export const generateUserTokenPalyload = z.object({
  id: z.string().describe("uuid of the user"),
});

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPalyload>;

export const signInUserWithEmailAndPasswordInput = z.object({
  email: z.email().describe("user register email address"),
  password: z.string().describe("user register password"),
});

export type signInUserWithEmailAndPasswordInputType = z.infer<
  typeof signInUserWithEmailAndPasswordInput
>;

export const UpdateUserDetailsInput = z.object({
  fullName: z.string().describe("User fullName"),
  email: z.email().describe("User email address"),
  password: z.string().describe("user password"),
})

export type UpdateUserDetailsInputType = z.infer<typeof UpdateUserDetailsInput>

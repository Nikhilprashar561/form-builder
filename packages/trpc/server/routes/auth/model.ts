import { z } from "zod"

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe('name of the user'),
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user')
})

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe('id of the user created')
})

export const userEmailOtpInput = z.object({
    otp: z.string().describe('Verfication Otp')
})

export const userEmailOtpOutput = z.object({
    message: z.string().describe('Verfication message'),
    userId: z.string().describe('User Id'),
    emailVerified: z.boolean().describe('Verification message'),
})

export const signInUserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user')
})

export const signInUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe('id of the user created')
})

export const getLoggedInUserInfoInputModel = z.undefined();

export const getLoggedInUserInfoOutput = z.object({
    id: z.string().describe('id of the user created'),
    fullName: z.string().describe('name of the user'),
    email: z.email().describe('email of the user'),
    profilImageUrl: z.string().describe('User Profile').optional().nullable()
})

export const signOutOutputModel = z.object({
    message: z.string().describe('Sign out confirmation message')
})

export const updateProfileInputModel = z.object({
    fullName: z.string().min(2).max(80).describe('Updated full name'),
    email: z.email().describe('Updated email address'),
    password: z.string().min(8).optional().describe('New password (optional)')
})

export const updateProfileOutputModel = z.object({
    id: z.string().describe('User ID'),
    fullName: z.string().describe('Updated full name'),
    email: z.string().describe('Updated email'),
    message: z.string().describe('Success message')
})

export const deleteAccountOutputModel = z.object({
    message: z.string().describe('Account deletion confirmation message')
})

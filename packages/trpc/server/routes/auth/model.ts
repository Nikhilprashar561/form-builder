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

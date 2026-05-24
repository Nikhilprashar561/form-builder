import { randomBytes, createHmac, randomInt } from "node:crypto";
import * as jwt from "jsonwebtoken";
import { VerifyOtpEmailTemplateParams, sendMail, verifyOtpEmailTemplate } from "@repo/utils";

import { TRPCError } from "@trpc/server";

import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";
import {
  createUserWithEmailAndPasswordInput,
  CreateUserWithEmailAndPasswordInputType,
  generateUserTokenPalyload,
  GenerateUserTokenPayloadType,
  signInUserWithEmailAndPasswordInput,
  signInUserWithEmailAndPasswordInputType,
  UpdateUserDetailsInput,
  UpdateUserDetailsInputType,
  userEmailOtpInput,
  userEmailOtpInputType,
} from "./model";
import { env } from "../env";

class UserService {
  private async getUserByEmail(email: string) { // Only Verify Email Here No More 
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) { // Generate JWT token
    const { id } = await generateUserTokenPalyload.parseAsync(payload);
    const token = jwt.sign({ id }, env.JWT_SECRET);
    return { token };
  }

  private async generateHash(salt: string, password: string) { // Create a Hash Password
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  private async verifyUserToken(token: string): Promise<GenerateUserTokenPayloadType> { // Verify User Token
    try {
      const verificationToken = jwt.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType;
      return verificationToken;
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid Token",
      });
    }
  }

  private async validateOtp(otp: string) { // Validate User OTP
    const [record] = await db.select().from(usersTable).where(eq(usersTable.otp, otp)).limit(1);

    if (!record) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Invalid OTP",
      });
    }

    if (!record.otpExpiresAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "OTP not available or already verified",
      });
    }

    if (record.otpExpiresAt < new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "OTP has expired",
      });
    }

    return record;
  }

  public async getUserInfoById(id: string) { // Get User By ID
    const user = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        fullName: usersTable.fullName,
        profilImageUrl: usersTable.profileImageUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!user || user.length === 0)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `User with ID ${id} does not exists`,
      });

    return user[0]!;
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) { // Register User
    try {
      const { fullName, email, password } =
        await createUserWithEmailAndPasswordInput.parseAsync(payload);

      const emailExists = await this.getUserByEmail(email);
      if (emailExists)
        throw new TRPCError({
          code: "CONFLICT",
          message: `User with email ${email} already exists`,
        });

      const salt = randomBytes(16).toString("hex");
      const hash = await this.generateHash(salt, password);

      const generateOtp = () => {
        const otp = randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min from now

        return { otp, expiresAt };
      };

      const { otp, expiresAt } = generateOtp();

      const description = `Thanks for registering NexForm! Please verify your email address using the OTP`;

      try {
        await sendMail({
          sendTo: email,
          subject: `Verify your NexForm email`,
          html: verifyOtpEmailTemplate({
            name: fullName,
            organization: `NexForm`,
            otp: otp,
            description: description,
          }),
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send verification email. Please try again later.",
        });
      }

      const userTableResult = await db
        .insert(usersTable)
        .values({ fullName, email, salt, password: hash, otp, otpExpiresAt: expiresAt })
        .returning({
          id: usersTable.id,
        });

      if (!userTableResult || userTableResult.length === 0 || !userTableResult[0]?.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while creating a user",
        });
      }

      const userId = userTableResult[0].id;

      const { token } = await this.generateUserToken({ id: userId });

      return {
        id: userId,
        token,
      };
    } catch (error) {
      // If it's already a TRPCError, re-throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      
      // Handle unexpected errors
      console.error("Unexpected error in createUserWithEmailAndPassword:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  }

  public async verifyUserRegisterEmailViaOtp(payload: userEmailOtpInputType) {
    try {
      const { otp } = await userEmailOtpInput.parseAsync(payload);

      if (otp.length !== 6)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid OTP format. OTP must be 6 digits.",
        });

      const otpCheck = await this.validateOtp(otp);

      if (otpCheck.otp !== otp)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid OTP",
        });

      const otpUpdate = await db
        .update(usersTable)
        .set({
          otp: "",
          otpExpiresAt: null,
          emailVerified: true,
        })
        .where(eq(usersTable.id, otpCheck.id));

      if (!otpUpdate) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify email. Please try again.",
        });
      }

      return {
        message: "Email verified successfully",
        userId: otpCheck.id,
        emailVerified: true,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error("Unexpected error in verifyUserRegisterEmailViaOtp:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred during verification. Please try again.",
      });
    }
  }

  public async signInUserWithEmailAndPassword(payload: signInUserWithEmailAndPasswordInputType) {
    try {
      const { email, password } = await signInUserWithEmailAndPasswordInput.parseAsync(payload);

      const existUser = await this.getUserByEmail(email);
      if (!existUser)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User with email ${email} does not exists`,
        });

      if (!existUser.password || !existUser.salt)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Authentication error. Please try again.",
        });

      const hash = await this.generateHash(existUser.salt, password);

      if (hash !== existUser.password)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials. Please check your email and password.",
        });

      const { token } = await this.generateUserToken({ id: existUser.id });

      return {
        id: existUser.id,
        token,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error("Unexpected error in signInUserWithEmailAndPassword:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred during sign in. Please try again.",
      });
    }
  }

  public async verifyDecodedToken(token: string) {
    const { id } = await this.verifyUserToken(token);
    return {
      id,
    };
  }

  public async updateProfile(
    userId: string,
    payload: UpdateUserDetailsInputType
  ) {
    const { fullName, email, password } = await UpdateUserDetailsInput.parseAsync(payload);

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await this.getUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email is already in use",
        });
      }
    }

    const updateData: Record<string, unknown> = {
      fullName,
      email,
    };

    // If password is provided, hash it
    if (password && password.length > 0) {
      const salt = randomBytes(16).toString("hex");
      const hash = await this.generateHash(salt, password);
      updateData.salt = salt;
      updateData.password = hash;
    }

    const result = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
      });

    if (!result || result.length === 0) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update profile. Please try again.",
      });
    }

    return {
      id: result[0]!.id,
      fullName: result[0]!.fullName,
      email: result[0]!.email,
      message: "Profile updated successfully",
    };
  }

  public async deleteAccount(userId: string) {
    const result = await db.delete(usersTable).where(eq(usersTable.id, userId));

    if (!result) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete account. Please try again.",
      });
    }

    return {
      message: "Account deleted successfully",
    };
  }
}

export { UserService };

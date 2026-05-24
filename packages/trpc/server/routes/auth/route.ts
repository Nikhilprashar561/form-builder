import { userService } from "../../services";
import { authenticationProcedure, publicProcedure, router } from "../../trpc";
import { setAuthenticationCookie, clearAuthenticationCookie } from "../../utils/cookies";
import { generatePath } from "../../utils/path-generator";
import { z } from "zod";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  getLoggedInUserInfoInputModel,
  getLoggedInUserInfoOutput,
  signInUserWithEmailAndPasswordInputModel,
  signInUserWithEmailAndPasswordOutputModel,
  userEmailOtpInput,
  userEmailOtpOutput,
  signOutOutputModel,
  updateProfileInputModel,
  updateProfileOutputModel,
  deleteAccountOutputModel,
} from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, fullName, password } = input;
      const { id, token } = await userService.createUserWithEmailAndPassword({
        email,
        fullName,
        password,
      });

      setAuthenticationCookie(ctx, token);

      return {
        id,
      };
    }),

  verifyEmailOtpUser: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/verifyEmailOtp"),
        tags: TAGS,
      },
    })
    .input(userEmailOtpInput)
    .output(userEmailOtpOutput)
    .mutation(async ({ input, ctx }) => {
      const { otp } = input;

      const { message, emailVerified, userId } = await userService.verifyUserRegisterEmailViaOtp({
        otp,
      });

      return {
        message,
        userId,
        emailVerified,
      };
    }),

  signInUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/signIn"),
        tags: TAGS,
      },
    })
    .input(signInUserWithEmailAndPasswordInputModel)
    .output(signInUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const { id, token } = await userService.signInUserWithEmailAndPassword({ email, password });

      setAuthenticationCookie(ctx, token);

      return {
        id,
      };
    }),

  getLoggedInUserInfo: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getLoggedInUserInfo"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getLoggedInUserInfoInputModel)
    .output(getLoggedInUserInfoOutput)
    .query(async ({ ctx }) => {
      const { id, email, fullName, profilImageUrl } = await userService.getUserInfoById(ctx.user);

      return {
        id,
        email,
        fullName,
        profilImageUrl,
      };
    }),

  signOut: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/signOut"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(z.undefined())
    .output(signOutOutputModel)
    .mutation(async ({ ctx }) => {
      clearAuthenticationCookie(ctx);
      return {
        message: "Signed out successfully",
      };
    }),

  updateProfile: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/updateProfile"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateProfileInputModel)
    .output(updateProfileOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, fullName, id, message } = await userService.updateProfile(ctx.user, {
        fullName: input.fullName,
        email: input.email,
        password: input.password!,
      });

      return {
        email,
        fullName,
        id,
        message
      };
    }),

  deleteAccount: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/deleteAccount"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(z.undefined())
    .output(deleteAccountOutputModel)
    .mutation(async ({ ctx }) => {
      const result = await userService.deleteAccount(ctx.user);
      clearAuthenticationCookie(ctx);
      return result;
    }),
});

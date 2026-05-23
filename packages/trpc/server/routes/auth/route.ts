import { userService } from "../../services";
import { authenticationProcedure, publicProcedure, router } from "../../trpc";
import { setAuthenticationCookie } from "../../utils/cookies";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  getLoggedInUserInfoInputModel,
  getLoggedInUserInfoOutput,
  signInUserWithEmailAndPasswordInputModel,
  signInUserWithEmailAndPasswordOutputModel,
  userEmailOtpInput,
  userEmailOtpOutput,
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
});

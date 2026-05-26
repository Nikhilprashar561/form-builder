import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { getAuthenticationCookie } from "./utils/cookies";
import { userService } from "./services";

export const tRPCContext = initTRPC.meta<OpenApiMeta>().context<typeof createContext>().create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticationProcedure = tRPCContext.procedure.use(async (options) => {
  const { ctx } = options;

  const token = getAuthenticationCookie(ctx);

  if (!token)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Session expired. Please login again.",
    });

  const { id } = await userService.verifyDecodedToken(token);

  return options.next({
    ctx: {
      ...ctx,
      user: {
        id
      }
    },
  });
});

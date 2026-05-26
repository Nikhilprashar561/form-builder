import { z } from "zod";
import { formService } from "../../services";
import { authenticationProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createdFormOutput,
  createNewFormInput,
  deleteCreatedFormInput,
  deleteCreatedFormOutput,
  getCreatedFormOutput,
  getOneSpecificFormInput,
  getOneSpecificFormOutput,
  updateCreatedFormInput,
  updateCreatedFormOutput,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  createNewForm: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/create"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createNewFormInput)
    .output(createdFormOutput)
    .mutation(async ({ input, ctx }) => {
      const {
        title,
        description,
        slug,
        status,
        visibilityMode,
        isPasswordProtected,
        passwordHash,
        expiresAt,
      } = input;

      const { id } = await formService.createNewForm({
        createdBy: ctx.user.id,
        title,
        description,
        slug,
        status,
        visibilityMode,
        passwordHash,
        expiresAt,
        isPasswordProtected,
      });

      return {
        id,
      };
    }),

  getCreatedForms: authenticationProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormList"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(z.undefined())
    .output(getCreatedFormOutput)
    .query(async ({ ctx }) => {
      const forms = await formService.getCreatedForms({ userId: ctx.user.id });

      return forms.map((form) => ({
        id: form.id,
        title: form.title,
        description: form.description || undefined,
        slug: form.slug,
        status: form.status,
        visibilityMode: form.visibilityMode,
        isPasswordProtected: form.isPasswordProtected,
        expiresAt: form.expiresAt?.toISOString() || "",
      }));
    }),

  getOneSpecificForm: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getOneForm"),
        tags: TAGS,
      },
    })
    .input(getOneSpecificFormInput)
    .output(getOneSpecificFormOutput)
    .query(async ({ input }) => {
      const { formId } = input;
      return await formService.getOneSpcificForm({ formId });
    }),

  updateCreatedForm: authenticationProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/updateForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateCreatedFormInput)
    .output(updateCreatedFormOutput)
    .mutation(async ({ input }) => {
      const { id } = await formService.updateCreatedForm(input);

      return {
        message: "Form updated successfully",
        formId: id,
      };
    }),

  deleteCreatedForm: authenticationProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/deleteForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteCreatedFormInput)
    .output(deleteCreatedFormOutput)
    .mutation(async ({ input }) => {
      const { message } = await formService.deleteCreatedForm(input);

      return {
        message,
      };
    }),
});

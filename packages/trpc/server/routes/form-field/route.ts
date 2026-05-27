// packages/trpc/server/routes/form-field/index.ts
import { authenticationProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createNewFormFieldInput,
  createNewFormFieldOutput,
  deleteCreatedFormFieldInput,
  deleteCreatedFormFieldOutput,
  getAllFormFieldsOfOneFormInput,
  getAllFormFieldsOfOneFormOutput,
  getOneSpecificFormFieldInput,
  getOneSpecificFormFieldOutput,
  updateCreatedFormFieldInput,
  updateCreatedFormFieldOutput,
} from "./model";
import { formFields } from "../../services";

const TAGS = ["Form Fields"];
const getPath = generatePath("/form-fields");

export const formFieldRouter = router({

  createNewFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/create"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createNewFormFieldInput)
    .output(createNewFormFieldOutput)
    .mutation(async ({ input }) => {
      return formFields.createNewFormField(input);
    }),

  updateCreatedFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/update"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateCreatedFormFieldInput)
    .output(updateCreatedFormFieldOutput)
    .mutation(async ({ input }) => {
      return formFields.updateCreatedFormField(input);
    }),

  deleteCreatedFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/delete"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteCreatedFormFieldInput)
    .output(deleteCreatedFormFieldOutput)
    .mutation(async ({ input }) => {
      return formFields.deleteCreatedFormField(input);
    }),

  getOneSpecificFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "GET", 
        path: getPath("/get-one"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getOneSpecificFormFieldInput)
    .output(getOneSpecificFormFieldOutput)
    .query(async ({ input }) => { 
      return formFields.getOneSpecificFormField(input);
    }),

  getAllFormFieldsOfOneForm: authenticationProcedure
    .meta({
      openapi: {
        method: "GET", 
        path: getPath("/get-all"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getAllFormFieldsOfOneFormInput)
    .output(getAllFormFieldsOfOneFormOutput)
    .query(async ({ input }) => {
      return formFields.getAllFormFieldsOfOneForm(input);
    }),
});

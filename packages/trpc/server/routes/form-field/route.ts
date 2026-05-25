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

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const formFieldRouter = router({
  createNewFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createNewFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createNewFormFieldInput)
    .output(createNewFormFieldOutput)
    .mutation(),

  updateCreatedFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/updateCreatedFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateCreatedFormFieldInput)
    .output(updateCreatedFormFieldOutput)
    .mutation(),

  deleteCreatedFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/updateCreatedFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteCreatedFormFieldInput)
    .output(deleteCreatedFormFieldOutput)
    .mutation(),

  getOneSpecificFormField: authenticationProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/updateCreatedFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getOneSpecificFormFieldInput)
    .output(getOneSpecificFormFieldOutput)
    .query(),

  getAllFormFieldsOfOneForm: authenticationProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/updateCreatedFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getAllFormFieldsOfOneFormInput)
    .output(getAllFormFieldsOfOneFormOutput)
    .query(),
});

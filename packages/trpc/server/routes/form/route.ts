import { authenticationProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createdFormOutput,
  createNewFormInput,
  deleteCreatedFormInput,
  deleteCreatedFormOutput,
  getCreatedFormInput,
  getCreatedFormOutput,
  getOneSpecificFormInput,
  getOneSpecificFormOutput,
  updateCreatedFormInput,
  updateCreatedFormOutput,
} from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const formRouter = router({
  createNewForm: authenticationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createNewForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createNewFormInput)
    .output(createdFormOutput)
    .mutation(),

  getCreatedForm: authenticationProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getCreatedForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getCreatedFormInput)
    .output(getCreatedFormOutput)
    .query(),

  getOneSpecificForm: authenticationProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getOneSpecificForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getOneSpecificFormInput)
    .output(getOneSpecificFormOutput)
    .query(),

  updateCreatedForm: authenticationProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/updateCreatedForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateCreatedFormInput)
    .output(updateCreatedFormOutput)
    .mutation(),

  deleteCreatedForm: authenticationProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/getLoggedInUserInfo"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteCreatedFormInput)
    .output(deleteCreatedFormOutput)
    .mutation(),
});

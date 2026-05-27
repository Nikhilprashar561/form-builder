import { formSubmission } from "../../services";
import { authenticationProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    submitFormInput,
    submitFormOutput,
    getSubmitFormInput,
    getSubmitFormOutput
} from "./model";

const TAGS = ["Form Submission"];
const getPath = generatePath("/form-submission");

export const finalFormSubmission = router({
  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/formSubmission"),
        tags: TAGS,
      },
    })
    .input(submitFormInput)
    .output(submitFormOutput)
    .mutation(async ({ input }) => {
        return formSubmission.submitForm(input);
    }),

    getFormSubmission: authenticationProcedure.meta({
        openapi: {
        method: "POST",
        path: getPath("/getFormSubmission"),
        tags: TAGS,
        protect: true
      },
    }).input(getSubmitFormInput).output(getSubmitFormOutput).query(async ({ input }) => {
        return formSubmission.getFormSubmissions(input);
    })
});

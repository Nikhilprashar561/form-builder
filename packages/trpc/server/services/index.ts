import { UserService } from "@repo/services/user";
import { FormService } from "@repo/services/form"
import { FormFields } from "@repo/services/form-fields"
import { FormSubmission } from "@repo/services/form-submission"

export const userService = new UserService();
export const formService = new FormService();
export const formFields = new FormFields();
export const formSubmission = new FormSubmission();

import { router } from "./trpc";


import { authRouter } from "./routes/auth/route";
import { formRouter } from "./routes/form/route";
import { formFieldRouter } from "./routes/form-field/route";
import { finalFormSubmission } from "./routes/form-submission/route";

export const serverRouter = router({
  auth: authRouter,
  form: formRouter,
  formField: formFieldRouter,
  formSubmission: finalFormSubmission
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;

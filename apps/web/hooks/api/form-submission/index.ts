import { trpc } from "~/trpc/client";

export const useSubmitForm = () => {
  const {
    mutateAsync: submitFormAsync,
    mutate: submitForm,
    error,
    data,
    isIdle,
    failureCount,
  } = trpc.formSubmission.submitForm.useMutation();

  return {
    submitFormAsync,
    submitForm,
    error,
    data,
    isIdle,
    failureCount,
  };
};

export const useGetFormSubmissions = (formId: string) => {
  return trpc.formSubmission.getFormSubmission.useQuery({ formId });
};

import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    data,
    isIdle,
    failureCount,
  } = trpc.form.createNewForm.useMutation({
    onSuccess: async () => {
      await utils.form.getCreatedForms.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    error,
    data,
    isIdle,
    failureCount,
  };
};

export const useGetCreatedForms = () => {
  return trpc.form.getCreatedForms.useQuery(undefined);
};

export const useUpdateForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateFormAsync,
    mutate: updateForm,
    error,
    data,
    isIdle,
    failureCount,
  } = trpc.form.updateCreatedForm.useMutation({
    onSuccess: async () => {
      await utils.form.getCreatedForms.invalidate();
    },
  });

  return {
    updateFormAsync,
    updateForm,
    error,
    data,
    isIdle,
    failureCount,
  };
};

export const useDeleteForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteFormAsync,
    mutate: deleteForm,
    error,
    data,
    isIdle,
    failureCount,
  } = trpc.form.deleteCreatedForm.useMutation({
    onSuccess: async () => {
      await utils.form.getCreatedForms.invalidate();
    },
  });

  return {
    deleteFormAsync,
    deleteForm,
    error,
    data,
    isIdle,
    failureCount,
  };
};

export const useGetFormWithFields = () => {
  return trpc.form.getOneSpecificFormWithAllFields.useQuery;
};

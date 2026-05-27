import { trpc } from "~/trpc/client";

export const useCreateNewField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFieldAsync,
    mutate: createField,
    error,
    data,
    isIdle,
    failureCount,
  } = trpc.formField.createNewFormField.useMutation({
    onSuccess: async () => {
      await utils.formField.getAllFormFieldsOfOneForm.invalidate();
    },
  });

  return {
    createFieldAsync,
    createField,
    error,
    data,
    isIdle,
    failureCount,
  };
};

export const useUpdateField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateFieldAsync,
    mutate: updateField,
    error,
    data,
    isIdle,
    failureCount,
  } = trpc.formField.updateCreatedFormField.useMutation({
    onSuccess: async () => {
      await utils.formField.getAllFormFieldsOfOneForm.invalidate();
    },
  });

  return {
    updateFieldAsync,
    updateField,
    error,
    data,
    isIdle,
    failureCount,
  };
};

export const useDeleteField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteFieldAsync,
    mutate: deleteField,
    error,
    data,
    isIdle,
    failureCount,
  } = trpc.formField.deleteCreatedFormField.useMutation({
    onSuccess: async () => {
      await utils.formField.getAllFormFieldsOfOneForm.invalidate();
    },
  });

  return {
    deleteFieldAsync,
    deleteField,
    error,
    data,
    isIdle,
    failureCount,
  };
};

export const useGetFormField = (fieldId: string) => {
  return trpc.formField.getOneSpecificFormField.useQuery({ fieldId });
};

export const useGetAllFormFields = (formId: string) => {
  return trpc.formField.getAllFormFieldsOfOneForm.useQuery({ formId });
};

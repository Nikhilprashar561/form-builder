import { trpc } from "~/trpc/client";

export const useSignUp = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createUserWithEmailAndPasswordAsync,
    mutate: createUserWithEmailAndPassword,
    data,
    error,
    isIdle,
    status,
    failureCount,
  } = trpc.auth.createUserWithEmailAndPassword.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.invalidate();
    },
  });

  return {
    createUserWithEmailAndPasswordAsync,
    createUserWithEmailAndPassword,
    data,
    error,
    isIdle,
    status,
    failureCount,
  };
};

export const useEmailOtp = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: verifyEmailOtpAsync,
    mutate: verifyEmailOtp,
    error,
    data,
    isIdle,
    failureCount,
  } = trpc.auth.verifyEmailOtpUser.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.invalidate();
    },
  });

  return {
    verifyEmailOtpAsync,
    verifyEmailOtp,
    error,
    data,
    isIdle,
    failureCount,
  };
};

export const useSignIn = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: signInUserWithEmailAndPasswordAsync,
    mutate: signInUserWithEmailAndPassword,
    error,
    data,
    isIdle,
    failureCount,
  } = trpc.auth.signInUserWithEmailAndPassword.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.invalidate();
    },
  });

  return {
    signInUserWithEmailAndPasswordAsync,
    signInUserWithEmailAndPassword,
    error,
    data,
    isIdle,
    failureCount,
  };
};

export const useUser = () => {
  const {
    data: user,
    error,
    isFetched,
    isLoading,
    status,
  } = trpc.auth.getLoggedInUserInfo.useQuery(undefined, {
    staleTime: 0,
    retry: false,
  });

  return {
    user,
    error,
    isFetched,
    isLoading,
    status,
  };
};

export const useSignOut = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: signOutAsync,
    mutate: signOut,
    error,
  } = trpc.auth.signOut.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.invalidate();
    },
  });

  return {
    signOutAsync,
    signOut,
    error,
  };
};

export const useUpdateProfile = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateProfileAsync,
    mutate: updateProfile,
    error,
  } = trpc.auth.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.invalidate();
    },
  });

  return {
    updateProfileAsync,
    updateProfile,
    error,
  };
};

export const useDeleteAccount = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteAccountAsync,
    mutate: deleteAccount,
    error,
  } = trpc.auth.deleteAccount.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  return {
    deleteAccountAsync,
    deleteAccount,
    error,
  };
};

import { trpc } from "~/trpc/client";

/**
 * Hook for user registration with email and password
 * Automatically invalidates user info cache on successful signup
 */
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
      await utils.auth.verifyEmailOtpUser;
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

/**
 * Hook for user sign-in with email and password
 * Authenticates user and stores session
 */
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
  } = trpc.auth.getLoggedInUserInfo.useQuery();

  return {
    user,
    error,
    isFetched,
    isLoading,
    status,
  };
};

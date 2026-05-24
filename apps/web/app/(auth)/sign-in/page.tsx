"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSignIn } from "~/hooks/api/auth";

interface SignInInput {
  email: string;
  password: string;
}

const SignInPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    signInUserWithEmailAndPasswordAsync,
    error,
  } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const extractErrorMessage = (err: unknown): string => {
    const typedErr = err as Record<string, unknown>;
    const shapeMsg = (typedErr?.shape as Record<string, unknown>)?.message;
    const dataMsg = (typedErr?.data as Record<string, unknown>)?.message;
    const msg = typedErr?.message;
    
    return (
      (typeof shapeMsg === "string" && shapeMsg) ||
      (typeof dataMsg === "string" && dataMsg) ||
      (typeof msg === "string" && msg) ||
      "Failed to sign in. Please try again."
    );
  };

  const onSubmit = async (formData: SignInInput) => {
    try {
      setIsSubmitting(true);

      const result = await signInUserWithEmailAndPasswordAsync({
        email: formData.email,
        password: formData.password,
      });

      if (result) {
        toast.success("Sign in successful!", { duration: 2000 });

        setTimeout(() => {
          router.push("/");
        }, 500);
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage, { duration: 4000 });
      console.error("Sign in error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting;

  return (
    <div className="noise flex min-h-screen items-center justify-center px-6 pb-12 pt-16">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center animate-fade-up">
          <h1 className="font-display mb-2 text-3xl font-bold text-black">Login account</h1>
          <p className="text-sm text-gray-500">Sign in to NexForm and continue building</p>
        </div>

        {/* Card */}
        <div className="animate-fade-up anim-delay-1 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <label className="block mb-1.5 text-sm font-medium text-black">
              Email
              <input
                className={`input-field w-full mt-1.5 rounded-xl border px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                type="email"
                placeholder="you@example.com"
                disabled={isBusy}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <span className="block mt-2 text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </label>

            {/* Password Field */}
            <label className="block mb-6 text-sm font-medium text-black mt-4">
              Password
              <input
                className={`input-field w-full mt-1.5 rounded-xl border px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  errors.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                type="password"
                placeholder="Enter your password"
                disabled={isBusy}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && (
                <span className="block mt-2 text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </label>

            {/* Server Error */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">
                  {extractErrorMessage(error)}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isBusy}
              className={`btn-primary cursor-pointer animate-fade-up anim-delay-2 w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 ${
                !isValid || isBusy
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              {isBusy ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <p className="animate-fade-up anim-delay-2 mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <span
            onClick={() => !isBusy && router.push("/sign-up")}
            className="underline-hover cursor-pointer font-semibold text-black hover:text-gray-700 transition-colors"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;

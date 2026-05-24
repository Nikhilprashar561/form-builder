"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSignUp } from "~/hooks/api/auth";

interface CreateUserWithEmailAndPasswordInput {
  fullName: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    createUserWithEmailAndPasswordAsync,
    error,
  } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateUserWithEmailAndPasswordInput>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // ✅ Robust tRPC error message extractor
  const extractErrorMessage = (err: unknown): string => {
    if (!err) return "Failed to create account. Please try again.";

    const typedErr = err as Record<string, unknown>;

    // Check if response is HTML (doctype check)
    if (typeof typedErr === "string" && typedErr.includes("<!DOCTYPE")) {
      return "Server error occurred. Please try again later.";
    }

    // tRPC error shape: err.data.code and err.data.message
    if (typedErr?.data && typeof typedErr.data === "object") {
      const dataObj = typedErr.data as Record<string, unknown>;
      if (typeof dataObj.message === "string") return dataObj.message;
    }

    // Fallback to standard error properties
    if (typeof typedErr?.message === "string") return typedErr.message;
    if (typeof typedErr?.error === "string") return typedErr.error;

    // Default message
    return "Failed to create account. Please try again.";
  };

  const onSubmit = async (formData: CreateUserWithEmailAndPasswordInput) => {
    try {
      setIsSubmitting(true);

      const { id } = await createUserWithEmailAndPasswordAsync({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (id) {
        toast.success(
          "Account created successfully! Check your email for verification.",
          { duration: 4000 }
        );

        // Redirect to OTP verification page
        setTimeout(() => {
          router.push(`/verify-email`);
        }, 1500);
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage, { duration: 4000 });
      console.error("Sign up error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combined loading state for disabling inputs/buttons
  const isBusy = isSubmitting;

  return (
    <div className="noise flex min-h-screen items-center justify-center px-6 pb-12 pt-16">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center animate-fade-up">
          <h1 className="font-display mb-2 text-3xl font-bold text-black">
            Create account
          </h1>
          <p className="text-sm text-gray-500">
            Join NexForm and start collecting feedback
          </p>
        </div>

        {/* Card */}
        <div className="animate-fade-up anim-delay-1 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name Field */}
            <label className="block mb-1.5 text-sm font-medium text-black">
              Full name
              <input
                className={`input-field w-full mt-1.5 rounded-xl border px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  errors.fullName
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                type="text"
                placeholder="Nikhil Prashar"
                disabled={isBusy} // ✅ Uses combined isBusy
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Full name must not exceed 50 characters",
                  },
                })}
              />
              {errors.fullName && (
                <span className="block mt-2 text-red-500 text-xs">
                  {errors.fullName.message}
                </span>
              )}
            </label>

            {/* Email Field */}
            <label className="block mb-1.5 text-sm font-medium text-black mt-4">
              Email
              <input
                className={`input-field w-full mt-1.5 rounded-xl border px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                type="email"
                placeholder="you@example.com"
                disabled={isBusy} // ✅ Uses combined isBusy
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
                placeholder="Min. 8 characters"
                disabled={isBusy}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      "Password must contain uppercase, lowercase, and number",
                  },
                })}
              />
              {errors.password && (
                <span className="block mt-2 text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </label>

            {/* Server Error — shown inline below fields */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">
                  {/* ✅ Proper tRPC error shape traversal */}
                  {error?.shape?.message ||
                    error?.data?.code ||
                    error?.message ||
                    "An error occurred. Please try again."}
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
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <p className="animate-fade-up anim-delay-2 mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => !isBusy && router.push("/sign-in")}
            className="underline-hover cursor-pointer font-semibold text-black hover:text-gray-700 transition-colors"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

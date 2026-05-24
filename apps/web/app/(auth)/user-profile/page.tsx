"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser, useSignOut, useUpdateProfile, useDeleteAccount } from "~/hooks/api/auth";

interface UpdateProfileInput {
  fullName: string;
  email: string;
  password: string;
}

const UserProfilePage = () => {
  const router = useRouter();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const { user, isLoading: userLoading } = useUser();
  const { signOutAsync } = useSignOut();
  const { updateProfileAsync, error: updateError } = useUpdateProfile();
  const { deleteAccountAsync, error: deleteError } = useDeleteAccount();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateProfileInput>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        password: "",
      });
      setIsLoadingPage(false);
    }
  }, [user, reset]);

  // Generate user initials from name
  const initials = useMemo(() => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  }, [user?.fullName]);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, userLoading, router]);

  const extractErrorMessage = (err: unknown): string => {
    const typedErr = err as Record<string, unknown>;
    const shapeMsg = (typedErr?.shape as Record<string, unknown>)?.message;
    const dataMsg = (typedErr?.data as Record<string, unknown>)?.message;
    const msg = typedErr?.message;
    
    return (
      (typeof shapeMsg === "string" && shapeMsg) ||
      (typeof dataMsg === "string" && dataMsg) ||
      (typeof msg === "string" && msg) ||
      "An error occurred. Please try again."
    );
  };

  const handleLogout = async () => {
    try {
      await signOutAsync();
      toast.success("Signed out successfully", { duration: 2000 });

      setTimeout(() => {
        router.push("/sign-in");
      }, 500);
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage, { duration: 4000 });
      console.error("Logout error:", err);
    }
  };

  const onSubmit = async (formData: UpdateProfileInput) => {
    try {
      // Only send password if it's been changed
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
      };

      await updateProfileAsync(payload);

      toast.success("Profile updated successfully", { duration: 2000 });

      // Reset password field after success
      reset({
        fullName: formData.fullName,
        email: formData.email,
        password: "",
      });
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage, { duration: 4000 });
      console.error("Update profile error:", err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteAccountAsync();
      toast.success("Account deleted successfully", { duration: 2000 });

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage, { duration: 4000 });
      console.error("Delete account error:", err);
    }
  };

  if (isLoadingPage || userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16 bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen pt-16 bg-white">
      <main className="flex-1 max-w-2xl px-6 py-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1
            className="font-display text-2xl font-bold text-black"
            style={{ fontWeight: 700 }}
          >
            My Profile
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage your account details and preferences
          </p>
        </div>

        {/* Avatar section */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-up anim-delay-1">
          <div className="flex items-center gap-5">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black font-display text-2xl font-bold text-white"
              style={{ fontWeight: 700 }}
            >
              {initials}
            </div>
            <div>
              <p className="text-black" style={{ fontWeight: 600 }}>
                {user?.fullName || "—"}
              </p>
              <p className="mb-3 text-sm text-gray-400">{user?.email || "—"}</p>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-black transition-colors hover:border-black"
                style={{ fontWeight: 500 }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-up anim-delay-2">
          <h2
            className="font-display mb-5 text-base text-black"
            style={{ fontWeight: 600 }}
          >
            Personal Information
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block mb-1.5 text-sm font-medium text-black">
              Full name
              <input
                className={`input-field w-full mt-1.5 rounded-xl border px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  errors.fullName
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                type="text"
                placeholder="Your full name"
                disabled={isSubmitting}
                {...register("fullName", {
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 45,
                    message: "Full name must be under 45 characters",
                  },
                })}
              />
              {errors.fullName && (
                <span className="block mt-2 text-red-500 text-xs">
                  {errors.fullName.message}
                </span>
              )}
            </label>

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
                disabled={isSubmitting}
                {...register("email", {
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

            <label className="block mb-4 text-sm font-medium text-black mt-4">
              New Password
              <input
                className={`input-field w-full mt-1.5 rounded-xl border px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  errors.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                type="password"
                placeholder="Leave blank to keep current"
                disabled={isSubmitting}
                {...register("password", {
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

            {/* Server Error */}
            {updateError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">
                  {extractErrorMessage(updateError)}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary cursor-pointer rounded-xl bg-black px-6 py-2.5 text-sm text-white disabled:opacity-60 transition-opacity"
                style={{ fontWeight: 600 }}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm animate-fade-up">
          <h2
            className="font-display mb-2 text-base text-red-500"
            style={{ fontWeight: 600 }}
          >
            Danger Zone
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            These actions are permanent and cannot be undone.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl border cursor-pointer border-gray-200 px-5 py-2.5 text-sm text-gray-600 transition-colors hover:border-gray-400">
              Export Data
            </button>
            <button
              onClick={handleDeleteAccount}
              className="rounded-xl cursor-pointer border border-red-200 px-5 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
            >
              Delete Account
            </button>
          </div>
          {deleteError && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">
                {extractErrorMessage(deleteError)}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;

"use client"

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"

 const signInPage = () => {

    const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit = (data) => {
    console.log("Register data:", data);
    // Handle registration submission here
  };

  return (
    <div className="noise flex min-h-screen items-center justify-center px-6 pb-12 pt-16">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center animate-fade-up">
          <h1 className="font-display mb-2 text-3xl font-bold text-black">Login account</h1>

          <p className="text-sm text-gray-500">Join NexForm and start collecting feedback</p>
        </div>

        {/* Card */}
        <div className="animate-fade-up anim-delay-1 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>

            <label className="block mb-1.5 text-sm font-medium text-black">
              Email
              <input
                className="input-field w-full mt-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
              <span className="text-xs leading-relaxed text-gray-500">
                {errors.email && (
                  <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </span>
                )}
              </span>
            </label>

            <label className="block mb-4 text-sm font-medium text-black">
              Password
              <input
                className="input-field w-full mt-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
                type="password"
                placeholder="Min. 8 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <span className="text-xs leading-relaxed text-gray-500">
                {errors.password && (
                  <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </span>
                )}
              </span>
            </label>

            <button
              type="submit"
              className="btn-primary cursor-pointer animate-fade-up anim-delay-2 w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white"
            >
              Create Account
            </button>
          </form>
        </div>
        <p className="animate-fade-up anim-delay-2 mt-6 text-center text-sm text-gray-400">
          Don't have an account? {" "}
          <span
            onClick={() => router.replace("/sign-up")}
            className="underline-hover cursor-pointer font-semibold text-black"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default signInPage

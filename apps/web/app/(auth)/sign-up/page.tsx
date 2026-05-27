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

// ── Scribble SVG decorations ──────────────────────────────────────────────────

const ScribbleUnderline = () => (
  <svg viewBox="0 0 200 12" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 8 C30 3, 60 11, 100 6 C140 1, 170 9, 198 5"
      stroke="black"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const CornerScribble = () => (
  <svg
    viewBox="0 0 80 80"
    className="absolute -top-4 -right-4 w-16 h-16 opacity-20 pointer-events-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 70 Q40 10 70 10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" />
    <path d="M20 75 Q50 30 75 20" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" />
    <circle cx="70" cy="10" r="3" fill="black" />
    <circle cx="75" cy="20" r="2" fill="black" />
  </svg>
);

const StickyNote = ({ text, rotate }: { text: string; rotate: string }) => (
  <div
    className={`absolute ${rotate} bg-white border-2 border-black px-3 py-2 shadow-[3px_3px_0px_black] pointer-events-none`}
    style={{ fontFamily: "'Caveat', cursive", fontSize: "13px" }}
  >
    {text}
  </div>
);

const StarDoodle = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={`inline-block ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const ArrowDoodle = () => (
  <svg viewBox="0 0 60 30" className="w-14 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 15 C15 8, 35 8, 50 15" stroke="black" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M44 9 L50 15 L44 21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const CheckmarkBubble = () => (
  <div className="absolute -bottom-10 -left-8 bg-white border-2 border-black rounded-2xl px-3 py-1.5 shadow-[2px_2px_0px_black] flex items-center gap-1.5 pointer-events-none">
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <circle cx="8" cy="8" r="7" stroke="black" strokeWidth="1.5" />
      <path d="M4.5 8.5 L7 11 L11.5 5.5" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span style={{ fontFamily: "'Caveat', cursive", fontSize: "13px" }}>You're in!</span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const SignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const { createUserWithEmailAndPasswordAsync, error } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateUserWithEmailAndPasswordInput>({
    defaultValues: { fullName: "", email: "", password: "" },
    mode: "onChange",
  });

  const extractErrorMessage = (err: unknown): string => {
    if (!err) return "Failed to create account. Please try again.";
    const typedErr = err as Record<string, unknown>;
    if (typedErr?.data && typeof typedErr.data === "object") {
      const dataObj = typedErr.data as Record<string, unknown>;
      if (typeof dataObj.message === "string") return dataObj.message;
    }
    if (typeof typedErr?.message === "string") return typedErr.message;
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
        setShowCheck(true);
        toast.success("Account created! Check your email for verification.", { duration: 4000 });
        setTimeout(() => router.push("/verify-email"), 1500);
      }
    } catch (err) {
      toast.error(extractErrorMessage(err), { duration: 4000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting;

  return (
    <>
      {/* Google Font: Caveat (handwritten) + Instrument Serif */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .scribble-input {
          font-family: 'Caveat', cursive;
          font-size: 16px;
          border: 2px solid black;
          border-radius: 0;
          background: white;
          outline: none;
          box-shadow: none;
          transition: box-shadow 0.15s ease;
        }
        .scribble-input:focus {
          box-shadow: 3px 3px 0px black;
          outline: none;
        }
        .scribble-input::placeholder {
          color: #aaa;
          font-family: 'Caveat', cursive;
        }
        .scribble-input.error-field {
          border-color: black;
          background: #f5f5f5;
          text-decoration: underline wavy black;
        }
        .scribble-btn {
          font-family: 'Caveat', cursive;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border: 2.5px solid black;
          background: black;
          color: white;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
          box-shadow: 4px 4px 0px #555;
          cursor: pointer;
        }
        .scribble-btn:hover:not(:disabled) {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px #333;
        }
        .scribble-btn:active:not(:disabled) {
          transform: translate(1px, 1px);
          box-shadow: 2px 2px 0px #555;
        }
        .scribble-btn:disabled {
          background: #d0d0d0;
          border-color: #aaa;
          color: #888;
          box-shadow: 2px 2px 0px #ccc;
          cursor: not-allowed;
        }
        .card-border {
          border: 2.5px solid black;
          box-shadow: 6px 6px 0px black;
        }
        .rough-label {
          font-family: 'Caveat', cursive;
          font-size: 15px;
          font-weight: 600;
        }
        .error-msg {
          font-family: 'Caveat', cursive;
          font-size: 13px;
          color: black;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .error-msg::before {
          content: "✗ ";
        }
        .noise-bg {
          background-color: #f9f8f5;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }
        .spin-scribble {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .fade-up {
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
        }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.22s; }
        .fade-up-3 { animation-delay: 0.34s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .grid-bg {
          background-image: 
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      <div className="noise-bg mt-6 grid-bg min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden">

        {/* Background doodle elements */}
        <div className="absolute top-10 left-8 opacity-15 rotate-[-12deg] pointer-events-none" style={{ fontFamily: "'Caveat', cursive", fontSize: "22px" }}>
          NexForm ✦
        </div>
        <div className="absolute bottom-16 right-10 opacity-10 rotate-[8deg] pointer-events-none" style={{ fontFamily: "'Caveat', cursive", fontSize: "18px" }}>
          start collecting →
        </div>
        <div className="absolute top-1/3 right-6 opacity-10 rotate-[90deg] pointer-events-none" style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}>
          · · · · · · ·
        </div>

        {/* Floating sticky note top-left */}
        <div className="absolute top-16 left-1/4 hidden lg:block -rotate-3">
          <div className="bg-white border-2 border-black px-4 py-2 shadow-[3px_3px_0_black]" style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}>
            🔐 secure & private
          </div>
        </div>

        {/* Main wrapper */}
        <div className="w-full max-w-md relative">

          {/* Header */}
          <div className="mb-8 fade-up">
            <div className="flex items-center gap-2 mb-1">
              <StarDoodle className="w-6 h-6" />
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase" }}>
                NexForm
              </span>
            </div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "42px", lineHeight: 1.1, fontWeight: 400 }} className="text-black">
              Create your<br /><em>account</em>
            </h1>
            <ScribbleUnderline />
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px" }} className="text-gray-500 mt-2">
              join & start collecting feedback ✦
            </p>
          </div>

          {/* Card */}
          <div className="card-border bg-white p-7 relative fade-up fade-up-1">
            <CornerScribble />

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* Full Name */}
              <div className="mb-5">
                <label className="rough-label block mb-1.5 text-black">
                  Full name
                </label>
                <input
                  className={`scribble-input w-full px-4 py-3 ${errors.fullName ? "error-field" : ""}`}
                  type="text"
                  placeholder="Nikhil Prashar"
                  disabled={isBusy}
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: { value: 2, message: "At least 2 characters" },
                    maxLength: { value: 50, message: "Max 50 characters" },
                  })}
                />
                {errors.fullName && (
                  <p className="error-msg mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="rough-label block mb-1.5 text-black">
                  Email
                </label>
                <input
                  className={`scribble-input w-full px-4 py-3 ${errors.email ? "error-field" : ""}`}
                  type="email"
                  placeholder="you@example.com"
                  disabled={isBusy}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="error-msg mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-7">
                <label className="rough-label block mb-1.5 text-black">
                  Password
                </label>
                <input
                  className={`scribble-input w-full px-4 py-3 ${errors.password ? "error-field" : ""}`}
                  type="password"
                  placeholder="Min. 8 chars"
                  disabled={isBusy}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "At least 8 characters" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: "Needs uppercase, lowercase & number",
                    },
                  })}
                />
                {errors.password && (
                  <p className="error-msg mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Server error */}
              {error && (
                <div className="mb-5 p-3 border-2 border-black bg-gray-100" style={{ fontFamily: "'Caveat', cursive" }}>
                  ✗ {error?.shape?.message || error?.data?.code || error?.message || "An error occurred."}
                </div>
              )}

              {/* Submit */}
              <div className="relative">
                <button
                  type="submit"
                  disabled={!isValid || isBusy}
                  className="scribble-btn w-full py-3.5 rounded-none"
                >
                  {isBusy ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="spin-scribble w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account →"
                  )}
                </button>
                {showCheck && <CheckmarkBubble />}
              </div>
            </form>
          </div>

          {/* Sign in link */}
          <div className="mt-8 text-center fade-up fade-up-2 flex items-center justify-center gap-2">
            <ArrowDoodle />
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px" }} className="text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => !isBusy && router.push("/sign-in")}
                className="text-black font-bold cursor-pointer"
                style={{ textDecoration: "underline wavy black", textUnderlineOffset: "3px" }}
              >
                Sign in
              </span>
            </p>
          </div>

          {/* Bottom doodle label */}
          <div className="mt-6 flex justify-center fade-up fade-up-3">
            <div className="flex items-center gap-1 opacity-30" style={{ fontFamily: "'Caveat', cursive", fontSize: "12px" }}>
              <StarDoodle className="w-3 h-3" />
              <span>made with NexForm</span>
              <StarDoodle className="w-3 h-3" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SignUpPage;
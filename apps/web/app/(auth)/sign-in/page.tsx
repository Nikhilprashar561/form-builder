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

const StarDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z"
      stroke="black" strokeWidth="1.5" strokeLinejoin="round" fill="none"
    />
  </svg>
);

const ArrowDoodle = () => (
  <svg viewBox="0 0 60 30" className="w-14 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 15 C15 8, 35 8, 50 15" stroke="black" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M44 9 L50 15 L44 21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const WelcomeBackBubble = () => (
  <div className="absolute -bottom-10 -left-8 bg-white border-2 border-black rounded-2xl px-3 py-1.5 shadow-[2px_2px_0px_black] flex items-center gap-1.5 pointer-events-none">
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <circle cx="8" cy="8" r="7" stroke="black" strokeWidth="1.5" />
      <path d="M5 8.5 C6 10.5 10 10.5 11 8.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="6" cy="6.5" r="1" fill="black" />
      <circle cx="10" cy="6.5" r="1" fill="black" />
    </svg>
    <span style={{ fontFamily: "'Caveat', cursive", fontSize: "13px" }}>Welcome back!</span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const SignInPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const { signInUserWithEmailAndPasswordAsync, error } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInInput>({
    defaultValues: { email: "", password: "" },
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
        setShowWelcome(true);
        toast.success("Sign in successful!", { duration: 2000 });
        setTimeout(() => router.push("/"), 500);
      }
    } catch (err) {
      toast.error(extractErrorMessage(err), { duration: 4000 });
      console.error("Sign in error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting;

  return (
    <>
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
        .error-msg::before { content: "✗ "; }
        .noise-bg {
          background-color: #f9f8f5;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .spin-scribble { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; opacity: 0; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.22s; }
        .fade-up-3 { animation-delay: 0.34s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="noise-bg mt-6 grid-bg min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden">

        {/* Background doodle text */}
        <div className="absolute top-10 left-8 opacity-15 rotate-[-12deg] pointer-events-none" style={{ fontFamily: "'Caveat', cursive", fontSize: "22px" }}>
          NexForm ✦
        </div>
        <div className="absolute bottom-16 right-10 opacity-10 rotate-[8deg] pointer-events-none" style={{ fontFamily: "'Caveat', cursive", fontSize: "18px" }}>
          continue building →
        </div>
        <div className="absolute top-1/3 right-6 opacity-10 rotate-[90deg] pointer-events-none" style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}>
          · · · · · · ·
        </div>

        {/* Floating sticky note */}
        <div className="absolute top-16 left-1/4 hidden lg:block -rotate-3">
          <div className="bg-white border-2 border-black px-4 py-2 shadow-[3px_3px_0_black]" style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}>
            👋 good to see you
          </div>
        </div>

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
              Welcome<br /><em>back</em>
            </h1>
            <ScribbleUnderline />
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px" }} className="text-gray-500 mt-2">
              sign in & continue building ✦
            </p>
          </div>

          {/* Card */}
          <div className="card-border bg-white p-7 relative fade-up fade-up-1">
            <CornerScribble />

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* Email */}
              <div className="mb-5">
                <label className="rough-label block mb-1.5 text-black">Email</label>
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
                {errors.email && <p className="error-msg mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="mb-7">
                <label className="rough-label block mb-1.5 text-black">Password</label>
                <input
                  className={`scribble-input w-full px-4 py-3 ${errors.password ? "error-field" : ""}`}
                  type="password"
                  placeholder="Enter your password"
                  disabled={isBusy}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "At least 8 characters" },
                  })}
                />
                {errors.password && <p className="error-msg mt-1">{errors.password.message}</p>}
              </div>

              {/* Server error */}
              {error && (
                <div className="mb-5 p-3 border-2 border-black bg-gray-100" style={{ fontFamily: "'Caveat', cursive" }}>
                  ✗ {extractErrorMessage(error)}
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
                      Signing in...
                    </span>
                  ) : (
                    "Sign In →"
                  )}
                </button>
                {showWelcome && <WelcomeBackBubble />}
              </div>
            </form>
          </div>

          {/* Sign up link */}
          <div className="mt-8 text-center fade-up fade-up-2 flex items-center justify-center gap-2">
            <ArrowDoodle />
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px" }} className="text-gray-500">
              Don't have an account?{" "}
              <span
                onClick={() => !isBusy && router.push("/sign-up")}
                className="text-black font-bold cursor-pointer"
                style={{ textDecoration: "underline wavy black", textUnderlineOffset: "3px" }}
              >
                Sign up
              </span>
            </p>
          </div>

          {/* Bottom label */}
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

export default SignInPage;

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEmailOtp } from "~/hooks/api/auth";

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { verifyEmailOtpAsync, error } = useEmailOtp();

  // Timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const otpString = otp.join("");
  const isOtpComplete = otpString.length === 6;

  const extractErrorMessage = (err: unknown): string => {
    const typedErr = err as Record<string, unknown>;
    const shapeMsg = (typedErr?.shape as Record<string, unknown>)?.message;
    const dataMsg = (typedErr?.data as Record<string, unknown>)?.message;
    const msg = typedErr?.message;
    
    return (
      (typeof shapeMsg === "string" && shapeMsg) ||
      (typeof dataMsg === "string" && dataMsg) ||
      (typeof msg === "string" && msg) ||
      "Failed to verify OTP. Please try again."
    );
  };

  const onSubmit = async () => {
    if (!isOtpComplete) {
      toast.error("Please enter all 6 digits", { duration: 3000 });
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await verifyEmailOtpAsync({
        otp: otpString,
      });

      if (result) {
        toast.success("Email verified successfully!", { duration: 2000 });

        setTimeout(() => {
          router.push("/sign-in");
        }, 500);
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage, { duration: 4000 });
      console.error("OTP verification error:", err);
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    toast.info(
      "Resend functionality coming soon. Please check your email.",
      { duration: 3000 }
    );
    setResendTimer(60);
  };

  return (
    <div className="noise flex min-h-screen items-center justify-center px-6 pb-12 pt-16">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center animate-fade-up">
          <h1 className="font-display mb-2 text-3xl font-bold text-black">
            Verify your email
          </h1>
          <p className="text-sm text-gray-500">
            We've sent a 6-digit code to{" "}
            <span className="font-semibold text-black">{email || "your email"}</span>
          </p>
        </div>

        {/* Card */}
        <div className="animate-fade-up anim-delay-1 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <label className="block mb-4 text-sm font-medium text-black text-center">
              Enter verification code
            </label>

            {/* OTP Input Grid */}
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isSubmitting}
                  className={`h-12 w-12 rounded-lg border-2 text-center text-lg font-semibold transition-all ${
                    value
                      ? "border-black bg-white text-black"
                      : "border-gray-200 bg-gray-50 text-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1`}
                  placeholder="-"
                />
              ))}
            </div>

            {/* Server Error */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">
                  {extractErrorMessage(error)}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={!isOtpComplete || isSubmitting}
            className={`btn-primary cursor-pointer w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 ${
              !isOtpComplete || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </button>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{" "}
              {resendTimer > 0 ? (
                <span className="font-semibold text-gray-400">
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isSubmitting}
                  className="font-semibold text-black hover:text-gray-700 transition-colors disabled:text-gray-400"
                >
                  Resend code
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Back to Sign In */}
        <p className="animate-fade-up anim-delay-2 mt-6 text-center text-sm text-gray-400">
          Remember your password?{" "}
          <span
            onClick={() => !isSubmitting && router.push("/sign-in")}
            className="underline-hover cursor-pointer font-semibold text-black hover:text-gray-700 transition-colors"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

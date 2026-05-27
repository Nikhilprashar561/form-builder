"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEmailOtp } from "~/hooks/api/auth";

// ── Scribble SVG decorations ──────────────────────────────────────────────────

const ScribbleUnderline = () => (
  <svg viewBox="0 0 200 12" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8 C30 3, 60 11, 100 6 C140 1, 170 9, 198 5" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const CornerScribble = () => (
  <svg viewBox="0 0 80 80" className="absolute -top-4 -right-4 w-16 h-16 opacity-20 pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 70 Q40 10 70 10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" />
    <path d="M20 75 Q50 30 75 20" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" />
    <circle cx="70" cy="10" r="3" fill="black" />
    <circle cx="75" cy="20" r="2" fill="black" />
  </svg>
);

const StarDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);

const ArrowDoodle = () => (
  <svg viewBox="0 0 60 30" className="w-14 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 15 C15 8, 35 8, 50 15" stroke="black" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M44 9 L50 15 L44 21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const MailDoodle = () => (
  <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="40" height="28" rx="1" stroke="black" strokeWidth="2.5" fill="white" />
    <path d="M4 12 L24 26 L44 12" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* scribble lines on envelope */}
    <path d="M4 36 L18 24" stroke="black" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    <path d="M44 36 L30 24" stroke="black" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
  </svg>
);

const VerifiedBubble = () => (
  <div className="absolute -bottom-10 -left-8 bg-white border-2 border-black rounded-2xl px-3 py-1.5 shadow-[2px_2px_0px_black] flex items-center gap-1.5 pointer-events-none">
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <circle cx="8" cy="8" r="7" stroke="black" strokeWidth="1.5" />
      <path d="M4.5 8.5 L7 11 L11.5 5.5" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span style={{ fontFamily: "'Caveat', cursive", fontSize: "13px" }}>Verified!</span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showVerified, setShowVerified] = useState(false);

  const { verifyEmailOtpAsync, error } = useEmailOtp();

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
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    const nextEmpty = Math.min(pasted.length, 5);
    document.getElementById(`otp-${nextEmpty}`)?.focus();
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
      const result = await verifyEmailOtpAsync({ otp: otpString });
      if (result) {
        setShowVerified(true);
        toast.success("Email verified successfully!", { duration: 2000 });
        setTimeout(() => router.push("/sign-in"), 500);
      }
    } catch (err) {
      toast.error(extractErrorMessage(err), { duration: 4000 });
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    toast.info("Resend functionality coming soon. Please check your email.", { duration: 3000 });
    setResendTimer(60);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .scribble-otp {
          font-family: 'Caveat', cursive;
          font-size: 22px;
          font-weight: 700;
          border: 2px solid black;
          border-radius: 0;
          background: white;
          text-align: center;
          outline: none;
          transition: box-shadow 0.15s ease, background 0.15s ease;
          color: black;
          caret-color: black;
        }
        .scribble-otp:focus {
          box-shadow: 3px 3px 0px black;
          background: #fafafa;
        }
        .scribble-otp.filled {
          background: black;
          color: white;
          box-shadow: 2px 2px 0px #444;
        }
        .scribble-otp:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .scribble-otp::placeholder { color: #ccc; }

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
        .otp-bounce {
          animation: otpPop 0.2s ease;
        }
        @keyframes otpPop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .error-msg {
          font-family: 'Caveat', cursive;
          font-size: 13px;
          color: black;
        }
        .resend-btn {
          font-family: 'Caveat', cursive;
          font-size: 15px;
          font-weight: 700;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline wavy black;
          text-underline-offset: 3px;
          padding: 0;
          color: black;
        }
        .resend-btn:disabled { color: #aaa; cursor: not-allowed; text-decoration: none; }
      `}</style>
      <div className="noise-bg grid-bg mt-4 min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden">

        {/* Background doodles */}
        <div className="absolute top-10 left-8 opacity-15 rotate-[-12deg] pointer-events-none" style={{ fontFamily: "'Caveat', cursive", fontSize: "22px" }}>
          NexForm ✦
        </div>
        <div className="absolute bottom-16 right-10 opacity-10 rotate-[8deg] pointer-events-none" style={{ fontFamily: "'Caveat', cursive", fontSize: "18px" }}>
          almost there →
        </div>
        <div className="absolute top-1/3 right-6 opacity-10 rotate-[90deg] pointer-events-none" style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}>
          · · · · · · ·
        </div>

        {/* Floating sticky note */}
        <div className="absolute top-16 left-1/4 hidden lg:block -rotate-3">
          <div className="bg-white border-2 border-black px-4 py-2 shadow-[3px_3px_0_black]" style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}>
            📬 check your inbox
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
              Verify your<br /><em>email</em>
            </h1>
            <ScribbleUnderline />
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px" }} className="text-gray-500 mt-2">
              6-digit code sent to{" "}
              <span style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, color: "black" }}>
                {email || "your email"}
              </span>{" "}✦
            </p>
          </div>

          {/* Card */}
          <div className="card-border bg-white p-7 relative fade-up fade-up-1">
            <CornerScribble />

            {/* Mail icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <MailDoodle />
                {/* little sparkles */}
                <span className="absolute -top-1 -right-2" style={{ fontSize: "14px" }}>✦</span>
                <span className="absolute -bottom-1 -left-2 opacity-50" style={{ fontSize: "10px" }}>✦</span>
              </div>
            </div>

            {/* Label */}
            <p className="text-center mb-5" style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: 600 }}>
              Enter verification code
            </p>

            {/* OTP inputs */}
            <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
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
                  className={`scribble-otp w-11 h-13 py-2.5 ${value ? "filled otp-bounce" : ""}`}
                  style={{ width: "44px", height: "52px" }}
                  placeholder="·"
                />
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mb-5">
              {otp.map((v, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: v ? "10px" : "6px",
                    height: "6px",
                    background: v ? "black" : "#ddd",
                  }}
                />
              ))}
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
                onClick={onSubmit}
                disabled={!isOtpComplete || isSubmitting}
                className="scribble-btn w-full py-3.5 rounded-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="spin-scribble w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Verify Email →"
                )}
              </button>
              {showVerified && <VerifiedBubble />}
            </div>

            {/* Resend */}
            <div className="mt-5 text-center">
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#888" }}>
                Didn't receive the code?{" "}
                {resendTimer > 0 ? (
                  <span style={{ fontWeight: 700, color: "#aaa" }}>
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <button onClick={handleResend} disabled={isSubmitting} className="resend-btn">
                    Resend code
                  </button>
                )}
              </p>
            </div>
          </div>

          {/* Back to sign in */}
          <div className="mt-8 text-center fade-up fade-up-2 flex items-center justify-center gap-2">
            <ArrowDoodle />
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px" }} className="text-gray-500">
              Remember your password?{" "}
              <span
                onClick={() => !isSubmitting && router.push("/sign-in")}
                className="text-black font-bold cursor-pointer"
                style={{ textDecoration: "underline wavy black", textUnderlineOffset: "3px" }}
              >
                Sign in
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

export default VerifyEmailPage;

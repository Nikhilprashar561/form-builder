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

const WarningDoodle = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3 L22 20 L2 20 Z" stroke="black" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
    <line x1="12" y1="10" x2="12" y2="14" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="17" r="0.8" fill="black" />
  </svg>
);

// ── Main Component ────────────────────────────────────────────────────────────

const UserProfilePage = () => {
  const router = useRouter();
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

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
    defaultValues: { fullName: "", email: "", password: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      reset({ fullName: user.fullName, email: user.email, password: "" });
      setIsLoadingPage(false);
    }
  }, [user, reset]);

  const initials = useMemo(() => {
    if (!user?.fullName) return "U";
    return user.fullName.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  }, [user?.fullName]);

  useEffect(() => {
    if (!userLoading && !user) router.push("/sign-in");
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
      setTimeout(() => router.push("/sign-in"), 500);
    } catch (err) {
      toast.error(extractErrorMessage(err), { duration: 4000 });
    }
  };

  const onSubmit = async (formData: UpdateProfileInput) => {
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
      };
      await updateProfileAsync(payload);
      toast.success("Profile updated successfully", { duration: 2000 });
      reset({ fullName: formData.fullName, email: formData.email, password: "" });
    } catch (err) {
      toast.error(extractErrorMessage(err), { duration: 4000 });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    try {
      await deleteAccountAsync();
      toast.success("Account deleted successfully", { duration: 2000 });
      setTimeout(() => router.push("/"), 500);
    } catch (err) {
      toast.error(extractErrorMessage(err), { duration: 4000 });
      setDeleteConfirm(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────

  if (isLoadingPage || userLoading) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');`}</style>
        <div className="flex min-h-screen items-center justify-center pt-16" style={{
          backgroundColor: "#f9f8f5",
          backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}>
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8" style={{ animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" />
            </svg>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", color: "#888" }}>Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────

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
          transition: box-shadow 0.15s ease;
          width: 100%;
          padding: 10px 16px;
          color: black;
        }
        .scribble-input:focus { box-shadow: 3px 3px 0px black; }
        .scribble-input::placeholder { color: #bbb; font-family: 'Caveat', cursive; }
        .scribble-input.error-field { background: #f5f5f5; text-decoration: underline wavy black; }
        .scribble-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .scribble-btn-solid {
          font-family: 'Caveat', cursive;
          font-size: 17px;
          font-weight: 700;
          border: 2.5px solid black;
          background: black;
          color: white;
          padding: 8px 24px;
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.1s;
          box-shadow: 4px 4px 0px #555;
        }
        .scribble-btn-solid:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #333; }
        .scribble-btn-solid:active:not(:disabled) { transform: translate(1px,1px); box-shadow: 1px 1px 0 #555; }
        .scribble-btn-solid:disabled { background: #ccc; border-color: #aaa; color: #888; box-shadow: 2px 2px 0 #ccc; cursor: not-allowed; }

        .scribble-btn-outline {
          font-family: 'Caveat', cursive;
          font-size: 17px;
          font-weight: 700;
          border: 2px solid black;
          background: white;
          color: black;
          padding: 8px 20px;
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.1s;
          box-shadow: 3px 3px 0px black;
        }
        .scribble-btn-outline:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 black; }
        .scribble-btn-outline:active { transform: translate(1px,1px); box-shadow: 1px 1px 0 black; }

        .scribble-btn-danger {
          font-family: 'Caveat', cursive;
          font-size: 17px;
          font-weight: 700;
          border: 2px solid black;
          background: white;
          color: black;
          padding: 8px 20px;
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.1s, background 0.15s;
          box-shadow: 3px 3px 0px black;
        }
        .scribble-btn-danger:hover { background: black; color: white; transform: translate(-1px,-1px); box-shadow: 4px 4px 0 #444; }
        .scribble-btn-danger.confirm { background: black; color: white; }

        .card-border {
          border: 2.5px solid black;
          box-shadow: 6px 6px 0px black;
          background: white;
        }
        .danger-card {
          border: 2.5px solid black;
          box-shadow: 6px 6px 0px #555;
          background: white;
          position: relative;
          overflow: hidden;
        }
        .danger-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: repeating-linear-gradient(90deg, black 0px, black 8px, transparent 8px, transparent 14px);
        }

        .rough-label {
          font-family: 'Caveat', cursive;
          font-size: 15px;
          font-weight: 600;
          color: black;
          display: block;
          margin-bottom: 6px;
        }
        .error-msg {
          font-family: 'Caveat', cursive;
          font-size: 13px;
          color: black;
          margin-top: 4px;
        }
        .error-msg::before { content: "✗ "; }

        .section-title {
          font-family: 'Caveat', cursive;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #777;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
        }

        .noise-bg {
          background-color: #f9f8f5;
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .fade-up { animation: fadeUp 0.5s ease forwards; opacity: 0; }
        .fade-up-1 { animation-delay: 0.08s; }
        .fade-up-2 { animation-delay: 0.18s; }
        .fade-up-3 { animation-delay: 0.28s; }
        .fade-up-4 { animation-delay: 0.38s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="noise-bg min-h-screen pt-20 pb-16 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Page header */}
          <div className="mb-8 fade-up">
            <div className="flex items-center gap-2 mb-1">
              <StarDoodle className="w-5 h-5" />
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#888" }}>
                Account
              </span>
            </div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "38px", lineHeight: 1.1, fontWeight: 400 }} className="text-black">
              My <em>Profile</em>
            </h1>
            <ScribbleUnderline />
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#888", marginTop: "6px" }}>
              manage your account details ✦
            </p>
          </div>

          {/* Avatar card */}
          <div className="card-border p-6 mb-5 relative fade-up fade-up-1">
            <CornerScribble />
            <div className="section-title">◈ identity</div>
            <div className="flex items-center gap-5">
              {/* Square avatar */}
              <div style={{
                width: "64px", height: "64px",
                background: "black", color: "white",
                fontFamily: "'Instrument Serif', serif",
                fontSize: "24px", fontStyle: "italic",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2.5px solid black",
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div className="flex-1">
                <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "20px", fontWeight: 400, color: "black" }}>
                  {user?.fullName || "—"}
                </p>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#888", marginBottom: "12px" }}>
                  {user?.email || "—"}
                </p>
                <button className="scribble-btn-outline" style={{ padding: "5px 16px", fontSize: "14px" }} onClick={handleLogout}>
                  Sign Out →
                </button>
              </div>
            </div>
          </div>

          {/* Personal info card */}
          <div className="card-border p-6 mb-5 relative fade-up fade-up-2">
            <CornerScribble />
            <div className="section-title">◈ personal information</div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-5">
                <label className="rough-label">Full name</label>
                <input
                  className={`scribble-input ${errors.fullName ? "error-field" : ""}`}
                  type="text"
                  placeholder="Your full name"
                  disabled={isSubmitting}
                  {...register("fullName", {
                    minLength: { value: 2, message: "At least 2 characters" },
                    maxLength: { value: 45, message: "Max 45 characters" },
                  })}
                />
                {errors.fullName && <p className="error-msg">{errors.fullName.message}</p>}
              </div>

              <div className="mb-5">
                <label className="rough-label">Email</label>
                <input
                  className={`scribble-input ${errors.email ? "error-field" : ""}`}
                  type="email"
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  {...register("email", {
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                  })}
                />
                {errors.email && <p className="error-msg">{errors.email.message}</p>}
              </div>

              <div className="mb-6">
                <label className="rough-label">New Password</label>
                <input
                  className={`scribble-input ${errors.password ? "error-field" : ""}`}
                  type="password"
                  placeholder="Leave blank to keep current"
                  disabled={isSubmitting}
                  {...register("password", {
                    minLength: { value: 8, message: "At least 8 characters" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: "Needs uppercase, lowercase & number",
                    },
                  })}
                />
                {errors.password && <p className="error-msg">{errors.password.message}</p>}
              </div>

              {updateError && (
                <div className="mb-4 p-3 border-2 border-black bg-gray-100" style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}>
                  ✗ {extractErrorMessage(updateError)}
                </div>
              )}

              <div className="flex justify-end">
                <button type="submit" disabled={isSubmitting} className="scribble-btn-solid">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg style={{ animation: "spin 1s linear infinite", width: "16px", height: "16px" }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" />
                      </svg>
                      Saving...
                    </span>
                  ) : "Save Changes →"}
                </button>
              </div>
            </form>
          </div>

          {/* Danger zone */}
          <div className="danger-card p-6 fade-up fade-up-3">
            <div className="section-title" style={{ color: "#555" }}>
              <WarningDoodle /> danger zone
            </div>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#888", marginBottom: "16px" }}>
              These actions are permanent and cannot be undone.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="scribble-btn-outline">
                Export Data
              </button>
              <button
                onClick={handleDeleteAccount}
                className={`scribble-btn-danger ${deleteConfirm ? "confirm" : ""}`}
              >
                {deleteConfirm ? "✗ Confirm Delete?" : "Delete Account"}
              </button>
              {deleteConfirm && (
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="scribble-btn-outline"
                  style={{ fontSize: "15px" }}
                >
                  Cancel
                </button>
              )}
            </div>

            {deleteConfirm && (
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#888", marginTop: "10px" }}>
                ↑ Click "Confirm Delete?" again to permanently delete your account.
              </p>
            )}

            {deleteError && (
              <div className="mt-4 p-3 border-2 border-black bg-gray-100" style={{ fontFamily: "'Caveat', cursive", fontSize: "14px" }}>
                ✗ {extractErrorMessage(deleteError)}
              </div>
            )}
          </div>

          {/* Bottom label */}
          <div className="mt-8 flex justify-center fade-up fade-up-4">
            <div className="flex items-center gap-1" style={{ opacity: 0.3, fontFamily: "'Caveat', cursive", fontSize: "12px" }}>
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

export default UserProfilePage;

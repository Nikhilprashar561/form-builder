"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Globe, Calendar, Eye, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useCreateForm } from "~/hooks/api/form";
import { useUser } from "~/hooks/api/auth";

// ── Scribble SVG decorations ─────────────────────────────────────────────────

const ScribbleUnderline = () => (
  <svg viewBox="0 0 300 10" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6 C50 2, 100 9, 150 5 C200 1, 250 8, 298 5" stroke="black" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const StarDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);

const Spinner = ({ white }: { white?: boolean }) => (
  <svg className="w-5 h-5" style={{ animation: "spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={white ? "white" : "black"} strokeWidth="2" strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getDefaultExpiry() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CreateFormPage() {
  const router = useRouter();
  const { user } = useUser();
  const { createFormAsync } = useCreateForm();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [status, setStatus] = useState<"draft" | "published" | "unpublished" | "archived">("draft");
  const [visibilityMode, setVisibilityMode] = useState<"public" | "unlisted">("public");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState(getDefaultExpiry());
  const [isCreating, setIsCreating] = useState(false);

  // Auto-generate slug from title (unless manually edited)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugEdited) setSlug(slugify(val) + (val ? "-" + Date.now().toString(36) : ""));
  };

  const handleSlugChange = (val: string) => {
    setSlug(slugify(val));
    setSlugEdited(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!user) { toast.error("Please sign in first"); return; }
    if (isPasswordProtected && !password.trim()) {
      toast.error("Enter a password or disable password protection");
      return;
    }

    try {
      setIsCreating(true);
      const finalSlug = slug || slugify(title) + "-" + Date.now().toString(36);

      const { id } = await createFormAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        slug: finalSlug,
        status,
        visibilityMode,
        isPasswordProtected,
        passwordHash: isPasswordProtected ? password : undefined,
        expiresAt: new Date(expiresAt),
        createdBy: user.id,
      });

      toast.success("Form created! Now add your fields.");
      router.push(`/dashboard/form/${id}/edit`);
    } catch (err: any) {
      toast.error(err?.shape?.message || "Failed to create form");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .create-bg {
          background-color: #f9f8f5;
          background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          min-height: 100vh;
        }

        .scribble-btn-solid {
          font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700;
          border: 2px solid black; background: black; color: white;
          padding: 8px 20px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
          transition: transform 0.1s, box-shadow 0.1s; box-shadow: 3px 3px 0 #555;
        }
        .scribble-btn-solid:hover:not(:disabled) { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 #555; }
        .scribble-btn-solid:disabled { opacity: 0.5; cursor: not-allowed; }

        .scribble-btn-outline {
          font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700;
          border: 2px solid black; background: white; color: black;
          padding: 7px 18px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          transition: transform 0.1s, box-shadow 0.1s; box-shadow: 2px 2px 0 black;
          text-decoration: none;
        }
        .scribble-btn-outline:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 black; }

        .form-card {
          background: white;
          border: 2px solid black;
          box-shadow: 5px 5px 0 black;
          padding: 36px;
        }

        .field-group { margin-bottom: 24px; }

        .field-label {
          font-family: 'Caveat', cursive;
          font-size: 15px; font-weight: 700; color: black;
          display: block; margin-bottom: 6px;
        }
        .field-hint {
          font-family: 'Caveat', cursive;
          font-size: 13px; color: #888; margin-top: 4px;
        }

        .field-input {
          width: 100%;
          font-family: 'Caveat', cursive; font-size: 16px;
          border: 2px solid black; background: white;
          padding: 10px 14px; outline: none;
          transition: box-shadow 0.1s;
          box-sizing: border-box;
        }
        .field-input:focus { box-shadow: 3px 3px 0 black; }
        .field-input::placeholder { color: #bbb; }

        .field-select {
          width: 100%;
          font-family: 'Caveat', cursive; font-size: 16px;
          border: 2px solid black; background: white;
          padding: 10px 14px; outline: none; cursor: pointer;
          appearance: none; -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          transition: box-shadow 0.1s;
        }
        .field-select:focus { box-shadow: 3px 3px 0 black; }

        .toggle-row {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px;
          border: 2px solid black; background: white;
          cursor: pointer; user-select: none;
          transition: box-shadow 0.1s;
        }
        .toggle-row:hover { box-shadow: 2px 2px 0 black; }

        .toggle-box {
          width: 20px; height: 20px; min-width: 20px;
          border: 2px solid black; background: white;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.1s;
        }
        .toggle-box.checked { background: black; }

        .status-option {
          flex: 1; padding: 12px 10px; text-align: center;
          border: 2px solid #ddd; cursor: pointer; background: white;
          font-family: 'Caveat', cursive; font-size: 15px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.1s;
        }
        .status-option.selected { border-color: black; background: black; color: white; box-shadow: 2px 2px 0 #555; }
        .status-option:not(.selected):hover { border-color: black; }

        .divider { border: none; border-top: 2px dashed #ddd; margin: 28px 0; }

        .slug-preview {
          font-family: 'Caveat', cursive; font-size: 13px; color: #888;
          background: #f9f8f5; border: 1.5px dashed #ddd;
          padding: 6px 12px; margin-top: 6px; word-break: break-all;
        }

        .fade-up { animation: fadeUp 0.35s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="create-bg">
        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="mb-8 fade-up">
            <Link href="/dashboard" className="scribble-btn-outline mb-6 inline-flex">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-1">
                <StarDoodle className="w-5 h-5" />
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#888", fontWeight: 700 }}>
                  new form
                </span>
              </div>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "36px", fontStyle: "italic", fontWeight: 400, lineHeight: 1.1 }}>
                Create a Form
              </h1>
              <ScribbleUnderline />
            </div>
          </div>

          {/* Main Card */}
          <form onSubmit={handleSubmit}>
            <div className="form-card fade-up" style={{ animationDelay: "0.05s" }}>

              {/* Title */}
              <div className="field-group">
                <label className="field-label">Form Title *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="e.g. Customer Feedback 2026"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="field-group">
                <label className="field-label">Description <span style={{ fontWeight: 400, color: "#aaa" }}>(optional)</span></label>
                <textarea
                  className="field-input"
                  placeholder="A short description of what this form is for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Slug */}
              <div className="field-group">
                <label className="field-label">URL Slug *</label>
                <input
                  type="text"
                  required
                  className="field-input"
                  placeholder="my-awesome-form"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                />
                {slug && (
                  <div className="slug-preview">
                    🔗 /public-forms/{slug}
                  </div>
                )}
                <p className="field-hint">Only lowercase letters, numbers, and hyphens. Auto-generated from title.</p>
              </div>

              <hr className="divider" />

              {/* Status */}
              <div className="field-group">
                <label className="field-label">Status</label>
                <div className="flex gap-2">
                  {(["draft", "published", "unpublished", "archived"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`status-option ${status === s ? "selected" : ""}`}
                      onClick={() => setStatus(s)}
                    >
                      {s === "published" && <Globe className="h-3.5 w-3.5" />}
                      {s === "draft" && <Lock className="h-3.5 w-3.5" />}
                      {(s === "unpublished" || s === "archived") && <Eye className="h-3.5 w-3.5" />}
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div className="field-group">
                <label className="field-label">Visibility</label>
                <select
                  className="field-select"
                  value={visibilityMode}
                  onChange={(e) => setVisibilityMode(e.target.value as any)}
                >
                  <option value="public">🌍 Public — anyone can find this form</option>
                  <option value="unlisted">🔗 Unlisted — only people with the link</option>
                </select>
              </div>

              {/* Expiry */}
              <div className="field-group">
                <label className="field-label">
                  <Calendar className="inline h-3.5 w-3.5 mr-1" />
                  Expires At
                </label>
                <input
                  type="date"
                  className="field-input"
                  value={expiresAt}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
                <p className="field-hint">Form will stop accepting responses after this date.</p>
              </div>

              <hr className="divider" />

              {/* Password Protection */}
              <div className="field-group">
                <label className="field-label">Password Protection</label>
                <div
                  className="toggle-row"
                  onClick={() => { setIsPasswordProtected(!isPasswordProtected); setPassword(""); }}
                >
                  <div className={`toggle-box ${isPasswordProtected ? "checked" : ""}`}>
                    {isPasswordProtected && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6 L5 9 L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: 700 }}>
                      <Lock className="inline h-3.5 w-3.5 mr-1" />
                      Require a password to view this form
                    </div>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#888" }}>
                      Visitors must enter a password before accessing the form
                    </div>
                  </div>
                </div>

                {isPasswordProtected && (
                  <div style={{ marginTop: "12px" }}>
                    <input
                      type="password"
                      className="field-input"
                      placeholder="Set a password for this form..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {!password && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#999" }}>
                          You must set a password if protection is enabled
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ borderTop: "2px dashed #ddd", paddingTop: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/dashboard" className="scribble-btn-outline">
                  ← Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isCreating || !title.trim() || !slug.trim() || (isPasswordProtected && !password.trim())}
                  className="scribble-btn-solid"
                >
                  {isCreating ? <><Spinner white /> Creating...</> : "Create Form & Add Fields →"}
                </button>
              </div>

            </div>
          </form>

          {/* Footer hint */}
          <p className="text-center mt-6 fade-up" style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#aaa", animationDelay: "0.1s" }}>
            ✦ After creating, you'll be taken to the field editor to build your form
          </p>
        </div>
      </div>
    </>
  );
}

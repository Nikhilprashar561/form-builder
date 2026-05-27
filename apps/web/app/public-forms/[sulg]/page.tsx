"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "~/trpc/client";
import { useSubmitForm } from "~/hooks/api/form-submission";
import { toast } from "sonner";
import { Check, ArrowRight } from "lucide-react";

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";

const StarDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`inline-block ${className}`} fill="none">
    <path d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);

const Spinner = ({ white }: { white?: boolean }) => (
  <svg className="w-5 h-5" style={{ animation: "spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={white ? "white" : "black"} strokeWidth="2" strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" />
  </svg>
);

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: form, isLoading, error } = trpc.form.getOneSpecificFormWithAllFields.useQuery({ formId: slug });
  const { submitFormAsync } = useSubmitForm();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setAnswer = (fieldId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    // Validate required fields
    const missing = form.fields.filter(f => f.isRequired && !answers[f.id]?.trim());
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.map(f => f.label).join(", ")}`);
      return;
    }

    const values = form.fields
      .filter(f => answers[f.id] !== undefined)
      .map(f => ({ formFieldId: f.id, value: answers[f.id] ?? "" }));

    if (values.length === 0) {
      toast.error("Please fill in at least one field");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitFormAsync({ formId: form.id, values });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.shape?.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#f9f8f5" }}>
        <Spinner />
      </div>
    );
  }

  if (error || !form) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Instrument+Serif:ital@0;1&display=swap');`}</style>
        <div className="flex items-center justify-center min-h-screen px-6" style={{ background: "#f9f8f5" }}>
          <div style={{ border: "2.5px solid black", boxShadow: "6px 6px 0 black", background: "white", padding: "40px", textAlign: "center", maxWidth: "400px" }}>
            <StarDoodle className="w-8 h-8 mx-auto mb-4" />
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", fontStyle: "italic" }}>Form not found</h2>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", color: "#888", marginTop: "8px" }}>
              This form doesn't exist or has expired.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (form.status !== "published") {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Instrument+Serif:ital@0;1&display=swap');`}</style>
        <div className="flex items-center justify-center min-h-screen px-6" style={{ background: "#f9f8f5" }}>
          <div style={{ border: "2.5px solid black", boxShadow: "6px 6px 0 black", background: "white", padding: "40px", textAlign: "center", maxWidth: "400px" }}>
            <StarDoodle className="w-8 h-8 mx-auto mb-4" />
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", fontStyle: "italic" }}>Form unavailable</h2>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", color: "#888", marginTop: "8px" }}>
              This form is not currently accepting responses.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .form-bg {
          background-color: #f9f8f5;
          background-image:
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .form-card { border: 2.5px solid black; box-shadow: 8px 8px 0 black; background: white; }

        .scribble-input {
          font-family: 'Caveat', cursive; font-size: 17px;
          border: 2px solid black; background: white; padding: 12px 16px;
          outline: none; width: 100%; transition: box-shadow 0.15s;
          color: black;
        }
        .scribble-input:focus { box-shadow: 4px 4px 0 black; }
        .scribble-input::placeholder { color: #ccc; }

        .yes-no-btn {
          font-family: 'Caveat', cursive; font-size: 17px; font-weight: 700;
          border: 2px solid black; background: white; color: black;
          padding: 12px 24px; cursor: pointer; flex: 1;
          transition: background 0.15s, color 0.15s, box-shadow 0.1s;
        }
        .yes-no-btn.selected { background: black; color: white; box-shadow: 3px 3px 0 #555; }
        .yes-no-btn:not(.selected):hover { box-shadow: 2px 2px 0 black; }

        .submit-btn {
          font-family: 'Caveat', cursive; font-size: 19px; font-weight: 700;
          border: 2.5px solid black; background: black; color: white;
          padding: 14px 32px; cursor: pointer; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.1s, box-shadow 0.1s; box-shadow: 5px 5px 0 #555;
        }
        .submit-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 #333; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .field-label {
          font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; color: #888;
          display: flex; align-items: center; gap: 6px; margin-bottom: 8px;
        }
        .required-star { color: black; }

        .progress-bar { height: 3px; background: #f0f0f0; }
        .progress-fill { height: 100%; background: black; transition: width 0.5s ease; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; opacity: 0; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.2s; }
        .fade-up-3 { animation-delay: 0.3s; }
      `}</style>

      <div className="form-bg min-h-screen pt-20 pb-16 px-6 flex items-start justify-center">
        <div className="w-full max-w-lg">

          {submitted ? (
            /* Success state */
            <div className="form-card p-10 text-center fade-up">
              <div style={{
                width: "64px", height: "64px", border: "2.5px solid black",
                background: "black", borderRadius: "0",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px"
              }}>
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "32px", fontStyle: "italic", fontWeight: 400 }}>
                Thank you!
              </h2>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "17px", color: "#888", marginTop: "8px" }}>
                Your response has been recorded ✦
              </p>
              <div style={{ marginTop: "24px", padding: "16px", border: "2px dashed #ddd" }}>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#bbb" }}>
                  {form.title}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Form header */}
              <div className="mb-8 fade-up">
                <div className="flex items-center gap-2 mb-2">
                  <StarDoodle className="w-5 h-5" />
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#888" }}>
                    NexForm
                  </span>
                </div>
                <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "36px", lineHeight: 1.1, fontWeight: 400 }}>
                  {form.title}
                </h1>
                {form.description && (
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", color: "#888", marginTop: "8px" }}>
                    {form.description}
                  </p>
                )}

                {/* Progress bar */}
                <div className="progress-bar mt-4">
                  <div
                    className="progress-fill"
                    style={{
                      width: form.fields.length > 0
                        ? `${(Object.keys(answers).length / form.fields.length) * 100}%`
                        : "0%"
                    }}
                  />
                </div>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#bbb", marginTop: "4px" }}>
                  {Object.keys(answers).length} of {form.fields.length} filled
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="fade-up fade-up-1">
                <div className="form-card p-8 space-y-6 mb-6">
                  {form.fields.length === 0 && (
                    <p style={{ fontFamily: "'Caveat', cursive", fontSize: "17px", color: "#aaa", textAlign: "center" }}>
                      This form has no fields yet.
                    </p>
                  )}

                  {form.fields
                    .slice()
                    .sort((a, b) => (Number(a.index) || 0) - (Number(b.index) || 0))
                    .map((field, idx) => (
                      <div key={field.id} style={{ animationDelay: `${0.1 + idx * 0.05}s` }} className="fade-up">
                        <label className="field-label">
                          {field.label}
                          {field.isRequired && <span className="required-star">*</span>}
                        </label>

                        {field.type === "YES_NO" ? (
                          <div className="flex gap-3">
                            {["Yes", "No"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setAnswer(field.id, opt)}
                                className={`yes-no-btn ${answers[field.id] === opt ? "selected" : ""}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <input
                            type={
                              field.type === "NUMBER" ? "number" :
                              field.type === "EMAIL" ? "email" :
                              field.type === "PASSWORD" ? "password" :
                              "text"
                            }
                            placeholder={field.placeholder ?? ""}
                            value={answers[field.id] ?? ""}
                            onChange={e => setAnswer(field.id, e.target.value)}
                            className="scribble-input"
                            required={field.isRequired ?? false}
                          />
                        )}
                      </div>
                    ))}
                </div>

                <button type="submit" disabled={isSubmitting || form.fields.length === 0} className="submit-btn fade-up fade-up-2">
                  {isSubmitting ? (
                    <><Spinner white /> Submitting...</>
                  ) : (
                    <>Submit Response <ArrowRight className="h-5 w-5" /></>
                  )}
                </button>
              </form>

              <p className="text-center mt-6 fade-up fade-up-3" style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#ccc" }}>
                Powered by NexForm ✦
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useGetFormSubmissions } from "~/hooks/api/form-submission";
import { useGetAllFormFields } from "~/hooks/api/form-field";

const StarDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`inline-block ${className}`} fill="none">
    <path d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);

const Spinner = () => (
  <svg className="w-6 h-6" style={{ animation: "spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" />
  </svg>
);

export default function SubmissionsPage() {
  const params = useParams();
  const formId = params.formId as string;

  const { data: submissions, isLoading } = useGetFormSubmissions(formId);
  const { data: fields } = useGetAllFormFields(formId);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Build a fieldId → label map for display
  const fieldMap = new Map(fields?.map(f => [f.id, f.label]) ?? []);

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .subs-bg {
          background-color: #f9f8f5;
          background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .scribble-btn-outline {
          font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700;
          border: 2px solid black; background: white; color: black;
          padding: 6px 14px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          transition: transform 0.1s, box-shadow 0.1s; box-shadow: 2px 2px 0 black;
          text-decoration: none;
        }
        .scribble-btn-outline:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 black; }

        .sub-row {
          border: 2px solid black; background: white;
          transition: box-shadow 0.15s;
        }
        .sub-row:hover { box-shadow: 3px 3px 0 black; }

        .sub-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; cursor: pointer; gap: 12px;
        }

        .sub-body { padding: 0 20px 16px; border-top: 1.5px dashed #eee; }

        .value-row {
          display: flex; gap: 12px; padding: 8px 0;
          border-bottom: 1px dashed #f0f0f0;
        }
        .value-row:last-child { border-bottom: none; }

        .field-name {
          font-family: 'Caveat', cursive; font-size: 13px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; color: #999;
          min-width: 140px; flex-shrink: 0;
        }
        .field-value {
          font-family: 'Caveat', cursive; font-size: 16px; color: black;
        }

        .empty-state {
          border: 2.5px dashed black; padding: 64px 24px;
          text-align: center; background: white;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; opacity: 0; }
      `}</style>

      <div className="subs-bg min-h-screen pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-8 fade-up">
            <Link href={`/dashboard/form/${formId}/edit`} className="scribble-btn-outline mb-6 inline-flex">
              <ArrowLeft className="h-4 w-4" /> Back to Editor
            </Link>

            <div className="flex items-center gap-2 mt-4 mb-1">
              <StarDoodle className="w-5 h-5" />
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#888" }}>
                Submissions
              </span>
            </div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "38px", lineHeight: 1.1, fontWeight: 400 }}>
              Form <em>Responses</em>
            </h1>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#888", marginTop: "4px" }}>
              {isLoading ? "Loading..." : `${submissions?.length ?? 0} response${submissions?.length !== 1 ? "s" : ""} collected`} ✦
            </p>
          </div>

          {/* Stats bar */}
          {!isLoading && submissions && submissions.length > 0 && (
            <div className="mb-6 fade-up" style={{ border: "2.5px solid black", boxShadow: "4px 4px 0 black", background: "white", padding: "16px 20px", display: "flex", gap: "32px" }}>
              <div>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#aaa" }}>Total</p>
                <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "32px", fontWeight: 400 }}>{submissions.length}</p>
              </div>
              <div>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#aaa" }}>Latest</p>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", color: "#555" }}>
                  {formatDate(submissions[0]?.createdAt ?? "")}
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          )}

          {/* Empty */}
          {!isLoading && (!submissions || submissions.length === 0) && (
            <div className="empty-state">
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", color: "#bbb", marginBottom: "8px" }}>
                No submissions yet ✦
              </p>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#ccc" }}>
                Share your form link to start collecting responses
              </p>
            </div>
          )}

          {/* Submission rows */}
          {!isLoading && (
            <div className="space-y-3">
              {submissions?.map((sub, idx) => (
                <div key={sub.id} className="sub-row fade-up" style={{ animationDelay: `${idx * 0.04}s` }}>
                  <div className="sub-header" onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}>
                    <div>
                      <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: 700, color: "#888", letterSpacing: "1px" }}>
                        Response #{(submissions.length - idx).toString().padStart(3, "0")}
                      </p>
                      <p style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#bbb" }}>
                        {formatDate(sub.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#bbb" }}>
                        {sub.values?.length ?? 0} field{sub.values?.length !== 1 ? "s" : ""}
                      </span>
                      {expandedId === sub.id
                        ? <ChevronUp className="h-4 w-4 text-gray-400" />
                        : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>

                  {expandedId === sub.id && (
                    <div className="sub-body">
                      {!sub.values || sub.values.length === 0 ? (
                        <p style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#bbb", padding: "12px 0" }}>No values recorded</p>
                      ) : (
                        sub.values.map((v) => (
                          <div key={v.formFieldId} className="value-row">
                            <span className="field-name">
                              {fieldMap.get(v.formFieldId) ?? "Field"}
                            </span>
                            <span className="field-value">{v.value || <em style={{ color: "#ccc" }}>empty</em>}</span>
                          </div>
                        ))
                      )}
                      <p style={{ fontFamily: "'Caveat', cursive", fontSize: "11px", color: "#ddd", marginTop: "8px" }}>
                        ID: {sub.id}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

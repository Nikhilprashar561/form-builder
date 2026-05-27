"use client";
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart4, Users, Calendar, TrendingUp, Download } from "lucide-react";
import { useGetFormSubmissions } from "~/hooks/api/form-submission";
import { useGetAllFormFields } from "~/hooks/api/form-field";

// ── Decorations ───────────────────────────────────────────────────────────────

const StarDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`inline-block ${className}`} fill="none">
    <path d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);

const ScribbleUnderline = () => (
  <svg viewBox="0 0 300 10" className="w-full max-w-xs" fill="none">
    <path d="M2 6 C50 2, 100 9, 150 5 C200 1, 250 8, 298 5" stroke="black" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const Spinner = () => (
  <svg className="w-6 h-6" style={{ animation: "spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────

type Submission = {
  id: string;
  createdAt: string;
  values: { formFieldId: string; value: string }[] | null;
};

type Field = {
  id: string;
  label: string;
  type: string;
  isRequired: boolean | null;
  placeholder?: string | null;
  order: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return iso; }
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

// Group submissions by day (last 30 days)
function getSubmissionsByDay(submissions: Submission[]) {
  const counts: Record<string, number> = {};
  const now = new Date();
  // Initialize last 14 days
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0]!;
    counts[key] = 0;
  }
  submissions.forEach((s) => {
    const key = new Date(s.createdAt).toISOString().split("T")[0]!;
    if (key in counts) counts[key] = (counts[key] ?? 0) + 1;
  });
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

// Get value frequency for a specific field
function getFieldValueFrequency(submissions: Submission[], fieldId: string) {
  const freq: Record<string, number> = {};
  submissions.forEach((s) => {
    const val = s.values?.find((v) => v.formFieldId === fieldId)?.value;
    if (val !== undefined && val !== "") {
      const key = val.trim().toLowerCase();
      freq[key] = (freq[key] ?? 0) + 1;
    }
  });
  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([value, count]) => ({ value, count }));
}

function getCompletionRate(submissions: Submission[], fields: Field[]) {
  if (!submissions.length || !fields.length) return 0;
  const requiredFields = fields.filter((f) => f.isRequired);
  if (!requiredFields.length) return 100;
  const complete = submissions.filter((s) =>
    requiredFields.every((f) => s.values?.some((v) => v.formFieldId === f.id && v.value.trim()))
  ).length;
  return Math.round((complete / submissions.length) * 100);
}

// ── Mini Bar Chart ────────────────────────────────────────────────────────────

function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const maxVal = Math.max(...data.map((d) => d.count), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px", padding: "0 4px" }}>
      {data.map(({ date, count }) => (
        <div key={date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <div
            title={`${formatDate(date)}: ${count} submission${count !== 1 ? "s" : ""}`}
            style={{
              width: "100%",
              height: `${Math.max((count / maxVal) * 64, count > 0 ? 4 : 0)}px`,
              background: count > 0 ? "black" : "#e5e5e5",
              transition: "height 0.4s ease",
              cursor: "default",
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Frequency Bar ─────────────────────────────────────────────────────────────

function FrequencyBars({ data, total }: { data: { value: string; count: number }[]; total: number }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {data.map(({ value, count }) => (
        <div key={value}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: 600, maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {value}
            </span>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#888" }}>
              {count} ({Math.round((count / total) * 100)}%)
            </span>
          </div>
          <div style={{ height: "10px", background: "#f0efeb", border: "1.5px solid black", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${(count / max) * 100}%`,
                background: "black",
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#bbb", textAlign: "center", padding: "16px" }}>
          No responses yet
        </p>
      )}
    </div>
  );
}

// ── CSV Export ────────────────────────────────────────────────────────────────

function exportToCSV(submissions: Submission[], fields: Field[]) {
  const headers = ["Submission ID", "Submitted At", ...fields.map((f) => f.label)];
  const rows = submissions.map((s) => [
    s.id,
    formatDateTime(s.createdAt),
    ...fields.map((f) => s.values?.find((v) => v.formFieldId === f.id)?.value ?? ""),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `submissions-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const params = useParams();
  const formId = params.formId as string;

  const { data: submissions, isLoading: subsLoading } = useGetFormSubmissions(formId);
  const { data: fields, isLoading: fieldsLoading } = useGetAllFormFields(formId);

  const [activeField, setActiveField] = useState<string | null>(null);

  const safeSubmissions: Submission[] = (submissions ?? []) as Submission[];
  const safeFields: Field[] = (fields ?? []) as Field[];

  const chartData = useMemo(() => getSubmissionsByDay(safeSubmissions), [safeSubmissions]);
  const completionRate = useMemo(() => getCompletionRate(safeSubmissions, safeFields), [safeSubmissions, safeFields]);
  const selectedField = activeField ?? safeFields[0]?.id ?? null;
  const fieldFrequency = useMemo(
    () => (selectedField ? getFieldValueFrequency(safeSubmissions, selectedField) : []),
    [safeSubmissions, selectedField]
  );

  const isLoading = subsLoading || fieldsLoading;

  // Avg fields filled per submission
  const avgFieldsFilled = useMemo(() => {
    if (!safeSubmissions.length || !safeFields.length) return 0;
    const total = safeSubmissions.reduce((acc, s) => acc + (s.values?.filter((v) => v.value.trim()).length ?? 0), 0);
    return (total / safeSubmissions.length).toFixed(1);
  }, [safeSubmissions, safeFields]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .analytics-bg {
          background-color: #f9f8f5;
          background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          min-height: 100vh;
        }

        .stat-card {
          background: white;
          border: 2px solid black;
          box-shadow: 3px 3px 0 black;
          padding: 20px 24px;
        }
        .stat-card:hover { box-shadow: 5px 5px 0 black; transform: translate(-1px,-1px); transition: all 0.15s; }

        .section-card {
          background: white;
          border: 2px solid black;
          box-shadow: 4px 4px 0 black;
          padding: 28px;
        }

        .scribble-btn-outline {
          font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700;
          border: 2px solid black; background: white; color: black;
          padding: 7px 18px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          transition: transform 0.1s, box-shadow 0.1s; box-shadow: 2px 2px 0 black;
          text-decoration: none;
        }
        .scribble-btn-outline:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 black; }

        .scribble-btn-solid {
          font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700;
          border: 2px solid black; background: black; color: white;
          padding: 7px 18px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          transition: transform 0.1s, box-shadow 0.1s; box-shadow: 2px 2px 0 #555;
        }
        .scribble-btn-solid:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #555; }

        .field-tab {
          font-family: 'Caveat', cursive; font-size: 14px; font-weight: 600;
          border: 2px solid #ddd; background: white; color: #888;
          padding: 6px 14px; cursor: pointer;
          transition: all 0.1s;
          white-space: nowrap;
        }
        .field-tab.active { border-color: black; background: black; color: white; }
        .field-tab:not(.active):hover { border-color: black; color: black; }

        .ring-chart {
          position: relative; display: inline-flex;
          align-items: center; justify-content: center;
        }

        .fade-up { animation: fadeUp 0.35s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="analytics-bg">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-8 fade-up">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Link href="/dashboard" className="scribble-btn-outline">
                <ArrowLeft className="h-4 w-4" /> Dashboard
              </Link>
              <Link href={`/dashboard/form/${formId}/edit`} className="scribble-btn-outline">
                ✏️ Edit Fields
              </Link>
              <Link href={`/dashboard/form/${formId}/submissions`} className="scribble-btn-outline">
                <Users className="h-4 w-4" /> Submissions
              </Link>
              {safeSubmissions.length > 0 && (
                <button
                  className="scribble-btn-solid"
                  onClick={() => exportToCSV(safeSubmissions, safeFields)}
                >
                  <Download className="h-4 w-4" /> Export CSV
                </button>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StarDoodle className="w-5 h-5" />
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#888", fontWeight: 700 }}>
                  analytics
                </span>
              </div>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "36px", fontStyle: "italic", fontWeight: 400, lineHeight: 1.1 }}>
                Form Analytics
              </h1>
              <ScribbleUnderline />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Spinner />
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 fade-up" style={{ animationDelay: "0.05s" }}>
                <div className="stat-card">
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#888", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>
                    Total
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "42px", fontStyle: "italic", lineHeight: 1 }}>
                    {safeSubmissions.length}
                  </div>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#aaa", marginTop: "4px" }}>
                    submissions
                  </div>
                </div>

                <div className="stat-card">
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#888", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>
                    Fields
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "42px", fontStyle: "italic", lineHeight: 1 }}>
                    {safeFields.length}
                  </div>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#aaa", marginTop: "4px" }}>
                    in this form
                  </div>
                </div>

                <div className="stat-card">
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#888", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>
                    Completion
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "42px", fontStyle: "italic", lineHeight: 1 }}>
                    {completionRate}%
                  </div>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#aaa", marginTop: "4px" }}>
                    required fields filled
                  </div>
                </div>

                <div className="stat-card">
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#888", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>
                    Avg Fields
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "42px", fontStyle: "italic", lineHeight: 1 }}>
                    {avgFieldsFilled}
                  </div>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#aaa", marginTop: "4px" }}>
                    answered per submit
                  </div>
                </div>
              </div>

              {/* Chart Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 fade-up" style={{ animationDelay: "0.1s" }}>
                {/* Activity Chart */}
                <div className="section-card md:col-span-2">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div>
                      <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "22px", fontStyle: "italic", fontWeight: 400 }}>
                        Submission Activity
                      </h2>
                      <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#aaa" }}>Last 14 days</p>
                    </div>
                    <TrendingUp className="h-5 w-5" style={{ opacity: 0.3 }} />
                  </div>

                  {safeSubmissions.length === 0 ? (
                    <div style={{ height: "80px", border: "2px dashed #ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#bbb" }}>No submissions yet</p>
                    </div>
                  ) : (
                    <>
                      <MiniBarChart data={chartData} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", color: "#bbb" }}>
                          {formatDate(chartData[0]?.date ?? "")}
                        </span>
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", color: "#bbb" }}>
                          Today
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Completion Ring */}
                <div className="section-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                  <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "22px", fontStyle: "italic", fontWeight: 400, marginBottom: "20px" }}>
                    Completion Rate
                  </h2>

                  {/* SVG Ring */}
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#f0efeb" strokeWidth="12" />
                    <circle
                      cx="60" cy="60" r="48" fill="none"
                      stroke="black" strokeWidth="12"
                      strokeDasharray={`${(completionRate / 100) * 301.6} 301.6`}
                      strokeDashoffset="75.4"
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 0.6s ease" }}
                    />
                    <text x="60" y="60" textAnchor="middle" dominantBaseline="middle"
                      style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", fontStyle: "italic" }}>
                      {completionRate}%
                    </text>
                  </svg>

                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#888", marginTop: "12px" }}>
                    {safeFields.filter(f => f.isRequired).length} required field{safeFields.filter(f => f.isRequired).length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Field Response Breakdown */}
              {safeFields.length > 0 && (
                <div className="section-card mb-6 fade-up" style={{ animationDelay: "0.15s" }}>
                  <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "22px", fontStyle: "italic", fontWeight: 400, marginBottom: "6px" }}>
                    Response Breakdown
                  </h2>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#aaa", marginBottom: "16px" }}>
                    Most common answers per field
                  </p>

                  {/* Field tabs */}
                  <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "12px", marginBottom: "20px", borderBottom: "2px dashed #ddd" }}>
                    {safeFields.map((f) => (
                      <button
                        key={f.id}
                        className={`field-tab ${selectedField === f.id ? "active" : ""}`}
                        onClick={() => setActiveField(f.id)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {selectedField && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#888" }}>
                          {safeFields.find((f) => f.id === selectedField)?.type}
                        </span>
                        {safeFields.find((f) => f.id === selectedField)?.isRequired && (
                          <span style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", background: "black", color: "white", padding: "2px 8px" }}>
                            Required
                          </span>
                        )}
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#bbb", marginLeft: "auto" }}>
                          {fieldFrequency.reduce((a, b) => a + b.count, 0)} of {safeSubmissions.length} responded
                        </span>
                      </div>
                      <FrequencyBars
                        data={fieldFrequency}
                        total={safeSubmissions.length}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Recent Submissions */}
              {safeSubmissions.length > 0 && (
                <div className="section-card fade-up" style={{ animationDelay: "0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div>
                      <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "22px", fontStyle: "italic", fontWeight: 400 }}>
                        Recent Submissions
                      </h2>
                      <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#aaa" }}>Latest 5 entries</p>
                    </div>
                    <Link href={`/dashboard/form/${formId}/submissions`} className="scribble-btn-outline" style={{ fontSize: "14px", padding: "5px 14px" }}>
                      View All →
                    </Link>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid black" }}>
                          <th style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#888", textAlign: "left", padding: "8px 12px 10px" }}>
                            <Calendar className="inline h-3.5 w-3.5 mr-1" />
                            Submitted
                          </th>
                          {safeFields.slice(0, 3).map((f) => (
                            <th key={f.id} style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#888", textAlign: "left", padding: "8px 12px 10px" }}>
                              {f.label}
                            </th>
                          ))}
                          {safeFields.length > 3 && (
                            <th style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#bbb", textAlign: "left", padding: "8px 12px 10px" }}>
                              +{safeFields.length - 3} more
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {[...safeSubmissions]
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(0, 5)
                          .map((sub, idx) => (
                            <tr
                              key={sub.id}
                              style={{
                                borderBottom: idx < 4 ? "1.5px dashed #eee" : "none",
                                background: idx % 2 === 0 ? "white" : "#fafaf8",
                              }}
                            >
                              <td style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#888", padding: "10px 12px" }}>
                                {formatDateTime(sub.createdAt)}
                              </td>
                              {safeFields.slice(0, 3).map((f) => {
                                const val = sub.values?.find((v) => v.formFieldId === f.id)?.value;
                                return (
                                  <td key={f.id} style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", padding: "10px 12px", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {val || <span style={{ color: "#ccc" }}>—</span>}
                                  </td>
                                );
                              })}
                              {safeFields.length > 3 && <td />}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {safeSubmissions.length === 0 && !isLoading && (
                <div className="section-card fade-up" style={{ textAlign: "center", padding: "60px 40px", animationDelay: "0.1s" }}>
                  <BarChart4 className="h-10 w-10 mx-auto mb-4" style={{ opacity: 0.15 }} />
                  <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "24px", fontStyle: "italic", fontWeight: 400, marginBottom: "8px" }}>
                    No data yet
                  </h2>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#aaa", marginBottom: "24px" }}>
                    Analytics will appear here once your form receives submissions
                  </p>
                  <Link href={`/dashboard/form/${formId}/edit`} className="scribble-btn-outline">
                    ✏️ Edit Form Fields
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

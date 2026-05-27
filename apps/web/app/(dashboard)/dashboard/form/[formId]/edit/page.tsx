"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, GripVertical, ArrowLeft, Save, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useCreateNewField, useUpdateField, useDeleteField, useGetAllFormFields } from "~/hooks/api/form-field";
import { useUser } from "~/hooks/api/auth";

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";

const FIELD_TYPES: { value: FieldType; label: string; desc: string }[] = [
  { value: "TEXT", label: "Text", desc: "Short or long text answer" },
  { value: "NUMBER", label: "Number", desc: "Numeric value input" },
  { value: "EMAIL", label: "Email", desc: "Email address field" },
  { value: "YES_NO", label: "Yes / No", desc: "Boolean choice" },
  { value: "PASSWORD", label: "Password", desc: "Masked password input" },
];

const StarDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`inline-block ${className}`} fill="none">
    <path d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);

const Spinner = ({ white }: { white?: boolean }) => (
  <svg className="w-4 h-4" style={{ animation: "spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={white ? "white" : "black"} strokeWidth="2" strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" />
  </svg>
);

export default function FormEditPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;

  const { user, isLoading: userLoading } = useUser();
  const { data: fields, isLoading: fieldsLoading, refetch } = useGetAllFormFields(formId);
  const { createFieldAsync } = useCreateNewField();
  const { deleteFieldAsync } = useDeleteField();
  const { updateFieldAsync } = useUpdateField();

  const [isAddingField, setIsAddingField] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New field form state
  const [newLabel, setNewLabel] = useState("");
  const [newPlaceholder, setNewPlaceholder] = useState("");
  const [newType, setNewType] = useState<FieldType>("TEXT");
  const [newRequired, setNewRequired] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Edit field state
  const [editLabel, setEditLabel] = useState("");
  const [editPlaceholder, setEditPlaceholder] = useState("");
  const [editRequired, setEditRequired] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    try {
      setIsCreating(true);
      await createFieldAsync({
        label: newLabel,
        placeholder: newPlaceholder || null,
        isRequired: newRequired,
        type: newType,
        formId,
        order: (fields?.length ?? 0) + 1,
      });
      toast.success("Field added!");
      setNewLabel("");
      setNewPlaceholder("");
      setNewRequired(false);
      setNewType("TEXT");
      setIsAddingField(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.shape?.message || "Failed to add field");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm("Delete this field?")) return;
    try {
      setDeletingId(fieldId);
      await deleteFieldAsync({ fieldId });
      toast.success("Field deleted");
      refetch();
    } catch {
      toast.error("Failed to delete field");
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (field: any) => {
    setEditingId(field.id);
    setEditLabel(field.label);
    setEditPlaceholder(field.placeholder ?? "");
    setEditRequired(field.isRequired ?? false);
  };

  const handleSaveEdit = async (fieldId: string) => {
    try {
      setIsSaving(true);
      await updateFieldAsync({
        fieldId,
        label: editLabel,
        placeholder: editPlaceholder || undefined,
        isRequired: editRequired,
      });
      toast.success("Field updated");
      setEditingId(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.shape?.message || "Failed to update field");
    } finally {
      setIsSaving(false);
    }
  };

  if (userLoading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "#f9f8f5" }}>
      <Spinner />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .edit-bg {
          background-color: #f9f8f5;
          background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .card { border: 2.5px solid black; box-shadow: 5px 5px 0 black; background: white; }
        .field-row {
          border: 2px solid black; background: white; padding: 16px 20px;
          transition: box-shadow 0.15s, transform 0.15s;
        }
        .field-row:hover { box-shadow: 3px 3px 0 black; transform: translate(-1px,-1px); }

        .scribble-btn-solid {
          font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700;
          border: 2.5px solid black; background: black; color: white;
          padding: 8px 18px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
          transition: transform 0.1s, box-shadow 0.1s; box-shadow: 3px 3px 0 #555;
        }
        .scribble-btn-solid:hover:not(:disabled) { transform: translate(-1px,-1px); box-shadow: 5px 5px 0 #333; }
        .scribble-btn-solid:disabled { opacity: 0.6; cursor: not-allowed; }

        .scribble-btn-outline {
          font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700;
          border: 2px solid black; background: white; color: black;
          padding: 6px 14px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          transition: transform 0.1s, box-shadow 0.1s; box-shadow: 2px 2px 0 black;
          text-decoration: none;
        }
        .scribble-btn-outline:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 black; }

        .scribble-input {
          font-family: 'Caveat', cursive; font-size: 16px;
          border: 2px solid black; background: white; padding: 10px 14px;
          outline: none; width: 100%; transition: box-shadow 0.15s;
        }
        .scribble-input:focus { box-shadow: 3px 3px 0 black; }
        .scribble-input::placeholder { color: #bbb; }

        .field-type-badge {
          font-family: 'Caveat', cursive; font-size: 12px; font-weight: 700;
          padding: 2px 10px; border: 1.5px solid black; background: #f5f5f5; color: #666;
        }
        .required-badge {
          font-family: 'Caveat', cursive; font-size: 12px; font-weight: 700;
          padding: 2px 8px; border: 1.5px solid black; background: black; color: white;
        }

        .icon-btn { padding: 6px; border: 1.5px solid transparent; background: none; cursor: pointer; color: #aaa; transition: color 0.15s, border-color 0.15s, box-shadow 0.1s; display: flex; align-items: center; }
        .icon-btn:hover { color: black; border-color: black; box-shadow: 2px 2px 0 black; }
        .icon-btn.danger:hover { color: white; background: black; }

        .toggle-switch {
          position: relative; width: 40px; height: 22px; cursor: pointer;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
        .toggle-track {
          position: absolute; inset: 0; border: 2px solid black; background: white;
          transition: background 0.2s;
        }
        .toggle-switch input:checked + .toggle-track { background: black; }
        .toggle-thumb {
          position: absolute; top: 2px; left: 2px; width: 14px; height: 14px;
          background: black; transition: transform 0.2s, background 0.2s;
        }
        .toggle-switch input:checked ~ .toggle-thumb { transform: translateX(18px); background: white; }

        .section-title {
          font-family: 'Caveat', cursive; font-size: 12px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase; color: #888;
          display: flex; align-items: center; gap: 6px;
        }

        .add-field-panel {
          border: 2.5px dashed black; background: white; padding: 24px;
        }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; opacity: 0; }
      `}</style>

      <div className="edit-bg min-h-screen pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Back + header */}
          <div className="mb-8 fade-up">
            <Link href="/dashboard" className="scribble-btn-outline mb-6 inline-flex">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="flex items-center gap-2 mt-4 mb-1">
              <StarDoodle className="w-5 h-5" />
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#888" }}>
                Form Builder
              </span>
            </div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "38px", lineHeight: 1.1, fontWeight: 400 }}>
              Edit <em>Fields</em>
            </h1>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#888", marginTop: "4px" }}>
              Form ID: {formId} ✦ {fields?.length ?? 0} field{fields?.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Fields list */}
          <div className="space-y-3 mb-8">
            {fieldsLoading && (
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            )}

            {!fieldsLoading && fields?.length === 0 && (
              <div style={{ border: "2.5px dashed #ccc", padding: "40px", textAlign: "center", background: "white" }}>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "18px", color: "#bbb" }}>
                  No fields yet. Add your first field below ↓
                </p>
              </div>
            )}

            {!fieldsLoading && fields?.map((field, idx) => (
              <div key={field.id} className="field-row fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                {editingId === field.id ? (
                  /* Edit mode */
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "4px" }}>Label</label>
                        <input value={editLabel} onChange={e => setEditLabel(e.target.value)} className="scribble-input" />
                      </div>
                      <div>
                        <label style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "4px" }}>Placeholder</label>
                        <input value={editPlaceholder} onChange={e => setEditPlaceholder(e.target.value)} className="scribble-input" placeholder="Optional" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: 600 }}>Required?</label>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={editRequired} onChange={e => setEditRequired(e.target.checked)} />
                        <div className="toggle-track" />
                        <div className="toggle-thumb" />
                      </label>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => handleSaveEdit(field.id)} disabled={isSaving} className="scribble-btn-solid" style={{ fontSize: "15px", padding: "6px 14px" }}>
                        {isSaving ? <><Spinner white /> Saving...</> : <><Save className="h-3.5 w-3.5" /> Save</>}
                      </button>
                      <button onClick={() => setEditingId(null)} className="scribble-btn-outline" style={{ fontSize: "15px", padding: "6px 14px" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <GripVertical className="h-4 w-4 text-gray-300 mt-1 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "18px", fontStyle: "italic" }}>{field.label}</span>
                          <span className="field-type-badge">{field.type}</span>
                          {field.isRequired && <span className="required-badge">Required</span>}
                        </div>
                        {field.placeholder && (
                          <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#bbb" }}>
                            Placeholder: "{field.placeholder}"
                          </p>
                        )}
                        <p style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", color: "#ddd" }}>
                          Order: {field.order}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => startEdit(field)} className="icon-btn" title="Edit field">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDeleteField(field.id)}
                        disabled={deletingId === field.id}
                        className="icon-btn danger"
                        title="Delete field"
                      >
                        {deletingId === field.id ? <Spinner /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add field panel */}
          {!isAddingField ? (
            <button className="scribble-btn-solid w-full justify-center" onClick={() => setIsAddingField(true)}>
              <Plus className="h-4 w-4" /> Add Field
            </button>
          ) : (
            <div className="add-field-panel fade-up">
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#888", marginBottom: "16px" }}>
                ◈ New Field
              </p>
              <form onSubmit={handleAddField} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "4px" }}>
                      Label *
                    </label>
                    <input
                      required
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                      placeholder="e.g. Your Name"
                      className="scribble-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "4px" }}>
                      Placeholder
                    </label>
                    <input
                      value={newPlaceholder}
                      onChange={e => setNewPlaceholder(e.target.value)}
                      placeholder="Optional hint"
                      className="scribble-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "8px" }}>
                    Field Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FIELD_TYPES.map((ft) => (
                      <button
                        key={ft.value}
                        type="button"
                        onClick={() => setNewType(ft.value)}
                        style={{
                          fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: 700,
                          padding: "8px 12px", border: "2px solid black", background: newType === ft.value ? "black" : "white",
                          color: newType === ft.value ? "white" : "black", cursor: "pointer",
                          textAlign: "left", transition: "all 0.1s",
                        }}
                      >
                        {ft.label}
                        <span style={{ fontSize: "11px", fontWeight: 400, color: newType === ft.value ? "#ccc" : "#aaa", display: "block" }}>
                          {ft.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", fontWeight: 600 }}>Required?</label>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={newRequired} onChange={e => setNewRequired(e.target.checked)} />
                    <div className="toggle-track" />
                    <div className="toggle-thumb" />
                  </label>
                </div>

                <div className="flex gap-3 pt-2" style={{ borderTop: "2px dashed #ddd" }}>
                  <button type="submit" disabled={isCreating || !newLabel.trim()} className="scribble-btn-solid">
                    {isCreating ? <><Spinner white /> Adding...</> : <><Plus className="h-4 w-4" /> Add Field</>}
                  </button>
                  <button type="button" onClick={() => setIsAddingField(false)} className="scribble-btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Bottom actions */}
          <div className="mt-8 pt-6 flex gap-3 justify-between" style={{ borderTop: "2px dashed #ddd" }}>
            <Link href={`/dashboard/form/${formId}/submissions`} className="scribble-btn-outline">
              <BarChart4 className="h-4 w-4" /> View Submissions
            </Link>
            <Link href="/dashboard" className="scribble-btn-solid">
              Done →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

// Fix missing import
function BarChart4({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

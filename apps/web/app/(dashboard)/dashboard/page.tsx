"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus, BarChart4, ExternalLink, Copy, Eye,
  Search, Check, Lock, Globe, Layout, X, Trash2, Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "~/hooks/api/auth";
import { useCreateForm, useGetCreatedForms, useDeleteForm } from "~/hooks/api/form";

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

const DiamondDoodle = () => (
  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 inline-block opacity-50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1 L11 6 L6 11 L1 6 Z" stroke="black" strokeWidth="1.2" fill="none" />
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

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return iso; }
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();

  const { data: forms, isLoading: formsLoading, refetch } = useGetCreatedForms();
  const { createFormAsync } = useCreateForm();
  const { deleteFormAsync } = useDeleteForm();

  const [activeTab, setActiveTab] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Create form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newVisibility, setNewVisibility] = useState<"public" | "unlisted">("public");
  const [newStatus, setNewStatus] = useState<"draft" | "published">("draft");
  const [isCreating, setIsCreating] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !user) router.push("/sign-in");
  }, [user, userLoading, router]);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/forms/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(slug);
    toast.success("Link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteForm = async (formId: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      setDeletingId(formId);
      await deleteFormAsync({ formId });
      toast.success("Form deleted");
      refetch();
    } catch {
      toast.error("Failed to delete form");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      setIsCreating(true);
      const slug = slugify(newTitle) + "-" + Date.now().toString(36);
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const { id } = await createFormAsync({
        title: newTitle,
        description: newDescription || undefined,
        slug,
        status: newStatus,
        visibilityMode: newVisibility,
        isPasswordProtected: false,
        expiresAt,
        createdBy: user!.id,
      });

      toast.success("Form created!");
      setIsCreateModalOpen(false);
      setNewTitle("");
      setNewDescription("");
      router.push(`/forms/${id}/edit`);
    } catch (err: any) {
      toast.error(err?.shape?.message || "Failed to create form");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredForms = (forms ?? []).filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && form.status.toLowerCase() === activeTab.toLowerCase();
  });

  const totalForms = forms?.length ?? 0;

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#f9f8f5" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .dash-noise-bg {
          background-color: #f9f8f5;
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .card-border { border: 2.5px solid black; box-shadow: 5px 5px 0px black; background: white; position: relative; }
        .card-border-soft {
          border: 2px solid black; box-shadow: 4px 4px 0px black; background: white; position: relative;
          transition: box-shadow 0.15s ease, transform 0.15s ease;
        }
        .card-border-soft:hover { box-shadow: 6px 6px 0px black; transform: translate(-1px, -1px); }
        .stat-card { border: 2.5px solid black; background: white; padding: 20px 24px; }

        .scribble-btn-solid {
          font-family: 'Caveat', cursive; font-size: 17px; font-weight: 700;
          border: 2.5px solid black; background: black; color: white;
          padding: 8px 20px; cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          transition: transform 0.1s, box-shadow 0.1s;
          box-shadow: 4px 4px 0px #555;
        }
        .scribble-btn-solid:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #333; }
        .scribble-btn-solid:disabled { opacity: 0.6; cursor: not-allowed; }

        .scribble-btn-outline {
          font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700;
          border: 2px solid black; background: white; color: black;
          padding: 6px 14px; cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          transition: transform 0.1s, box-shadow 0.1s;
          box-shadow: 2px 2px 0px black; text-decoration: none;
        }
        .scribble-btn-outline:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 black; }

        .tab-btn {
          font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700;
          padding: 6px 16px; border: 2px solid transparent; cursor: pointer;
          background: none; color: #999;
          transition: color 0.15s, border-color 0.15s, box-shadow 0.15s;
          text-transform: capitalize;
        }
        .tab-btn:hover { color: black; }
        .tab-btn.active { border: 2px solid black; color: black; background: white; box-shadow: 2px 2px 0 black; }

        .search-input {
          font-family: 'Caveat', cursive; font-size: 16px;
          border: 2px solid black; background: white;
          padding: 8px 12px 8px 38px; outline: none; width: 100%;
          transition: box-shadow 0.15s;
        }
        .search-input:focus { box-shadow: 3px 3px 0 black; }
        .search-input::placeholder { color: #bbb; font-family: 'Caveat', cursive; }

        .status-badge {
          font-family: 'Caveat', cursive; font-size: 13px; font-weight: 700;
          padding: 3px 10px; border: 1.5px solid black;
          display: flex; align-items: center; gap: 4px;
        }
        .status-badge.published { background: black; color: white; }
        .status-badge.draft { background: #f0f0f0; color: #aaa; }
        .status-badge.unlisted { background: white; color: #666; border-style: dashed; }
        .status-badge.unpublished { background: white; color: #aaa; border-style: dashed; }
        .status-badge.archived { background: #e0e0e0; color: #888; }

        .form-card-title {
          font-family: 'Instrument Serif', serif;
          font-size: 20px; font-style: italic; font-weight: 400; color: black;
          text-decoration: none; transition: text-decoration 0.15s;
        }
        .form-card-title:hover { text-decoration: underline; }

        .metric-label { font-family: 'Caveat', cursive; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #aaa; }
        .metric-value { font-family: 'Instrument Serif', serif; font-size: 26px; font-weight: 400; color: black; }

        .icon-btn {
          padding: 6px; border: 1.5px solid transparent; background: none; cursor: pointer; color: #aaa;
          transition: color 0.15s, border-color 0.15s, box-shadow 0.1s;
          display: flex; align-items: center; justify-content: center;
        }
        .icon-btn:hover { color: black; border-color: black; box-shadow: 2px 2px 0 black; }
        .icon-btn.danger:hover { color: white; background: black; border-color: black; }

        .section-title {
          font-family: 'Caveat', cursive; font-size: 12px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase; color: #888;
          display: flex; align-items: center; gap: 6px; margin-bottom: 14px;
        }

        .modal-card { border: 2.5px solid black; box-shadow: 8px 8px 0px black; background: white; width: 100%; max-width: 480px; padding: 28px; }
        .modal-input {
          font-family: 'Caveat', cursive; font-size: 16px;
          border: 2px solid black; background: white; padding: 10px 14px;
          outline: none; width: 100%; transition: box-shadow 0.15s;
        }
        .modal-input:focus { box-shadow: 3px 3px 0 black; }
        .modal-input::placeholder { color: #bbb; }
        select.modal-input { appearance: none; cursor: pointer; }
        .modal-label {
          font-family: 'Caveat', cursive; font-size: 13px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; color: #888;
          display: block; margin-bottom: 6px;
        }

        .empty-state { border: 2.5px dashed black; padding: 64px 24px; text-align: center; background: white; }

        .fade-up { animation: fadeUp 0.5s ease forwards; opacity: 0; }
        .fade-up-1 { animation-delay: 0.08s; }
        .fade-up-2 { animation-delay: 0.16s; }
        .fade-up-3 { animation-delay: 0.24s; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="dash-noise-bg min-h-screen text-black flex flex-col pt-16">
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 fade-up">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StarDoodle className="w-5 h-5" />
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#888" }}>
                  {user?.fullName ? `Hi, ${user.fullName.split(" ")[0]} ✦` : "Workspace"}
                </span>
              </div>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "44px", lineHeight: 1.05, fontWeight: 400 }}>
                <em>Dashboard</em>
              </h1>
              <ScribbleUnderline />
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#888", marginTop: "6px" }}>
                create forms, manage fields & monitor submissions ✦
              </p>
            </div>

            <button className="scribble-btn-solid" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Form
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row mb-12 fade-up fade-up-1" style={{ border: "2.5px solid black", boxShadow: "6px 6px 0 black" }}>
            <div className="stat-card flex-1">
              <div className="section-title"><DiamondDoodle /> My Forms</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "40px", fontWeight: 400, lineHeight: 1 }}>
                {formsLoading ? "—" : totalForms}
              </div>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#888", marginTop: "6px" }}>forms created</p>
            </div>
            <div className="stat-card flex-1" style={{ borderLeft: "2.5px solid black" }}>
              <div className="section-title"><DiamondDoodle /> Published</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "40px", fontWeight: 400, lineHeight: 1 }}>
                {formsLoading ? "—" : (forms ?? []).filter(f => f.status === "published").length}
              </div>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#888", marginTop: "6px" }}>live forms</p>
            </div>
            <div className="stat-card flex-1" style={{ borderLeft: "2.5px solid black" }}>
              <div className="section-title"><DiamondDoodle /> Public</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "40px", fontWeight: 400, lineHeight: 1 }}>
                {formsLoading ? "—" : (forms ?? []).filter(f => f.visibilityMode === "public").length}
              </div>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#888", marginTop: "6px" }}>public forms</p>
            </div>
          </div>

          {/* Form Listing */}
          <div className="space-y-6 fade-up fade-up-2">
            {/* Filters + Search */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pb-4" style={{ borderBottom: "2px dashed #ddd" }}>
              <div className="flex items-center gap-1 p-1" style={{ border: "2px solid black", background: "white", boxShadow: "2px 2px 0 black" }}>
                {["all", "published", "draft", "archived"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-btn ${activeTab === tab ? "active" : ""}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Loading state */}
            {formsLoading && (
              <div className="flex items-center justify-center py-20">
                <Spinner />
              </div>
            )}

            {/* Cards grid */}
            {!formsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredForms.map((form) => (
                  <div key={form.id} className="card-border-soft p-6 flex flex-col justify-between space-y-5">
                    {/* Top row */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`status-badge ${form.status}`}>
                          {form.status === "published" && <Globe className="h-3 w-3" />}
                          {form.status === "draft" && <Lock className="h-3 w-3" />}
                          {form.status === "unpublished" && <Eye className="h-3 w-3" />}
                          {form.status === "archived" && <Eye className="h-3 w-3" />}
                          {form.status}
                        </span>
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", color: "#aaa" }}>
                          {form.visibilityMode}
                        </span>
                      </div>
                      <Link href={`/forms/${form.id}/edit`} className="form-card-title block">
                        {form.title}
                      </Link>
                      {form.description && (
                        <p style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#888" }}>
                          {form.description}
                        </p>
                      )}
                      <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#bbb" }}>
                        Expires {formatDate(form.expiresAt)}
                      </p>
                    </div>

                    {/* Slug */}
                    <div className="py-2 px-3" style={{ background: "#f9f8f5", border: "1.5px dashed #ddd", fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#888" }}>
                      /forms/{form.slug}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Link href={`/forms/${form.id}/edit`} className="scribble-btn-outline">
                          <Pencil className="h-3.5 w-3.5" />
                          Edit Fields
                        </Link>
                        <Link href={`/forms/${form.id}/submissions`} className="scribble-btn-outline">
                          <BarChart4 className="h-3.5 w-3.5" />
                          Submissions
                        </Link>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleCopyLink(form.slug)} className="icon-btn" title="Copy link">
                          {copiedId === form.slug ? <Check className="h-4 w-4" style={{ color: "black" }} /> : <Copy className="h-4 w-4" />}
                        </button>
                        <Link href={`/forms/${form.slug}`} target="_blank" className="icon-btn" title="View live form">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteForm(form.id, form.title)}
                          className="icon-btn danger"
                          title="Delete form"
                          disabled={deletingId === form.id}
                        >
                          {deletingId === form.id ? <Spinner /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!formsLoading && filteredForms.length === 0 && (
              <div className="empty-state">
                <Layout className="h-8 w-8 mx-auto mb-3" style={{ opacity: 0.2 }} />
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "18px", color: "#aaa", marginBottom: "16px" }}>
                  {(forms ?? []).length === 0 ? "No forms yet. Create your first one!" : "No forms match that filter."}
                </p>
                {(forms ?? []).length === 0 && (
                  <button className="scribble-btn-solid mx-auto" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Create First Form
                  </button>
                )}
              </div>
            )}
          </div>

        </main>

        {/* Create Form Modal */}
        {isCreateModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setIsCreateModalOpen(false); }}
          >
            <div className="modal-card fade-up">
              <div className="flex items-center justify-between mb-6" style={{ borderBottom: "2px dashed #ddd", paddingBottom: "14px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "24px", fontStyle: "italic", fontWeight: 400 }}>
                    Create New Form
                  </h3>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#aaa" }}>fill in the details below ✦</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="icon-btn">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateForm}>
                <div className="mb-4">
                  <label className="modal-label">Form Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Customer Feedback 2026"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="modal-input"
                  />
                </div>

                <div className="mb-4">
                  <label className="modal-label">Description</label>
                  <input
                    type="text"
                    placeholder="Short description (optional)"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="modal-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="modal-label">Visibility</label>
                    <select value={newVisibility} onChange={(e) => setNewVisibility(e.target.value as any)} className="modal-input">
                      <option value="public">Public</option>
                      <option value="unlisted">Unlisted</option>
                    </select>
                  </div>
                  <div>
                    <label className="modal-label">Status</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)} className="modal-input">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3" style={{ borderTop: "2px dashed #ddd", paddingTop: "16px" }}>
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="scribble-btn-outline">
                    Cancel
                  </button>
                  <button type="submit" disabled={isCreating || !newTitle.trim()} className="scribble-btn-solid">
                    {isCreating ? <><Spinner white /> Creating...</> : "Create Form →"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

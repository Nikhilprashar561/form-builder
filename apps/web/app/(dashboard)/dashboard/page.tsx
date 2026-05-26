"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  BarChart4, 
  ExternalLink, 
  Copy, 
  Eye, 
  Search, 
  Sparkles, 
  Check, 
  Lock, 
  Globe, 
  Layout, 
  FolderPlus,
  X
} from "lucide-react";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

// Mock Seeded Forms
const INITIAL_FORMS = [
  {
    id: "startup-pitch",
    title: "Startup Feedback Form",
    theme: "Startup Clean",
    views: 450,
    responses: 189,
    status: "Public", // Public / Unlisted / Draft
    updatedAt: "2 hours ago",
    category: "Business"
  },
  {
    id: "anime-tier",
    title: "Anime & Manga Tier Survey",
    theme: "Demon Slayer Retro",
    views: 890,
    responses: 521,
    status: "Public",
    updatedAt: "1 day ago",
    category: "Entertainment"
  },
  {
    id: "nextos-reqs",
    title: "NextOS Feature Requests",
    theme: "Terminal OS",
    views: 120,
    responses: 42,
    status: "Unlisted",
    updatedAt: "3 days ago",
    category: "Tech"
  },
  {
    id: "gaming-event",
    title: "E-Sports Tournament Signup",
    theme: "Cyberpunk Red",
    views: 0,
    responses: 0,
    status: "Draft",
    updatedAt: "Just now",
    category: "Gaming"
  }
];
// Mock Templates
const TEMPLATES = [
  { title: "Customer Satisfaction Survey", category: "Feedback", theme: "Minimal White" },
  { title: "Product Launch Waiting List", category: "Leads", theme: "Tech Mono" },
  { title: "Developer Event Registration", category: "Events", theme: "Terminal Dark" },
  { title: "Retro Gaming Quiz", category: "Games", theme: "Cyberpunk Red" }
];
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all"); // all, public, unlisted, draft
  const [forms, setForms] = useState(INITIAL_FORMS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Create Form Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState("");
  const [newFormTheme, setNewFormTheme] = useState("Minimal White");
  const [newFormVisibility, setNewFormVisibility] = useState("Public");
  // Copy Link helper
  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/forms/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  // Toggle Visibility Status helper
  const toggleStatus = (id: string) => {
    setForms(forms.map(f => {
      if (f.id === id) {
        const nextStatus = f.status === "Public" ? "Unlisted" : f.status === "Unlisted" ? "Draft" : "Public";
        return { ...f, status: nextStatus };
      }
      return f;
    }));
  };
  // Create Form mock helper
  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormTitle.trim()) return;
    const newId = newFormTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newForm = {
      id: newId,
      title: newFormTitle,
      theme: newFormTheme,
      views: 0,
      responses: 0,
      status: newFormVisibility,
      updatedAt: "Just now",
      category: "Custom"
    };
    setForms([newForm, ...forms]);
    setIsCreateModalOpen(false);
    setNewFormTitle("");
  };
  // Filter forms
  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && form.status.toLowerCase() === activeTab.toLowerCase();
  });
  return (
    <div className="min-h-screen bg-white text-black flex flex-col pt-16">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {/* Dashboard Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 animate-fade-in">
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight">
              Dashboard
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Create forms, customize rules, and monitor respondent analytics.
            </p>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            <span>Create Form</span>
          </button>
        </div>
        {/* Stats Summary Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-black rounded-xl overflow-hidden mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b sm:border-b-0 sm:border-r border-black">
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Total Submissions</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold font-mono">752</span>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">+12% this week</span>
            </div>
          </div>
          <div className="p-6 border-b sm:border-b-0 sm:border-r border-black">
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Total Views</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold font-mono">1,460</span>
              <span className="text-xs text-zinc-400 font-mono">51.5% Completion</span>
            </div>
          </div>
          <div className="p-6">
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Active Schemas</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold font-mono">{forms.length}</span>
              <span className="text-xs text-zinc-400 font-mono">Forms published</span>
            </div>
          </div>
        </div>
        {/* Form Listing Workspace */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pb-4 border-b border-zinc-100">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 p-1 rounded-lg self-start">
              {["all", "public", "unlisted", "draft"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTab === tab 
                      ? "bg-white text-black border border-zinc-200 shadow-sm" 
                      : "text-zinc-500 hover:text-black"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Search Input */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 hover:border-zinc-300 focus:border-black focus:outline-none rounded-lg text-sm transition-colors"
              />
            </div>
          </div>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredForms.map((form) => (
              <div 
                key={form.id} 
                className="group border border-zinc-200 hover:border-black p-6 rounded-xl bg-white transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-zinc-50 px-2 py-0.5 rounded text-zinc-500 border border-zinc-100">
                      {form.theme}
                    </span>
                    <button 
                      onClick={() => toggleStatus(form.id)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                        form.status === "Public" 
                          ? "bg-black text-white border-black" 
                          : form.status === "Unlisted" 
                          ? "bg-zinc-50 text-zinc-600 border-zinc-200 border-dashed" 
                          : "bg-zinc-100 text-zinc-400 border-zinc-200"
                      }`}
                      title="Click to cycle status"
                    >
                      {form.status === "Public" && <Globe className="h-2.5 w-2.5" />}
                      {form.status === "Unlisted" && <Eye className="h-2.5 w-2.5" />}
                      {form.status === "Draft" && <Lock className="h-2.5 w-2.5" />}
                      {form.status}
                    </button>
                  </div>
                  <h3 className="font-display text-xl font-bold hover:underline">
                    <Link href={`/forms/${form.id}/edit`}>{form.title}</Link>
                  </h3>
                  <p className="text-xs text-zinc-400">Edited {form.updatedAt}</p>
                </div>
                {/* Card metrics */}
                <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-zinc-50">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Views</span>
                    <p className="text-lg font-bold font-mono">{form.views}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Submissions</span>
                    <p className="text-lg font-bold font-mono">{form.responses}</p>
                  </div>
                </div>
                {/* Card controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-2">
                    <Link
                      href={`/forms/${form.id}/edit`}
                      className="px-3.5 py-1.5 border border-zinc-200 hover:border-black rounded text-xs font-semibold transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/forms/${form.id}/analytics`}
                      className="px-3.5 py-1.5 border border-zinc-200 hover:border-black rounded text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <BarChart4 className="h-3 w-3" />
                      <span>Analytics</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(form.id)}
                      className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-50 rounded transition-colors"
                      title="Copy public link"
                    >
                      {copiedId === form.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <Link
                      href={`/forms/${form.id}`}
                      target="_blank"
                      className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-50 rounded transition-colors"
                      title="View live public form"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredForms.length === 0 && (
            <div className="text-center py-16 border border-dashed border-zinc-200 rounded-xl space-y-3">
              <Layout className="h-8 w-8 text-zinc-300 mx-auto" />
              <p className="text-zinc-500 text-sm">No forms found matching that filter.</p>
            </div>
          )}
        </div>
        {/* Templates Gallery & Seeded Data Preview */}
        <div className="mt-20 pt-12 border-t border-zinc-100">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-black" />
            <h2 className="font-display text-2xl font-extrabold">Seeded Templates Gallery</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.map((tmpl, idx) => (
              <div 
                key={idx} 
                className="border border-zinc-100 hover:border-black p-5 rounded-lg bg-zinc-50/50 flex flex-col justify-between h-40 transition-colors group"
              >
                <div>
                  <span className="text-[9px] font-mono uppercase bg-zinc-200 px-2 py-0.5 rounded text-zinc-600">
                    {tmpl.category}
                  </span>
                  <h4 className="font-bold text-sm text-zinc-800 mt-3 group-hover:underline cursor-pointer">
                    {tmpl.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-1">Theme: {tmpl.theme}</p>
                </div>
                
                <button
                  onClick={() => {
                    const newId = tmpl.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    setForms([...forms, {
                      id: newId,
                      title: tmpl.title,
                      theme: tmpl.theme,
                      views: 0,
                      responses: 0,
                      status: "Public",
                      updatedAt: "Just now",
                      category: tmpl.category
                    }]);
                  }}
                  className="text-xs font-semibold text-black flex items-center gap-1 hover:underline self-start"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  <span>Use Template</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Create Form Dialog Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border-2 border-black w-full max-w-md rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-display text-lg font-bold">Create New Schema</h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 hover:bg-zinc-50 rounded text-zinc-400 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateForm} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Form Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Developer Survey 2026"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 hover:border-zinc-300 focus:border-black focus:outline-none rounded-lg text-sm transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Theme Preset</label>
                  <select 
                    value={newFormTheme} 
                    onChange={(e) => setNewFormTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 hover:border-zinc-300 focus:border-black focus:outline-none rounded-lg text-sm bg-white"
                  >
                    <option>Minimal White</option>
                    <option>Terminal OS</option>
                    <option>Demon Slayer Retro</option>
                    <option>Cyberpunk Red</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Visibility</label>
                  <select 
                    value={newFormVisibility} 
                    onChange={(e) => setNewFormVisibility(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 hover:border-zinc-300 focus:border-black focus:outline-none rounded-lg text-sm bg-white"
                  >
                    <option>Public</option>
                    <option>Unlisted</option>
                    <option>Draft</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 hover:border-black rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Create Schema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

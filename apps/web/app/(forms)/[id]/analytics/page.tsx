"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Check, 
  Eye, 
  Inbox, 
  Percent, 
  Trash2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
// Seeded Submissions Data for charts
const CHART_DATA = [
  { date: "May 18", Submissions: 12 },
  { date: "May 19", Submissions: 25 },
  { date: "May 20", Submissions: 18 },
  { date: "May 21", Submissions: 42 },
  { date: "May 22", Submissions: 50 },
  { date: "May 23", Submissions: 35 },
  { date: "May 24", Submissions: 61 }
];
// Seeded Submission Records
const SEEDED_RESPONSES = [
  { id: "resp-1", date: "May 24, 2026, 14:32", email: "alice@yc.com", name: "YC Pitching Coach", funding: "Pre-seed / Angel", rating: 5 },
  { id: "resp-2", date: "May 24, 2026, 11:15", email: "bob@seq.com", name: "Sequoia Ventures", funding: "Series A or higher", rating: 4 },
  { id: "resp-3", date: "May 23, 2026, 18:04", email: "charlie@tech.co", name: "Vercel Deployers", funding: "Bootstrap / Self-funded", rating: 5 },
  { id: "resp-4", date: "May 23, 2026, 09:22", email: "dave@os.io", name: "NextOS Kernel Devs", funding: "Seed Round", rating: 5 },
  { id: "resp-5", date: "May 22, 2026, 16:51", email: "emma@star.ai", name: "StarAI Agents", funding: "Pre-seed / Angel", rating: 4 },
  { id: "resp-6", date: "May 22, 2026, 10:30", email: "frank@db.net", name: "Drizzle Schema Wizards", funding: "Bootstrap / Self-funded", rating: 3 }
];
export default function AnalyticsPage({ params }: { params: { id: string } }) {
  const formId = params.id || "startup-pitch";
  const [responses, setResponses] = useState(SEEDED_RESPONSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCSV, setCopiedCSV] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all"); // all, 5, 4, 3
  // Export CSV mock helper
  const handleExportCSV = () => {
    // Generate simple csv string in alert/copy
    const headers = "ID,Date,Email,Name,Funding,NPS_Rating\n";
    const rows = responses.map(r => `${r.id},${r.date},${r.email},${r.name},${r.funding},${r.rating}`).join("\n");
    navigator.clipboard.writeText(headers + rows);
    setCopiedCSV(true);
    setTimeout(() => setCopiedCSV(false), 2000);
  };
  // Delete Response mock helper
  const handleDeleteResponse = (id: string) => {
    setResponses(responses.filter(r => r.id !== id));
  };
  // Filter lists
  const filteredResponses = responses.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (ratingFilter === "all") return matchesSearch;
    return matchesSearch && r.rating === parseInt(ratingFilter);
  });
  return (
    <div className="min-h-screen bg-white text-black flex flex-col pt-16">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {/* Header Breadcrumbs */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard"
            className="p-1.5 border border-zinc-200 hover:border-black rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block">Metrics & Reports</span>
            <h1 className="font-display text-2xl font-extrabold tracking-tight flex items-center gap-2 mt-0.5">
              <span>Analytics for:</span>
              <span className="font-mono text-zinc-500 font-normal">{formId}</span>
            </h1>
          </div>
        </div>
        {/* Stats Metrics Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-4 border border-black rounded-xl overflow-hidden mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b sm:border-b-0 sm:border-r border-black">
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Total Submissions</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold font-mono">{responses.length}</span>
              <span className="text-xs text-zinc-400">responses saved</span>
            </div>
          </div>
          
          <div className="p-6 border-b sm:border-b-0 sm:border-r border-black">
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Form Views</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold font-mono">184</span>
              <span className="text-xs text-zinc-400">unique sessions</span>
            </div>
          </div>
          <div className="p-6 border-b sm:border-b-0 sm:border-r border-black">
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Completion Rate</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold font-mono">61.5%</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">High engagement</span>
            </div>
          </div>
          <div className="p-6">
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Avg. Rating</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold font-mono">4.33★</span>
              <span className="text-xs text-zinc-400">out of 5 stars</span>
            </div>
          </div>
        </div>
        {/* Charts & Interactive Submission Graph */}
        <div className="border border-zinc-200 rounded-xl p-6 bg-white space-y-4 mb-12">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h3 className="font-bold text-sm text-black">Submissions Trend</h3>
              <p className="text-xs text-zinc-400">Total form submissions captured daily</p>
            </div>
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Last 7 Days</span>
            </span>
          </div>
          <div className="h-[260px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0.00}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
                <XAxis dataKey="date" stroke="#A1A1AA" fontSize={11} fontClassName="font-mono" />
                <YAxis stroke="#A1A1AA" fontSize={11} fontClassName="font-mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#000000", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
                  itemStyle={{ color: "#000000" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Submissions" 
                  stroke="#000000" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSubmissions)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Responses Table Workspace */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="font-bold text-sm text-black">Individual Responses</h3>
              <p className="text-xs text-zinc-400">Inspect specific entries and validation statuses</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              {/* Rating Filter Dropdown */}
              <div className="relative">
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-zinc-200 hover:border-zinc-300 focus:border-black focus:outline-none rounded-lg text-xs bg-white font-semibold text-zinc-700 appearance-none"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5★ Rating</option>
                  <option value="4">4★ Rating</option>
                  <option value="3">3★ Rating</option>
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              </div>
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search email, name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-zinc-200 hover:border-zinc-300 focus:border-black focus:outline-none rounded-lg text-xs transition-colors"
                />
              </div>
              {/* CSV Exporter */}
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-black text-white hover:bg-zinc-800 rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                {copiedCSV ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                <span>{copiedCSV ? "CSV Copied!" : "Export CSV"}</span>
              </button>
            </div>
          </div>
          {/* Table Container */}
          <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-xs bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    <th className="py-3 px-4 font-semibold">Date & Time</th>
                    <th className="py-3 px-4 font-semibold">Respondent Name</th>
                    <th className="py-3 px-4 font-semibold">Respondent Email</th>
                    <th className="py-3 px-4 font-semibold">Funding Round</th>
                    <th className="py-3 px-4 font-semibold">NPS Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {filteredResponses.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-4 px-4 font-mono text-[11px] text-zinc-400">{item.date}</td>
                      <td className="py-4 px-4 font-bold text-zinc-800">{item.name}</td>
                      <td className="py-4 px-4 text-zinc-500">{item.email}</td>
                      <td className="py-4 px-4">
                        <span className="bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-[10px] text-zinc-600">
                          {item.funding}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-zinc-800">{item.rating} ★</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDeleteResponse(item.id)}
                          className="p-1 hover:text-red-600 rounded hover:bg-red-50 text-zinc-400 transition-colors"
                          title="Delete response entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredResponses.length === 0 && (
              <div className="text-center py-16 text-zinc-400 space-y-2">
                <Inbox className="h-8 w-8 mx-auto text-zinc-300" />
                <p className="text-xs">No response records match active search filters.</p>
              </div>
            )}
            {/* Pagination Controls */}
            {filteredResponses.length > 0 && (
              <div className="bg-zinc-50 border-t border-zinc-100 px-4 py-3 flex items-center justify-between text-xs text-zinc-400">
                <span>Showing 1-{filteredResponses.length} of {filteredResponses.length} entries</span>
                <div className="flex items-center gap-1">
                  <button disabled className="p-1 border border-zinc-200 rounded opacity-50 bg-white cursor-not-allowed">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button disabled className="p-1 border border-zinc-200 rounded opacity-50 bg-white cursor-not-allowed">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

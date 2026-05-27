"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Layers,
  Eye,
  Shield,
  Sliders,
  Check,
  ChevronRight,
  Command,
  FileCode,
  Gauge,
} from "lucide-react";

// ── Scribble SVG decorations ──────────────────────────────────────────────────

const ScribbleUnderline = ({ color = "black" }: { color?: string }) => (
  <svg viewBox="0 0 300 12" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8 C50 3, 100 11, 150 6 C200 1, 250 9, 298 5" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const StarDoodle = ({ className, color = "black" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={`inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);

const DiamondDoodle = ({ color = "black", className = "" }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 12 12" className={`w-2.5 h-2.5 inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1 L11 6 L6 11 L1 6 Z" stroke={color} strokeWidth="1.2" fill="none" />
  </svg>
);

const CornerScribble = ({ color = "black" }: { color?: string }) => (
  <svg viewBox="0 0 80 80" className="absolute -top-4 -right-4 w-14 h-14 opacity-20 pointer-events-none" fill="none">
    <path d="M10 70 Q40 10 70 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" />
    <path d="M20 75 Q50 30 75 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" />
    <circle cx="70" cy="10" r="3" fill={color} />
  </svg>
);

export default function NexFormLanding() {
  const [demoStep, setDemoStep] = useState(0);
  const [demoAnswers, setDemoAnswers] = useState({ name: "", role: "", rating: 0 });

  const demoQuestions = [
    { id: "name", question: "What's your name?", placeholder: "e.g. Satoshi Nakamoto", type: "text" },
    { id: "role", question: "What is your main objective?", type: "select", options: ["Build customer surveys", "Lead generation", "Collect feedback", "Just playing around"] },
    { id: "rating", question: "How would you rate this design?", type: "rating" },
  ];

  const handleDemoAnswer = (key: string, value: string | number) => {
    setDemoAnswers({ ...demoAnswers, [key]: value });
    setTimeout(() => setDemoStep(s => s + 1), demoStep < demoQuestions.length - 1 ? 300 : 400);
  };

  const resetDemo = () => {
    setDemoAnswers({ name: "", role: "", rating: 0 });
    setDemoStep(0);
  };

  const features = [
    { icon: <Sliders className="h-5 w-5" />, title: "Dynamic Form Builder", desc: "Visual block editor with text, numbers, dropdowns, ratings, dates, and validation rules. Generate schemas dynamically." },
    { icon: <Eye className="h-5 w-5" />, title: "Public vs Unlisted Forms", desc: "Public forms appear in the explore gallery. Unlisted forms are hidden and only accessible via a direct link." },
    { icon: <Gauge className="h-5 w-5" />, title: "Response Analytics", desc: "Track completion metrics, drop-offs, and inspect responses directly from your dashboard with one-click CSV exports." },
    { icon: <FileCode className="h-5 w-5" />, title: "Type-Safe & Seeded Stack", desc: "Powered by Next.js, tRPC, Zod, and Drizzle ORM. Seeded with demo templates for anime, events, and gaming surveys." },
    { icon: <Command className="h-5 w-5" />, title: "Scalar API Documentation", desc: "Expose dynamic tRPC operations inside a beautiful, structured Scalar API explorer sandbox out of the box." },
    { icon: <Shield className="h-5 w-5" />, title: "Spam Protection", desc: "Built-in rate limiting and submission security keeping public form links clean without requiring login." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .land-noise-bg {
          background-color: #f9f8f5;
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .dark-grid-bg {
          background-color: #0d0d0d;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .hero-badge {
          font-family: 'Caveat', cursive;
          font-size: 14px;
          font-weight: 600;
          border: 2px solid black;
          background: white;
          padding: 5px 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 2px 2px 0 black;
        }

        .scribble-btn-solid {
          font-family: 'Caveat', cursive;
          font-size: 18px;
          font-weight: 700;
          border: 2.5px solid black;
          background: black;
          color: white;
          padding: 12px 28px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: transform 0.1s, box-shadow 0.1s;
          box-shadow: 4px 4px 0px #555;
        }
        .scribble-btn-solid:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #333; }
        .scribble-btn-solid:active { transform: translate(1px,1px); }

        .scribble-btn-outline {
          font-family: 'Caveat', cursive;
          font-size: 18px;
          font-weight: 700;
          border: 2.5px solid black;
          background: white;
          color: black;
          padding: 12px 28px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: transform 0.1s, box-shadow 0.1s;
          box-shadow: 4px 4px 0px black;
        }
        .scribble-btn-outline:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 black; }

        .scribble-btn-outline-white {
          font-family: 'Caveat', cursive;
          font-size: 18px;
          font-weight: 700;
          border: 2.5px solid white;
          background: transparent;
          color: white;
          padding: 12px 28px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: transform 0.1s, box-shadow 0.1s;
          box-shadow: 4px 4px 0px rgba(255,255,255,0.3);
        }
        .scribble-btn-outline-white:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 rgba(255,255,255,0.5); }

        .demo-card {
          border: 2.5px solid black;
          box-shadow: 8px 8px 0px black;
          background: white;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .demo-card:hover { transform: translate(-2px,-2px); box-shadow: 10px 10px 0 black; }

        .demo-input {
          font-family: 'Caveat', cursive;
          font-size: 18px;
          border: none;
          border-bottom: 2px solid black;
          background: transparent;
          outline: none;
          width: 100%;
          padding: 6px 0;
          color: black;
          transition: border-color 0.15s;
        }
        .demo-input:focus { border-bottom: 2.5px solid black; }
        .demo-input::placeholder { color: #ccc; }

        .demo-option {
          font-family: 'Caveat', cursive;
          font-size: 16px;
          font-weight: 600;
          width: 100%;
          text-align: left;
          background: white;
          border: 2px solid black;
          padding: 10px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.15s, transform 0.1s, box-shadow 0.1s;
          box-shadow: 2px 2px 0 black;
        }
        .demo-option:hover { background: black; color: white; transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #333; }

        .rating-btn {
          font-family: 'Instrument Serif', serif;
          font-size: 18px;
          border: 2px solid black;
          background: white;
          width: 46px;
          height: 46px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.1s, transform 0.1s, box-shadow 0.1s;
          box-shadow: 2px 2px 0 black;
        }
        .rating-btn:hover { background: black; color: white; transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #333; }

        .feature-card {
          border: 2.5px solid black;
          background: white;
          padding: 28px;
          position: relative;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 4px 4px 0 black;
        }
        .feature-card:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 black; }

        .feature-icon {
          width: 44px;
          height: 44px;
          border: 2px solid black;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          transition: background 0.15s, color 0.15s;
          margin-bottom: 16px;
        }
        .feature-card:hover .feature-icon { background: black; color: white; }

        .pricing-card {
          border: 2.5px solid black;
          background: white;
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
          position: relative;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 5px 5px 0 black;
        }
        .pricing-card:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 black; }
        .pricing-card.featured { background: black; color: white; }
        .pricing-card.featured .check-icon { filter: invert(1); }

        .plan-badge {
          font-family: 'Caveat', cursive;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 4px 12px;
          border: 1.5px solid currentColor;
          display: inline-block;
          margin-bottom: 10px;
        }

        .price-num {
          font-family: 'Instrument Serif', serif;
          font-size: 52px;
          font-weight: 400;
          line-height: 1;
        }

        .check-row {
          font-family: 'Caveat', cursive;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-eyebrow {
          font-family: 'Caveat', cursive;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .kbd-hint {
          font-family: 'Caveat', cursive;
          font-size: 12px;
          border: 1.5px solid #ddd;
          padding: 2px 8px;
          color: #aaa;
          display: inline-block;
        }

        .progress-scribble {
          height: 6px;
          border: 1.5px solid black;
          background: white;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: black;
          transition: width 0.4s ease;
        }

        .fade-up { animation: fadeUp 0.55s ease forwards; opacity: 0; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.2s; }
        .fade-up-3 { animation-delay: 0.3s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative w-full text-black overflow-hidden pt-16">

        {/* ── Hero ── */}
        <section className="land-noise-bg relative">
          <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 flex flex-col lg:flex-row items-center justify-between gap-14">

            {/* Left copy */}
            <div className="flex-1 space-y-7 text-left max-w-2xl fade-up">
              <div className="hero-badge">
                <StarDoodle className="w-4 h-4" />
                Next-gen Form Builder SaaS
              </div>

              <div>
                <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(42px,6vw,72px)", lineHeight: 1.05, fontWeight: 400 }}>
                  Forms built for the<br /><em>modern era</em>.
                </h1>
                <ScribbleUnderline />
              </div>

              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "18px", color: "#666", lineHeight: 1.6 }}>
                Create high-converting, Typeform-style forms in minutes. Set schemas, configure validation rules, and share public or unlisted links. Built for developer productivity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="scribble-btn-solid">
                  Start Building Free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/dashboard" className="scribble-btn-outline">
                  Explore Demo
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-5 pt-4" style={{ borderTop: "1.5px dashed #ddd" }}>
                <div className="flex -space-x-1.5">
                  {["OS", "AN", "GM"].map((i, idx) => (
                    <div key={idx} style={{ width: 28, height: 28, border: "2px solid black", background: idx === 2 ? "black" : "white", color: idx === 2 ? "white" : "black", fontFamily: "'Caveat', cursive", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {i}
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#888" }}>
                  Seeded with themes for <strong style={{ color: "black" }}>Anime, Games, Events</strong> and more ✦
                </p>
              </div>
            </div>

            {/* Demo widget */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg fade-up fade-up-1">
              <div className="demo-card">
                {/* Browser bar */}
                <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "2.5px solid black" }}>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2].map(i => <span key={i} style={{ width: 12, height: 12, border: "1.5px solid black", display: "block", background: "white" }} />)}
                  </div>
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#aaa" }}>demo-form.nexform.io</span>
                  <span style={{ width: 24 }} />
                </div>

                {/* Form body */}
                <div className="p-8" style={{ minHeight: 300 }}>
                  {demoStep < demoQuestions.length ? (
                    <div>
                      <div className="flex items-start gap-3 mb-6">
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", fontWeight: 700, color: "#aaa", paddingTop: "2px" }}>0{demoStep + 1} →</span>
                        <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "22px", fontStyle: "italic", fontWeight: 400, color: "black" }}>
                          {demoQuestions[demoStep]!.question}
                        </h3>
                      </div>

                      {demoQuestions[demoStep]!.type === "text" && (
                        <div className="pl-8">
                          <input
                            type="text"
                            placeholder={demoQuestions[demoStep]!.placeholder}
                            value={demoAnswers.name}
                            autoFocus
                            onChange={(e) => setDemoAnswers({ ...demoAnswers, name: e.target.value })}
                            onKeyDown={(e) => { if (e.key === "Enter" && demoAnswers.name.trim()) handleDemoAnswer("name", demoAnswers.name); }}
                            className="demo-input"
                          />
                          <div className="mt-3">
                            <span className="kbd-hint">ENTER</span>
                            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#aaa", marginLeft: 8 }}>to proceed</span>
                          </div>
                        </div>
                      )}

                      {demoQuestions[demoStep]!.type === "select" && (
                        <div className="pl-8 flex flex-col gap-2">
                          {demoQuestions[demoStep]!.options?.map((opt, idx) => (
                            <button key={idx} onClick={() => handleDemoAnswer("role", opt)} className="demo-option">
                              <span>{opt}</span>
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          ))}
                        </div>
                      )}

                      {demoQuestions[demoStep]!.type === "rating" && (
                        <div className="pl-8">
                          <div className="flex gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button key={star} onClick={() => handleDemoAnswer("rating", star)} className="rating-btn">
                                {star}★
                              </button>
                            ))}
                          </div>
                          <p style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#aaa" }}>Click a number to submit</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div style={{ width: 52, height: 52, border: "2.5px solid black", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "3px 3px 0 black" }}>
                        <Check className="h-6 w-6" />
                      </div>
                      <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "22px", fontStyle: "italic", fontWeight: 400, marginBottom: 8 }}>
                        Thank you, {demoAnswers.name || "friend"}!
                      </h3>
                      <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#888", marginBottom: 16 }}>
                        Role: <strong style={{ color: "black" }}>"{demoAnswers.role}"</strong> · Rating: <strong style={{ color: "black" }}>{demoAnswers.rating}/5</strong>
                      </p>
                      <button onClick={resetDemo} style={{ fontFamily: "'Caveat', cursive", fontSize: "14px", color: "#aaa", background: "none", border: "none", cursor: "pointer", textDecoration: "underline wavy black", textUnderlineOffset: "3px" }}>
                        Try again →
                      </button>
                    </div>
                  )}

                  {/* Progress */}
                  <div className="mt-8 flex items-center justify-between" style={{ borderTop: "1.5px dashed #ddd", paddingTop: 14 }}>
                    <span style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", color: "#aaa" }}>Progress</span>
                    <div className="progress-scribble" style={{ width: 120 }}>
                      <div className="progress-fill" style={{ width: `${(demoStep / demoQuestions.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{ background: "white", borderTop: "2.5px solid black", borderBottom: "2.5px solid black" }}>
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="section-eyebrow justify-center" style={{ color: "#888" }}>
                <DiamondDoodle /> Features <DiamondDoodle />
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "38px", fontWeight: 400 }}>
                Everything you need in a<br /><em>modern form builder</em>
              </h2>
              <ScribbleUnderline />
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", color: "#888", marginTop: 10 }}>
                Build responsive forms, view real-time stats, configure developer APIs instantly ✦
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, idx) => (
                <div key={idx} className="feature-card">
                  <CornerScribble />
                  <div className="feature-icon">{f.icon}</div>
                  <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "20px", fontStyle: "italic", fontWeight: 400, marginBottom: 10 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#777", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="land-noise-bg">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="section-eyebrow justify-center" style={{ color: "#888" }}>
                <DiamondDoodle /> Pricing <DiamondDoodle />
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "38px", fontWeight: 400 }}>
                Simple, <em>honest</em> pricing
              </h2>
              <ScribbleUnderline />
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", color: "#888", marginTop: 10 }}>
                Start for free or upgrade to support advanced workflows ✦
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 max-w-4xl mx-auto">
              {/* Free */}
              <div className="flex-1 pricing-card">
                <div>
                  <span className="plan-badge">Starter</span>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="price-num">$0</span>
                    <span style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", color: "#888" }}> / month</span>
                  </div>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#888", marginBottom: 20 }}>
                    For developers and creators test-driving the builder.
                  </p>
                  <div style={{ borderTop: "1.5px dashed #ddd", paddingTop: 16 }} className="flex flex-col gap-3">
                    {["Up to 3 Active Forms", "Public & Unlisted Visibilities", "100 Responses per Form"].map(item => (
                      <div key={item} className="check-row"><Check className="h-4 w-4 check-icon shrink-0" />{item}</div>
                    ))}
                    <div className="check-row" style={{ color: "#ccc", textDecoration: "line-through" }}>
                      <Check className="h-4 w-4 shrink-0 opacity-20" />Conditional Form Logic
                    </div>
                  </div>
                </div>
                <Link href="/sign-up" className="scribble-btn-outline" style={{ width: "100%", justifyContent: "center" }}>
                  Get Started
                </Link>
              </div>

              {/* Pro */}
              <div className="flex-1 pricing-card featured">
                <CornerScribble color="white" />
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="plan-badge" style={{ borderColor: "white", color: "white" }}>Pro Creator</span>
                    <span style={{ fontFamily: "'Caveat', cursive", fontSize: "12px", fontWeight: 700, background: "white", color: "black", padding: "3px 10px", letterSpacing: "1px" }}>
                      ✦ POPULAR
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="price-num">$19</span>
                    <span style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", color: "#888" }}> / month</span>
                  </div>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: "15px", color: "#aaa", marginBottom: 20 }}>
                    For active creators, agencies, and operations.
                  </p>
                  <div style={{ borderTop: "1.5px dashed #555", paddingTop: 16 }} className="flex flex-col gap-3">
                    {["Unlimited Active Forms", "Public, Unlisted & Password-protected", "Unlimited Responses", "Conditional Question Logic", "Scalar API & CSV Exports"].map(item => (
                      <div key={item} className="check-row" style={{ color: "white" }}>
                        <Check className="h-4 w-4 shrink-0" />{item}
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/sign-up" className="scribble-btn-solid" style={{ background: "white", color: "black", border: "2.5px solid white", boxShadow: "4px 4px 0 rgba(255,255,255,0.3)", width: "100%", justifyContent: "center" }}>
                  Get Pro Now →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="dark-grid-bg" style={{ borderTop: "2.5px solid black" }}>
          <div className="max-w-4xl mx-auto text-center px-6 py-24">
            <div className="section-eyebrow justify-center" style={{ color: "#555" }}>
              <DiamondDoodle color="white" className="opacity-40" />
              <span style={{ color: "#555" }}>get started</span>
              <DiamondDoodle color="white" className="opacity-40" />
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 400, color: "white", lineHeight: 1.1, marginBottom: 8 }}>
              Ready to build forms<br />users actually <em>enjoy</em>?
            </h2>
            <div style={{ maxWidth: 300, margin: "0 auto 16px" }}>
              <ScribbleUnderline color="white" />
            </div>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "17px", color: "#666", marginBottom: 32, maxWidth: 420, margin: "12px auto 32px" }}>
              Create an account in seconds. Zero credit card required to start designing ✦
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up" className="scribble-btn-solid" style={{ background: "white", color: "black", border: "2.5px solid white", boxShadow: "4px 4px 0 rgba(255,255,255,0.25)" }}>
                Sign Up Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="scribble-btn-outline-white">
                Explore Seeded Demo
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
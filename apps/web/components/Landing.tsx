"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Eye, 
  Share2, 
  Shield, 
  Sliders, 
  Check, 
  ChevronRight, 
  Command,
  HelpCircle,
  FileCode,
  Gauge
} from "lucide-react";
export default function NexFormLanding() {
  // State for interactive form demo on landing page
  const [demoStep, setDemoStep] = useState(0);
  const [demoAnswers, setDemoAnswers] = useState({
    name: "",
    role: "",
    rating: 5,
  });
  const demoQuestions = [
    {
      id: "name",
      question: "What's your name?",
      placeholder: "e.g. Satoshi Nakamoto",
      type: "text",
    },
    {
      id: "role",
      question: "What is your main objective?",
      type: "select",
      options: ["Build customer surveys", "Lead generation", "Collect feedback", "Just playing around"],
    },
    {
      id: "rating",
      question: "How would you rate this design?",
      type: "rating",
    }
  ];
  const handleDemoAnswer = (key: string, value: any) => {
    setDemoAnswers({ ...demoAnswers, [key]: value });
    if (demoStep < demoQuestions.length - 1) {
      setTimeout(() => setDemoStep(demoStep + 1), 300);
    } else {
      setTimeout(() => setDemoStep(demoStep + 1), 400);
    }
  };
  const resetDemo = () => {
    setDemoAnswers({ name: "", role: "", rating: 5 });
    setDemoStep(0);
  };
  return (
    <div className="relative w-full bg-white text-black overflow-hidden font-sans pt-16">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-left max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-600 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-black" />
            <span>Next-gen Form Builder SaaS</span>
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-black">
            Forms built for the <span className="underline decoration-2 underline-offset-8">modern era</span>.
          </h1>
          <p className="text-zinc-500 text-lg sm:text-xl font-light leading-relaxed">
            Create high-converting, Typeform-style forms in minutes. Set schemas, configure validation rules, and share public or unlisted links. Built for developer productivity.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link 
              href="/sign-up"
              className="group flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-medium text-base transition-all duration-300 hover:bg-zinc-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black"
            >
              Start Building Free 
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center bg-white text-black border border-zinc-200 hover:border-black px-8 py-4 rounded-lg font-medium text-base transition-all duration-300"
            >
              Explore Demo Dashboard
            </Link>
          </div>
          {/* Seeded Data Banner */}
          <div className="flex items-center gap-6 pt-6 border-t border-zinc-100 text-xs text-zinc-400">
            <div className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center font-bold text-[8px] text-zinc-600">OS</span>
              <span className="w-6 h-6 rounded-full bg-zinc-300 border-2 border-white flex items-center justify-center font-bold text-[8px] text-zinc-700">AN</span>
              <span className="w-6 h-6 rounded-full bg-zinc-400 border-2 border-white flex items-center justify-center font-bold text-[8px] text-white">GM</span>
            </div>
            <p>Seeded with themes for <strong>Anime, Games, Events</strong> and more.</p>
          </div>
        </div>
        {/* Live Mockup Widget */}
        <div className="flex-1 w-full max-w-md lg:max-w-lg">
          <div className="relative rounded-2xl border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 hover:scale-[1.01]">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-zinc-100 border border-black" />
                <span className="w-3.5 h-3.5 rounded-full bg-zinc-100 border border-black" />
                <span className="w-3.5 h-3.5 rounded-full bg-zinc-100 border border-black" />
              </div>
              <span className="font-mono text-xs text-zinc-400">demo-form.nexform.io</span>
              <span className="w-6" />
            </div>
            {/* Form body */}
            <div className="p-8 min-h-[300px] flex flex-col justify-between">
              {demoStep < demoQuestions.length ? (
                <div className="space-y-6 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-zinc-400 font-bold">0{demoStep + 1} ➔</span>
                    <h3 className="text-xl font-bold text-black">
                      {demoQuestions[demoStep].question}
                    </h3>
                  </div>
                  {/* Text Input */}
                  {demoQuestions[demoStep].type === "text" && (
                    <div className="pl-8">
                      <input 
                        type="text" 
                        placeholder={demoQuestions[demoStep].placeholder}
                        value={demoAnswers.name}
                        onChange={(e) => setDemoAnswers({ ...demoAnswers, name: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && demoAnswers.name.trim()) {
                            handleDemoAnswer("name", demoAnswers.name);
                          }
                        }}
                        className="w-full border-b border-black py-2 focus:border-b-2 focus:outline-none font-sans text-lg text-black placeholder:text-zinc-300"
                        autoFocus
                      />
                      <div className="mt-3 flex items-center gap-2 text-zinc-400 text-xs">
                        <span className="border border-zinc-200 px-1.5 py-0.5 rounded font-mono text-[9px]">ENTER</span>
                        <span>to proceed</span>
                      </div>
                    </div>
                  )}
                  {/* Select Input */}
                  {demoQuestions[demoStep].type === "select" && (
                    <div className="pl-8 space-y-2">
                      {demoQuestions[demoStep].options?.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleDemoAnswer("role", option)}
                          className="w-full text-left px-4 py-3 border border-zinc-200 hover:border-black rounded-lg transition-all duration-200 font-medium text-sm flex items-center justify-between group"
                        >
                          <span>{option}</span>
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Rating Input */}
                  {demoQuestions[demoStep].type === "rating" && (
                    <div className="pl-8 space-y-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleDemoAnswer("rating", star)}
                            className="p-2 border border-zinc-200 hover:border-black rounded-md transition-all duration-200 font-mono text-sm hover:scale-105"
                          >
                            {star}★
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-zinc-400">Click a number to submit</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 text-center py-8 animate-fade-in">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black bg-zinc-50 mb-2">
                    <Check className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold">Thank you, {demoAnswers.name || "friend"}!</h3>
                  <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                    You submitted response with role <strong className="text-black">"{demoAnswers.role}"</strong> and rating <strong className="text-black">{demoAnswers.rating}/5</strong>.
                  </p>
                  <button 
                    onClick={resetDemo}
                    className="text-xs text-zinc-400 underline hover:text-black font-medium transition-colors"
                  >
                    Try the Demo Form again
                  </button>
                </div>
              )}
              {/* Footer status inside card */}
              <div className="border-t border-zinc-100 pt-4 mt-6 flex items-center justify-between text-xs text-zinc-400">
                <span>Progress</span>
                <div className="w-32 h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black transition-all duration-500" 
                    style={{ width: `${(demoStep / demoQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Feature Showcase Grid */}
      <section className="bg-zinc-50 border-t border-zinc-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-black">
              Everything you need in a modern SaaS Form Builder
            </h2>
            <p className="text-zinc-500 font-light">
              Build responsive dynamic forms, view real-time statistics, and configure developer APIs instantly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-4 hover:border-black transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Sliders className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-black">Dynamic Form Builder</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Visual block editor with multiple inputs: text, numbers, dropdowns, ratings, dates, and validation rules. Generate schemas dynamically.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-4 hover:border-black transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-black">Public vs Unlisted Forms</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Choose form visibility. Public forms appear in the explore gallery. Unlisted forms are hidden and only accessible via a direct link.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-4 hover:border-black transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Gauge className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-black">Response Analytics</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Track completion metrics, drop-offs, and inspect responses directly from your dashboard. Ready with one-click CSV exports.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-4 hover:border-black transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <FileCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-black">Type-Safe & Seeded Stack</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Powered by Next.js, tRPC, Zod, and Drizzle ORM. Seeded with demo templates for movie logs, tech events, and gaming surveys.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-4 hover:border-black transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Command className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-black">Scalar API Documentation</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Expose dynamic tRPC operations inside a beautiful, structured Scalar API explorer sandbox out of the box.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-4 hover:border-black transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-black">Spam Protection</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Built-in rate limiting and submission security keeping public form links clean without requiring login.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Brutalist Pricing Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-black">
            Simple, honest pricing
          </h2>
          <p className="text-zinc-500 font-light">
            Start building for free or upgrade to support advanced workflows.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="flex-1 bg-white border border-zinc-200 p-8 rounded-2xl flex flex-col justify-between space-y-8 hover:border-zinc-400 transition-colors">
            <div className="space-y-4">
              <span className="text-zinc-400 text-xs font-mono tracking-widest uppercase">Basic Access</span>
              <h3 className="text-2xl font-bold">Starter Plan</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-mono">$0</span>
                <span className="text-zinc-400 text-sm">/ month</span>
              </div>
              <p className="text-zinc-500 text-sm">
                For developers and creators test-driving Typeform-style builder tools.
              </p>
              <hr className="border-zinc-100" />
              <ul className="space-y-3 text-sm text-zinc-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-black shrink-0" />
                  <span>Up to 3 Active Forms</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-black shrink-0" />
                  <span>Public & Unlisted Visibilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-black shrink-0" />
                  <span>100 Responses per Form</span>
                </li>
                <li className="flex items-center gap-2 text-zinc-400 line-through">
                  <span>Conditional Form Logic</span>
                </li>
              </ul>
            </div>
            <Link 
              href="/sign-up"
              className="w-full text-center py-3 rounded-lg border border-zinc-200 hover:border-black font-semibold text-sm transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
          {/* Pro Tier - Brutalist highlighted */}
          <div className="flex-1 bg-white border-2 border-black p-8 rounded-2xl flex flex-col justify-between space-y-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 hover:scale-[1.01] relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Popular
            </div>
            <div className="space-y-4">
              <span className="text-zinc-400 text-xs font-mono tracking-widest uppercase">Advanced Features</span>
              <h3 className="text-2xl font-bold">Pro Creator</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-mono">$19</span>
                <span className="text-zinc-400 text-sm">/ month</span>
              </div>
              <p className="text-zinc-500 text-sm">
                Perfect for active creators, agencies, and operations.
              </p>
              <hr className="border-black/10" />
              <ul className="space-y-3 text-sm text-zinc-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-black shrink-0" />
                  <span className="text-black font-medium">Unlimited Active Forms</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-black shrink-0" />
                  <span>Public, Unlisted & Password-protected</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-black shrink-0" />
                  <span className="text-black font-medium">Unlimited Responses</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-black shrink-0" />
                  <span>Conditional Question Logic</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-black shrink-0" />
                  <span>Scalar API & CSV Exports</span>
                </li>
              </ul>
            </div>
            <Link 
              href="/sign-up"
              className="w-full text-center py-3 bg-black hover:bg-zinc-800 text-white rounded-lg font-semibold text-sm transition-colors duration-200"
            >
              Get Pro Now
            </Link>
          </div>
        </div>
      </section>
      {/* Dynamic CTA */}
      <section className="bg-black text-white py-20 relative overflow-hidden border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center px-6 space-y-6 relative z-10">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to build forms that users actually enjoy?
          </h2>
          <p className="text-zinc-400 font-light max-w-lg mx-auto text-sm sm:text-base">
            Create an account in seconds. Zero credit card required to start designing. Check the demo to see it in action.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/sign-up"
              className="bg-white text-black hover:bg-zinc-100 px-8 py-3.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Sign Up Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link 
              href="/dashboard"
              className="border border-zinc-700 hover:border-white px-8 py-3.5 rounded-lg font-medium text-sm transition-all w-full sm:w-auto text-center"
            >
              Explore Seeded Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

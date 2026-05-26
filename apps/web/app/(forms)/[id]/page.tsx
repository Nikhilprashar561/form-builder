"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Info, 
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Laptop
} from "lucide-react";
interface Question {
  id: string;
  type: string;
  question: string;
  description: string;
  required: boolean;
  options?: string[];
}
const SEEDED_FORMS: Record<string, { title: string; questions: Question[] }> = {
  "startup-pitch": {
    title: "Startup Feedback Form",
    questions: [
      {
        id: "startup_name",
        type: "text",
        question: "What is the name of your startup venture?",
        description: "Keep it short and memorable.",
        required: true
      },
      {
        id: "email",
        type: "email",
        question: "What is your primary contact email?",
        description: "We will only send critical product notifications.",
        required: true
      },
      {
        id: "funding",
        type: "select",
        question: "What is your current funding round status?",
        description: "Select the most accurate state.",
        required: false,
        options: ["Bootstrap / Self-funded", "Pre-seed / Angel", "Seed Round", "Series A or higher"]
      },
      {
        id: "nps",
        type: "rating",
        question: "How likely are you to recommend our build tool?",
        description: "From 1 (Unlikely) to 5 (Extremely Likely).",
        required: true
      }
    ]
  },
  "anime-tier": {
    title: "Anime & Manga Tier Survey",
    questions: [
      {
        id: "fav_show",
        type: "text",
        question: "What anime or manga is your absolute favorite?",
        description: "e.g. Demon Slayer, Jujutsu Kaisen, One Piece.",
        required: true
      },
      {
        id: "hours_watching",
        type: "number",
        question: "How many hours of anime do you watch per week?",
        description: "Approximate amount.",
        required: false
      },
      {
        id: "genre",
        type: "select",
        question: "Which anime genre is your favorite?",
        description: "Select your main genre.",
        required: true,
        options: ["Shonen", "Seinen", "Slice of Life", "Fantasy / Isekai"]
      }
    ]
  },
  "nextos-reqs": {
    title: "NextOS Feature Requests",
    questions: [
      {
        id: "next_os_core",
        type: "text",
        question: "What is the single most important OS feature you want?",
        description: "e.g., Tabbed terminal routing, native widgets, etc.",
        required: true
      },
      {
        id: "use_frequency",
        type: "select",
        question: "How often do you use Unix-based command line tools?",
        description: "Select frequency.",
        required: true,
        options: ["Every day, all day", "Frequently", "Occasionally", "Rarely / Never"]
      }
    ]
  }
};
const THEMES = [
  { id: "Minimal White", bg: "bg-white", text: "text-zinc-900", accent: "border-black bg-black text-white", cardBg: "bg-white border-zinc-200" },
  { id: "Terminal OS", bg: "bg-black", text: "text-green-500", accent: "border-green-500 bg-green-500 text-black", cardBg: "bg-zinc-950 border-green-800 font-mono" },
  { id: "Cyberpunk Red", bg: "bg-zinc-950", text: "text-rose-600", accent: "border-rose-600 bg-rose-600 text-white", cardBg: "bg-zinc-900 border-rose-900" },
  { id: "Demon Slayer Retro", bg: "bg-amber-50", text: "text-amber-900", accent: "border-amber-900 bg-amber-950 text-amber-50", cardBg: "bg-stone-100 border-amber-200" }
];
export default function PublicFormFilling({ params }: { params: { id: string } }) {
  const formId = params.id || "startup-pitch";
  
  // Retrieve seeded form or fallback to startup feedback
  const formData = SEEDED_FORMS[formId] || SEEDED_FORMS["startup-pitch"];
  
  // Theme state switcher (placed locally for demo review)
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Auto focus input on step changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setErrorMsg("");
  }, [currentStep]);
  // Keyboard navigation controller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) return;
      if (e.key === "Enter") {
        // Prevent default submit behaviors
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp") {
        handlePrev();
      } else if (e.key === "ArrowDown") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, answers, isSubmitted]);
  const currentQ = formData.questions[currentStep];
  const handleValueChange = (val: any) => {
    setAnswers({ ...answers, [currentQ.id]: val });
    setErrorMsg("");
  };
  const handleNext = () => {
    // Basic validation check
    const currentVal = answers[currentQ.id];
    if (currentQ.required && (currentVal === undefined || currentVal === "")) {
      setErrorMsg("This field is required.");
      return;
    }
    if (currentQ.type === "email" && currentVal) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentVal)) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
    }
    if (currentStep < formData.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitted(true);
    }
  };
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const progressPercent = ((currentStep) / formData.questions.length) * 100;
  return (
    <div className={`min-h-screen ${activeTheme.bg} ${activeTheme.text} flex flex-col justify-between transition-colors duration-500 relative`}>
      {/* Top Progress Indicator Bar */}
      <div className="w-full h-1.5 bg-zinc-200/20">
        <div 
          className="h-full bg-current transition-all duration-500"
          style={{ width: isSubmitted ? "100%" : `${progressPercent}%` }}
        />
      </div>
      {/* Floating Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-wide uppercase">{formData.title}</span>
          <span className="text-[10px] font-mono border px-1.5 py-0.5 rounded opacity-60">{activeTheme.id}</span>
        </div>
        {/* Demo Theme Switcher Control */}
        <div className="relative">
          <button 
            onClick={() => setShowThemeDrawer(!showThemeDrawer)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-current hover:bg-current hover:text-inherit rounded-lg transition-colors"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Switch Theme</span>
          </button>
          
          {showThemeDrawer && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg border-2 border-black bg-white text-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 space-y-1`}>
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setActiveTheme(theme);
                    setShowThemeDrawer(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold hover:bg-zinc-100 flex items-center justify-between ${
                    activeTheme.id === theme.id ? "bg-zinc-50 border border-zinc-300" : ""
                  }`}
                >
                  <span>{theme.id}</span>
                  {activeTheme.id === theme.id && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>
      {/* Main Submission Canvas */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        {!isSubmitted ? (
          <div className="max-w-2xl w-full space-y-8 animate-fade-in">
            {/* Question Heading Container */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs opacity-60 pt-2 font-bold">
                  0{currentStep + 1} ➔
                </span>
                <div className="flex-1 space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    {currentQ.question}
                    {currentQ.required && <span className="text-red-500 ml-1">*</span>}
                  </h2>
                  {currentQ.description && (
                    <p className="text-sm sm:text-base opacity-60 font-light">
                      {currentQ.description}
                    </p>
                  )}
                </div>
              </div>
              {/* Input Renderers */}
              <div className="pl-8 md:pl-10 pt-2">
                {/* Text / Email Inputs */}
                {(currentQ.type === "text" || currentQ.type === "email" || currentQ.type === "number") && (
                  <input
                    ref={inputRef}
                    type={currentQ.type === "number" ? "number" : "text"}
                    placeholder="Type your answer here..."
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-current py-2 focus:outline-none text-xl sm:text-2xl placeholder:opacity-20 font-medium"
                    autoFocus
                  />
                )}
                {/* Dropdown Select option */}
                {currentQ.type === "select" && (
                  <div className="space-y-2.5 max-w-md">
                    {currentQ.options?.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleValueChange(option);
                          setTimeout(handleNext, 300);
                        }}
                        className={`w-full text-left px-5 py-4 border rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-between group ${
                          answers[currentQ.id] === option 
                            ? "border-current bg-current/10" 
                            : "border-current/20 hover:border-current hover:bg-current/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] opacity-40 border px-1.5 py-0.5 rounded">{idx + 1}</span>
                          <span>{option}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
                {/* Star / Number Rating */}
                {currentQ.type === "rating" && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => {
                            handleValueChange(star);
                            setTimeout(handleNext, 300);
                          }}
                          className={`w-12 h-12 border rounded-lg font-mono text-sm font-bold flex items-center justify-center transition-all ${
                            answers[currentQ.id] === star 
                              ? "border-current bg-current/25 font-black scale-105" 
                              : "border-current/20 hover:border-current hover:scale-105"
                          }`}
                        >
                          {star}★
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Error Alert Display */}
            {errorMsg && (
              <div className="pl-8 md:pl-10 flex items-center gap-2 text-red-500 animate-bounce">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-semibold">{errorMsg}</span>
              </div>
            )}
            {/* Controls panel */}
            <div className="pl-8 md:pl-10 pt-4 flex items-center gap-4">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-current text-white hover:opacity-90 transition-all font-mono shadow-sm"
                style={{ color: activeTheme.bg === "bg-white" ? "#fff" : "#000", backgroundColor: "currentColor" }}
              >
                <span className="text-white mix-blend-difference">OK</span>
                <Check className="h-4 w-4 text-white mix-blend-difference" />
              </button>
              
              <div className="text-[10px] opacity-40 font-mono hidden sm:flex items-center gap-2">
                <span>press</span>
                <span className="border border-current px-1 rounded text-[9px] font-bold">ENTER</span>
              </div>
            </div>
          </div>
        ) : (
          /* Submission Completed UI Screen */
          <div className="max-w-md w-full text-center space-y-6 animate-fade-up">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-current bg-current/5 mb-2">
              <Check className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight">Submission Successful</h2>
              <p className="text-sm opacity-60 max-w-xs mx-auto font-light">
                Your responses have been processed and validated using Zod schemas.
              </p>
            </div>
            {/* Answers summary recap */}
            <div className="border border-current/10 rounded-xl p-4 text-left space-y-3 text-xs bg-current/2 max-h-48 overflow-y-auto">
              <span className="font-mono opacity-40 uppercase tracking-wider block text-[10px] mb-1">Responses Recap</span>
              {Object.entries(answers).map(([key, val]) => (
                <div key={key} className="flex justify-between gap-4 py-1 border-b border-current/5 last:border-0">
                  <span className="font-semibold opacity-80">{key}</span>
                  <span className="font-mono opacity-60 truncate max-w-[200px]">{String(val)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setAnswers({});
                  setCurrentStep(0);
                  setIsSubmitted(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 border border-current hover:bg-current/5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Fill Again</span>
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto px-5 py-2.5 bg-current text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                style={{ color: activeTheme.bg === "bg-white" ? "#fff" : "#000", backgroundColor: "currentColor" }}
              >
                <Sparkles className="h-3.5 w-3.5 text-white mix-blend-difference" />
                <span className="text-white mix-blend-difference">Create a Form</span>
              </Link>
            </div>
          </div>
        )}
      </main>
      {/* Screen Pagination Controls */}
      <footer className="px-6 py-4 border-t border-current/10 flex items-center justify-between text-xs opacity-50 font-mono">
        <div className="flex items-center gap-1">
          <span>Question {isSubmitted ? formData.questions.length : currentStep + 1} of {formData.questions.length}</span>
        </div>
        <div className="flex items-center gap-1 border border-current/20 rounded-md overflow-hidden bg-current/2">
          <button 
            onClick={handlePrev}
            disabled={currentStep === 0 || isSubmitted}
            className="p-2 border-r border-current/10 hover:bg-current/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button 
            onClick={handleNext}
            disabled={isSubmitted}
            className="p-2 hover:bg-current/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import React from "react";

// ── Scribble SVG decorations ──────────────────────────────────────────────────

const ScribbleDivider = () => (
  <svg viewBox="0 0 800 10" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 5 C100 1, 200 8, 300 4 C400 1, 500 8, 600 4 C700 1, 750 7, 800 5"
      stroke="#333"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const StarDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z"
      stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"
    />
  </svg>
);

const LogoUnderline = () => (
  <svg viewBox="0 0 80 8" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 5 C20 2, 45 7, 78 4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const DiamondDoodle = () => (
  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 inline-block opacity-40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1 L11 6 L6 11 L1 6 Z" stroke="white" strokeWidth="1.2" fill="none" />
  </svg>
);

// ── Main Component ────────────────────────────────────────────────────────────

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .footer-link {
          font-family: 'Caveat', cursive;
          font-size: 16px;
          color: #999;
          cursor: pointer;
          position: relative;
          width: fit-content;
          transition: color 0.2s ease;
          text-decoration: none;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 1.5px;
          background: white;
          transition: width 0.25s ease;
        }
        .footer-link:hover {
          color: white;
        }
        .footer-link:hover::after {
          width: 100%;
        }
        .social-btn {
          width: 34px;
          height: 34px;
          border: 2px solid #444;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease, box-shadow 0.1s ease;
          color: #999;
        }
        .social-btn:hover {
          border-color: white;
          background: rgba(255,255,255,0.08);
          color: white;
          transform: translate(-2px, -2px);
          box-shadow: 3px 3px 0px white;
        }
        .footer-col-title {
          font-family: 'Caveat', cursive;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .footer-tagline {
          font-family: 'Caveat', cursive;
          font-size: 15px;
          color: #666;
          line-height: 1.6;
        }
        .footer-copyright {
          font-family: 'Caveat', cursive;
          font-size: 14px;
          color: #555;
        }
        .footer-scribble-bg {
          background-color: #0d0d0d;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      <footer className="footer-scribble-bg text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">

          <div className="grid grid-cols-1 gap-10 mb-12 md:grid-cols-4">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="mb-5">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-1">
                  <StarDoodle className="w-5 h-5" />
                  <Link href="/" style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", fontStyle: "italic", fontWeight: 400, color: "white", textDecoration: "none" }}>
                    NexForm
                  </Link>
                </div>
                <LogoUnderline />
              </div>
              <p className="footer-tagline">
                Collect opinions.<br />
                Understand people.<br />
                Make smarter decisions.
              </p>

              {/* Little sticky note */}
              <div className="mt-5 inline-block border border-gray-700 px-3 py-1.5" style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", color: "#666", transform: "rotate(-1.5deg)" }}>
                ✦ free to get started
              </div>
            </div>

            {/* Footer link columns */}
            {[
              { title: "Product",  links: ["Features", "Pricing", "Live Forms", "Workflows"] },
              { title: "Company",  links: ["About", "Forms", "Explore", "Public forms"] },
              { title: "Legal",    links: ["Privacy", "Terms", "Cookies", "Security"] },
            ].map((col) => (
              <div key={col.title}>
                <div className="footer-col-title">
                  <DiamondDoodle />
                  {col.title}
                </div>
                <ul className="flex flex-col gap-3 list-none p-0 m-0">
                  {col.links.map((l) => (
                    <li key={l}>
                      <span className="footer-link">{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Scribble divider */}
          <div className="mb-8 opacity-30">
            <ScribbleDivider />
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-2">
              <StarDoodle className="w-3.5 h-3.5 opacity-40" />
              <span className="footer-copyright">© 2026 NexForm. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Twitter / X */}
              <a href="https://x.com/NikhilPrashar_" target="_blank" rel="noopener noreferrer" className="social-btn" title="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/nikhilprashar1/" target="_blank" rel="noopener noreferrer" className="social-btn" title="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </a>

              {/* Hashnode */}
              <a href="https://nikhilprashar.hashnode.dev/" target="_blank" rel="noopener noreferrer" className="social-btn" title="Hashnode">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm3.5-9c0 1.93-1.57 3.5-3.5 3.5S8.5 13.93 8.5 12 10.07 8.5 12 8.5s3.5 1.57 3.5 3.5z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;

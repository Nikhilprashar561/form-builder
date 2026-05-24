"user client";

import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-10 mb-14 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className={`syne font-extrabold text-3xl tracking-tight fade-up d1`}>
                Nex
                <Link href={"/"} style={{ borderBottom: "3px solid #fff" }}>
                  Form
                </Link>
              </div>
            </div>

            <p className="text-sm leading-[1.7] text-gray-400">
              Collect opinions. Understand people. Make smarter decisions.
            </p>
          </div>

          {/* Footer Links */}
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Live Forms", "Workflows"],
            },
            {
              title: "Company",
              links: ["About", "Forms", "Explore", "Public forms"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Cookies", "Security"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[12px] font-semibold tracking-[2px] uppercase text-gray-500">
                {col.title}
              </h4>

              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {col.links.map((l) => (
                  <li
                    key={l}
                    className="relative w-fit text-sm text-gray-400 cursor-pointer transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-px after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <span className="text-sm text-gray-500">© 2026 NexForm. All rights reserved.</span>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/NikhilPrashar_"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-gray-700 rounded-[10px] flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-white hover:bg-white/10"
              title="Twitter"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7"></path>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/nikhilprashar1/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-gray-700 rounded-[10px] flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-white hover:bg-white/10"
              title="LinkedIn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </a>
            <a
              href="https://nikhilprashar.hashnode.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-gray-700 rounded-[10px] flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-white hover:bg-white/10"
              title="Hashnode"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm3.5-9c0 1.93-1.57 3.5-3.5 3.5S8.5 13.93 8.5 12 10.07 8.5 12 8.5s3.5 1.57 3.5 3.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "~/hooks/api/auth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useUser();

  const handleNavigate = (path: string) => {
    router.replace(path);
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl h-16 mx-auto px-6 flex items-center justify-between">
        <div className={`syne font-extrabold text-3xl tracking-tight fade-up d1`}>
          Nex<Link href={"/"} style={{ borderBottom: "3px solid #111" }}>Form</Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <span className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
            Live Forms
          </span>
          <span className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
            Pricing
          </span>
          <span className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
            Workflows
          </span>
          <span className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
            About
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isLoading && user ? (
            // Authenticated state
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-black transition-all duration-200 hover:border-black"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                  {user.fullName
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0]?.toUpperCase())
                    .join("")}
                </div>
                <span className="text-sm font-medium">{user.fullName.split(" ")[0]}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-200 bg-white shadow-sm py-2">
                  <button
                    onClick={() => handleNavigate("/dashboard")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigate("/user-profile")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Profile
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={() => handleNavigate("/sign-in")}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Unauthenticated state
            <>
              <button
                onClick={() => handleNavigate("/sign-in")}
                className="px-6 py-2 text-sm font-medium cursor-pointer rounded-full border border-gray-200 text-black transition-all duration-200 hover:border-black"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavigate("/sign-up")}
                className="px-5 py-2 text-sm font-medium cursor-pointer rounded-full bg-black text-white transition-all duration-200 hover:opacity-90"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-5 flex flex-col gap-1">
            <span
              className={`block h-0.5 bg-black transition-all duration-300 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`}
            ></span>
            <span
              className={`block h-0.5 bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block h-0.5 bg-black transition-all duration-300 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-white border-t border-gray-100">
          <span className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
            Live Forms
          </span>
          <span className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
            Pricing
          </span>
          <span className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
            Workflows
          </span>
          <span className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
            About
          </span>

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            {!isLoading && user ? (
              <>
                <button
                  onClick={() => handleNavigate("/dashboard")}
                  className="w-full py-3 cursor-pointer text-sm font-medium text-left px-4 rounded-full border border-gray-200 transition-all duration-200 hover:border-black"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigate("/user-profile")}
                  className="w-full py-3 cursor-pointer text-sm font-medium text-left px-4 rounded-full border border-gray-200 transition-all duration-200 hover:border-black"
                >
                  Profile
                </button>
                <button
                  onClick={() => handleNavigate("/sign-in")}
                  className="w-full py-3 cursor-pointer text-sm font-medium rounded-full bg-red-50 text-red-600 transition-all duration-200 hover:bg-red-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigate("/sign-in")}
                  className="w-full py-3 cursor-pointer text-sm font-medium rounded-full border border-gray-200 transition-all duration-200 hover:border-black"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigate("/sign-up")}
                  className="w-full py-3 cursor-pointer text-sm font-medium rounded-full bg-black text-white transition-all duration-200 hover:opacity-90"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl h-16 mx-auto px-6 flex items-center justify-between">
        <Logo onClick={() => router.replace("/")} />

        <div className="hidden md:flex items-center gap-8">
          <Link
            href={"/pricing-page"}
            className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            Pricing
          </Link>
          <Link
            href={"/active-forms"}
            className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            Live Form
          </Link>
          <Link
            href={"/explore-form"}
            className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            Explore
          </Link>
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => router.replace("/sign-in")}
            className="px-6 py-2 text-sm font-medium cursor-pointer rounded-full border border-gray-200 text-black transition-all duration-200 hover:border-black"
          >
            Sign In
          </button>

          <button
            onClick={() => router.replace("/sign-up")}
            className="px-5 py-2 text-sm font-medium cursor-pointer rounded-full bg-black text-white transition-all duration-200 hover:opacity-90"
          >
            Get Started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-5 flex flex-col gap-1">
            <span
              className={`block h-0.5 bg-black transition-all duration-300 ${
                menuOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            ></span>

            <span
              className={`block h-0.5 bg-black transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            ></span>

            <span
              className={`block h-0.5 bg-black transition-all duration-300 ${
                menuOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-white border-t border-gray-100">
          <Link
            href={"/pricing-page"}
            className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            Pricing
          </Link>
          <Link
            href={"/active-forms"}
            className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            Live Form
          </Link>
          <Link
            href={"/explore-form"}
            className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            Explore
          </Link>

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                router.replace("/sign-in");
                setMenuOpen(false);
              }}
              className="w-full py-3 cursor-pointer text-sm font-medium rounded-full border border-gray-200 transition-all duration-200 hover:border-black"
            >
              Sign In
            </button>

            <button
              onClick={() => {
                router.replace("/sign-up");
                setMenuOpen(false);
              }}
              className="w-full py-3 cursor-pointer text-sm font-medium rounded-full bg-black text-white transition-all duration-200 hover:opacity-90"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

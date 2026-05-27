'use client'

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-6">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <p className="text-sm tracking-[0.3em] uppercase text-neutral-500 mb-4">
            Error 404
          </p>

          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Page Not Found
          </h1>

          <p className="text-neutral-600 text-lg leading-8 mb-8">
            The page you are looking for does not exist or may have been moved.
            Please check the URL or go back to the homepage.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-black text-white rounded-xl hover:opacity-90 transition"
            >
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-black rounded-xl hover:bg-black hover:text-white transition"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-square border border-neutral-200 rounded-[32px] overflow-hidden bg-neutral-50">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-40">
              <svg width="100%" height="100%">
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#d4d4d4"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Floating Card */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white border border-black rounded-[28px] p-8 shadow-2xl rotate-[-6deg] w-[280px]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="h-3 w-20 bg-black rounded-full mb-3" />
                    <div className="h-2 w-14 bg-neutral-300 rounded-full" />
                  </div>

                  <div className="text-5xl font-black">404</div>
                </div>

                <div className="space-y-4">
                  <div className="h-3 bg-neutral-200 rounded-full w-full" />
                  <div className="h-3 bg-neutral-200 rounded-full w-[90%]" />
                  <div className="h-3 bg-neutral-200 rounded-full w-[70%]" />
                </div>

                <div className="mt-8 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-medium">
                  Lost Route
                </div>
              </div>
            </div>

            {/* Floating Shapes */}
            <div className="absolute top-10 left-10 h-16 w-16 border-2 border-black rounded-2xl rotate-12" />

            <div className="absolute bottom-12 right-10 h-10 w-10 bg-black rounded-full" />

            <div className="absolute top-1/2 right-6 h-24 w-[2px] bg-black rotate-12" />
          </div>
        </div>
      </div>
    </main>
  );
}

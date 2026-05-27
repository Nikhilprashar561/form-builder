"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useSignOut } from "~/hooks/api/auth";
import { toast } from "sonner";

const StarDoodle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`inline-block ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { signOutAsync } = useSignOut();

  const handleNavigate = (path: string) => {
    router.push(path);
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOutAsync();
      toast.success("Signed out successfully");
      router.push("/sign-in");
    } catch {
      toast.error("Failed to sign out");
    }
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  const publicNavLinks = [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/#about" },
  ];

  const authedNavLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Forms", href: "/dashboard" },
  ];

  const navLinks = user ? authedNavLinks : publicNavLinks;

  const initials = user?.fullName
    ? user.fullName.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")
    : "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .nav-link {
          font-family: 'Caveat', cursive;
          font-size: 16px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          position: relative;
          transition: color 0.2s ease;
          text-decoration: none;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -2px;
          width: 0; height: 1.5px;
          background: black;
          transition: width 0.25s ease;
        }
        .nav-link:hover { color: black; }
        .nav-link:hover::after { width: 100%; }

        .nav-btn-outline {
          font-family: 'Caveat', cursive;
          font-size: 16px; font-weight: 700;
          border: 2px solid black; background: white; color: black;
          padding: 6px 20px; cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
          box-shadow: 3px 3px 0px black;
        }
        .nav-btn-outline:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0px black; }
        .nav-btn-outline:active { transform: translate(1px,1px); box-shadow: 1px 1px 0px black; }

        .nav-btn-solid {
          font-family: 'Caveat', cursive;
          font-size: 16px; font-weight: 700;
          border: 2px solid black; background: black; color: white;
          padding: 6px 20px; cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
          box-shadow: 3px 3px 0px #555;
        }
        .nav-btn-solid:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0px #333; }
        .nav-btn-solid:active { transform: translate(1px,1px); box-shadow: 1px 1px 0px #555; }

        .user-avatar {
          width: 28px; height: 28px;
          border: 2px solid black; background: black; color: white;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Caveat', cursive; font-size: 13px; font-weight: 700;
          flex-shrink: 0;
        }

        .user-trigger {
          font-family: 'Caveat', cursive; font-size: 16px; font-weight: 600;
          border: 2px solid #ddd; background: white; color: black;
          padding: 5px 14px; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .user-trigger:hover { border-color: black; box-shadow: 2px 2px 0px black; }

        .dropdown-menu {
          position: absolute; right: 0; top: calc(100% + 8px);
          min-width: 190px; background: white;
          border: 2px solid black; box-shadow: 4px 4px 0px black;
          z-index: 100; padding: 4px 0;
        }
        .dropdown-item {
          font-family: 'Caveat', cursive; font-size: 16px; font-weight: 600;
          width: 100%; text-align: left; background: none; border: none;
          padding: 8px 16px; cursor: pointer; color: #444;
          transition: background 0.15s ease, color 0.15s ease;
          display: block; text-decoration: none;
        }
        .dropdown-item:hover { background: #f5f5f5; color: black; }
        .dropdown-item.danger { color: #888; }
        .dropdown-item.danger:hover { background: #f5f5f5; color: black; }
        .dropdown-divider { border: none; border-top: 1.5px solid #eee; margin: 4px 0; }

        .hamburger-bar { display: block; height: 2px; background: black; transition: all 0.25s ease; }

        .mobile-menu-item {
          font-family: 'Caveat', cursive; font-size: 17px; font-weight: 600;
          color: #666; cursor: pointer; padding: 8px 0;
          border-bottom: 1px dashed #eee; transition: color 0.2s ease;
          text-decoration: none; display: block;
        }
        .mobile-menu-item:hover { color: black; }

        .mobile-btn-outline {
          font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700;
          border: 2px solid black; background: white; color: black;
          width: 100%; padding: 10px; cursor: pointer;
          box-shadow: 3px 3px 0px black;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .mobile-btn-outline:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 black; }

        .mobile-btn-solid {
          font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700;
          border: 2px solid black; background: black; color: white;
          width: 100%; padding: 10px; cursor: pointer;
          box-shadow: 3px 3px 0px #555;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .mobile-btn-solid:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 #333; }

        .nav-scribble-border {
          border-bottom: 2px solid black;
          background: #fafaf8;
          background-image:
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      <nav className="nav-scribble-border fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl h-16 mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <StarDoodle className="w-5 h-5" />
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "26px", fontStyle: "italic", fontWeight: 400, color: "black" }}>
              NexForm
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="nav-link">{link.label}</Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />
            ) : user ? (
              <div className="relative">
                <button className="user-trigger" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <div className="user-avatar">{initials}</div>
                  <span>{user.fullName.split(" ")[0]}</span>
                  <svg viewBox="0 0 12 8" className="w-3 h-2" fill="none">
                    <path d="M1 1.5 L6 6.5 L11 1.5" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="dropdown-menu" style={{ zIndex: 50 }}>
                      <button className="dropdown-item" onClick={() => handleNavigate("/dashboard")}>
                        ◈ Dashboard
                      </button>
                      <button className="dropdown-item" onClick={() => handleNavigate("/dashboard")}>
                        ◈ My Forms
                      </button>
                      <button className="dropdown-item" onClick={() => handleNavigate("/user-profile")}>
                        ◈ Profile
                      </button>
                      <div className="dropdown-divider" />
                      <button className="dropdown-item danger" onClick={handleSignOut}>
                        ✕ Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button className="nav-btn-outline" onClick={() => handleNavigate("/sign-in")}>
                  Sign In
                </button>
                <button className="nav-btn-solid" onClick={() => handleNavigate("/sign-up")}>
                  Get Started →
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-7 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-bar" style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
            <span className="hamburger-bar" style={{ opacity: menuOpen ? 0 : 1 }} />
            <span className="hamburger-bar" style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col px-6 py-5 bg-white border-t-2 border-black" style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}>
            <div className="flex flex-col mb-5">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {!isLoading && user ? (
                <>
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-black mb-1">
                    <div className="user-avatar">{initials}</div>
                    <span style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", fontWeight: 700 }}>{user.fullName}</span>
                  </div>
                  <button className="mobile-btn-outline" onClick={() => handleNavigate("/dashboard")}>◈ Dashboard</button>
                  <button className="mobile-btn-outline" onClick={() => handleNavigate("/user-profile")}>◈ Profile</button>
                  <button className="mobile-btn-solid" style={{ background: "#333" }} onClick={handleSignOut}>✕ Sign Out</button>
                </>
              ) : (
                <>
                  <button className="mobile-btn-outline" onClick={() => handleNavigate("/sign-in")}>Sign In</button>
                  <button className="mobile-btn-solid" onClick={() => handleNavigate("/sign-up")}>Get Started →</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

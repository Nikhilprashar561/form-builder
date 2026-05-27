// FILE: apps/web/app/(dashboard)/layout.tsx
// New file: gives the dashboard its own layout with sidebar nav + no public Navbar/Footer

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Compass,
  Palette,
  Archive,
  Settings,
  MoreVertical,
  Menu,
  LineChart,
  X,
} from "lucide-react";
import { useUser, useSignOut } from "~/hooks/api/auth";
import { toast } from "sonner";
// import { LineChart } from "lucide-react";

const StarDoodle = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none">
    <path
      d="M12 2 L13.5 9 L20 9 L14.5 13.5 L16.5 20.5 L12 16.5 L7.5 20.5 L9.5 13.5 L4 9 L10.5 9 Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Create Form", href: "/dashboard/form", icon: FileText },
  { label: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Branding", href: "/branding", icon: Palette },
  { label: "Archive", href: "/archive", icon: Archive },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { signOutAsync } = useSignOut();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutAsync();
      toast.success("Signed out");
      router.push("/sign-in");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")
    : "?";

  const SidebarContent = () => (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        .dash-nav-link {
          font-family: 'Caveat', cursive;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 14px;
          color: #888;
          text-decoration: none;
          border: 1.5px solid transparent;
          transition: color 0.15s, background 0.15s, border-color 0.15s;
          cursor: pointer;
          background: none;
          width: 100%;
          text-align: left;
        }
        .dash-nav-link:hover { color: black; background: #f5f4f0; }
        .dash-nav-link.active {
          color: black;
          background: white;
          border: 1.5px solid black;
          box-shadow: 2px 2px 0 black;
          font-weight: 700;
        }
        .user-row {
          font-family: 'Caveat', cursive;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-top: 1.5px solid #e8e8e8;
          cursor: pointer;
          position: relative;
        }
        .user-row:hover { background: #f5f4f0; }
        .user-avatar-sm {
          width: 30px; height: 30px;
          border: 2px solid black; background: black; color: white;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Caveat', cursive; font-size: 13px; font-weight: 700;
          flex-shrink: 0;
        }
        .user-popup {
          position: absolute;
          bottom: calc(100% + 4px);
          left: 14px;
          min-width: 180px;
          background: white;
          border: 2px solid black;
          box-shadow: 4px 4px 0 black;
          z-index: 200;
          padding: 4px 0;
        }
        .user-popup-item {
          font-family: 'Caveat', cursive;
          font-size: 15px;
          font-weight: 600;
          padding: 8px 14px;
          cursor: pointer;
          color: #555;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          display: block;
          text-decoration: none;
        }
        .user-popup-item:hover { background: #f5f4f0; color: black; }
        .user-popup-item.danger:hover { color: black; }
        .popup-divider { border: none; border-top: 1.5px solid #eee; margin: 4px 0; }
      `}</style>

      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5" style={{ borderBottom: "1.5px solid #e8e8e8" }}>
        <StarDoodle />
        <Link
          href="/"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "22px",
            fontStyle: "italic",
            fontWeight: 400,
            color: "black",
            textDecoration: "none",
          }}
        >
          NexForm
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`dash-nav-link ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings + User */}
      <div>
        <Link
          href="/settings"
          className={`dash-nav-link mx-2 mb-1 ${pathname === "/settings" ? "active" : ""}`}
          onClick={() => setSidebarOpen(false)}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Settings
        </Link>

        {/* User row */}
        <div className="user-row" onClick={() => setUserMenuOpen(!userMenuOpen)}>
          {isLoading ? (
            <div
              className="w-5 h-5 border-2 border-black border-t-transparent rounded-full flex-shrink-0"
              style={{ animation: "spin 0.8s linear infinite" }}
            />
          ) : (
            <div className="user-avatar-sm">{initials}</div>
          )}
          <div className="flex-1 min-w-0">
            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "15px",
                fontWeight: 700,
                color: "black",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.fullName || "—"}
            </p>
            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "12px",
                color: "#aaa",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email || ""}
            </p>
          </div>
          <MoreVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setUserMenuOpen(false); }} />
              <div className="user-popup" style={{ zIndex: 20 }}>
                <Link href="/user-profile" className="user-popup-item" onClick={() => setUserMenuOpen(false)}>
                  Profile
                </Link>
                <Link href="/settings" className="user-popup-item" onClick={() => setUserMenuOpen(false)}>
                  Settings
                </Link>
                <div className="popup-divider" />
                <button className="user-popup-item danger" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div className="flex min-h-screen" style={{ background: "#f5f4f0" }}>

        {/* Desktop sidebar */}
        <aside
          className="hidden md:flex flex-col w-64 flex-shrink-0"
          style={{
            background: "#fafaf8",
            borderRight: "1.5px solid #e8e8e8",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-30 md:hidden"
              style={{ background: "rgba(0,0,0,0.4)" }}
              onClick={() => setSidebarOpen(false)}
            />
            <aside
              className="fixed left-0 top-0 bottom-0 z-40 md:hidden flex flex-col w-64"
              style={{ background: "#fafaf8", borderRight: "1.5px solid #e8e8e8" }}
            >
              <SidebarContent />
            </aside>
          </>
        )}

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <header
            className="md:hidden flex items-center justify-between px-4 py-3 bg-white"
            style={{ borderBottom: "1.5px solid #e8e8e8" }}
          >
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "20px",
                fontStyle: "italic",
              }}
            >
              NexForm
            </span>
            <div className="w-7" />
          </header>

          {/* Page content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}

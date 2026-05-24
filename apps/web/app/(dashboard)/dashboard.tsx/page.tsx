"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "~/hooks/api/auth";

const DashboardPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="animate-fade-up">
          <h1 className="font-display text-4xl font-bold text-black mb-2">
            Welcome back, {user.fullName}!
          </h1>
          <p className="text-gray-500">Start building your forms and collecting responses.</p>
        </div>

        {/* Dashboard content will be added here */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-up anim-delay-1">
            <div className="h-12 w-12 rounded-lg bg-black/5 mb-4"></div>
            <h2 className="font-display text-lg font-bold text-black mb-2">Forms</h2>
            <p className="text-sm text-gray-500">Create and manage your forms</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-up anim-delay-2">
            <div className="h-12 w-12 rounded-lg bg-black/5 mb-4"></div>
            <h2 className="font-display text-lg font-bold text-black mb-2">Responses</h2>
            <p className="text-sm text-gray-500">View and analyze form responses</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-up anim-delay-3">
            <div className="h-12 w-12 rounded-lg bg-black/5 mb-4"></div>
            <h2 className="font-display text-lg font-bold text-black mb-2">Analytics</h2>
            <p className="text-sm text-gray-500">Track your form performance</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { useState } from "react";
import { Toaster } from "sonner";
// import Footer from "~/components/Footer";
// import Navbar from "~/components/Navbar";

import { trpc } from "~/trpc/client";
import { createTRPCHttpBatchClientClient } from "~/trpc/create-client";

// ← FIX: No staleTime:Infinity — auth queries must always be fresh
//   so the navbar reflects sign-in/sign-out immediately.
//   We set a short staleTime (30s) for non-auth queries to avoid hammering the API.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      staleTime: 30_000, // 30 seconds default — auth route overrides via its own config
      retry: 1,
    },
  },
});

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [createTRPCHttpBatchClientClient()],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <trpc.Provider queryClient={queryClient} client={trpcClient}>
          {/* <Navbar /> */}
          <Toaster position="top-right" expand={true} />
          {children}
          {/* <Footer /> */}
        </trpc.Provider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
};

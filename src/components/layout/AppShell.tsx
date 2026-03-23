"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNav } from "@/components/landing/TopNav";

type AppShellContextValue = {
  recentQueries: string[];
  addRecentQuery: (q: string) => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) {
    throw new Error("useAppShell must be used within AppShell");
  }
  return ctx;
}

export function AppShell({ children }: { children: ReactNode }) {
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  const addRecentQuery = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentQueries((prev) => {
      const next = [trimmed, ...prev.filter((x) => x !== trimmed)].slice(0, 5);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ recentQueries, addRecentQuery }),
    [recentQueries, addRecentQuery],
  );

  return (
    <AppShellContext.Provider value={value}>
      <div className="flex h-dvh w-full flex-row overflow-hidden bg-[#050507]">
        <Suspense
          fallback={
            <aside className="hidden w-16 shrink-0 border-r border-[rgba(255,255,255,0.06)] bg-[#0d0d10] md:block lg:w-[196px]" />
          }
        >
          <AppSidebar />
        </Suspense>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <TopNav alignWithSidebar />
          <main className="min-h-0 flex-1 overflow-y-auto pt-[72px]">{children}</main>
        </div>
      </div>
    </AppShellContext.Provider>
  );
}

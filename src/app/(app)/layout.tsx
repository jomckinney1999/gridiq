import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <div className="min-h-0 flex-1 pt-14 md:pt-0">{children}</div>
    </AppShell>
  );
}

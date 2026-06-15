"use client";

import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { UtilityPanel } from "./utility-panel";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AdminHeader />
      <div className="flex min-h-0 flex-1">
        <AdminSidebar />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-background p-3 lg:p-4">
          {children}
        </main>
        <UtilityPanel />
      </div>
    </div>
  );
}

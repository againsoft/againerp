"use client";

import { SettingsLauncher } from "@/components/settings/settings-launcher";

export default function ControlCenterPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
        Control Center is for AgainERP internal team only — not visible to client tenants in production.
      </div>
      <SettingsLauncher layer="platform" />
    </div>
  );
}

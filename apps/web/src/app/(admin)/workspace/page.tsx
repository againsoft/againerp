"use client";

import { SettingsLauncher } from "@/components/settings/settings-launcher";

export default function WorkspaceSettingsPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <SettingsLauncher layer="workspace" />
    </div>
  );
}

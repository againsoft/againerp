"use client";

import { Sparkles } from "lucide-react";
import { AiOsControlCenter } from "@/components/ai-os/ai-os-control-center";

export default function AiOsPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="shrink-0">
        <p className="page-subtitle">AgainERP › AI OS</p>
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-600" />
          <h1 className="page-title">AI Control Center</h1>
        </div>
        <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
          Chief Agent orchestration, domain agents, approvals, providers, and audit — governed
          intelligence layer for all modules.
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1">
        <AiOsControlCenter />
      </div>
    </div>
  );
}

"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bot,
  Clock,
  History,
  Lightbulb,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AiWorkspaceContextHeader } from "@/components/hr/ai/ai-workspace-context-header";
import { AiWorkspaceConversation } from "@/components/hr/ai/ai-workspace-conversation";
import {
  AiWorkspaceActionsPanel,
  AiWorkspaceHistoryPanel,
  AiWorkspaceInsightsPanel,
  AiWorkspacePredictionsPanel,
  AiWorkspaceRecommendationsPanel,
} from "@/components/hr/ai/ai-workspace-panels";
import {
  AI_WORKSPACE_CONTEXT,
  AI_WORKSPACE_MODES,
  type AiWorkspaceMode,
} from "@/lib/mock-data/hr-ai-workspace";
import { cn } from "@/lib/utils";

const MODE_ICONS: Record<AiWorkspaceMode, typeof MessageSquare> = {
  chat: MessageSquare,
  insights: Lightbulb,
  recommendations: Sparkles,
  predictions: TrendingUp,
  actions: Zap,
  history: History,
};

/** SCR-AI-HR-001 · AI-UX-WORKSPACE-001 — Enterprise AI Workspace */
function AiWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as AiWorkspaceMode) || "chat";
  const rightTab = (searchParams.get("rail") as "insights" | "recommendations") || "insights";

  const setMode = useCallback(
    (next: AiWorkspaceMode) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("mode", next);
      router.push(`/hr/ai?${params.toString()}`);
    },
    [router, searchParams],
  );

  const setRightTab = useCallback(
    (tab: "insights" | "recommendations") => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("rail", tab);
      if (mode === "chat") params.set("mode", "chat");
      router.push(`/hr/ai?${params.toString()}`);
    },
    [router, searchParams, mode],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-input bg-background">
      <AiWorkspaceContextHeader context={AI_WORKSPACE_CONTEXT} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left mode navigation */}
        <nav
          aria-label="AI workspace modes"
          className="flex shrink-0 gap-1 overflow-x-auto border-b border-input bg-muted/20 p-2 lg:w-44 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r"
        >
          {AI_WORKSPACE_MODES.map((item) => {
            const Icon = MODE_ICONS[item.id];
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium transition-colors",
                  active
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  "lg:w-full",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Main content */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {mode === "chat" ? (
            <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
              <div className="flex min-h-0 min-w-0 flex-1 flex-col p-3">
                <AiWorkspaceConversation />
              </div>

              {/* Right rail — Zones C & D */}
              <aside className="hidden w-full shrink-0 border-t border-input xl:flex xl:w-[340px] xl:flex-col xl:border-l xl:border-t-0">
                <div className="flex border-b border-input">
                  {(["insights", "recommendations"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setRightTab(tab)}
                      className={cn(
                        "flex-1 px-3 py-2 text-xs font-medium capitalize",
                        rightTab === tab
                          ? "border-b-2 border-violet-600 text-violet-700 dark:text-violet-300"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-3">
                  {rightTab === "insights" ? (
                    <AiWorkspaceInsightsPanel compact />
                  ) : (
                    <AiWorkspaceRecommendationsPanel compact />
                  )}
                </div>
              </aside>

              {/* Mobile rail tabs */}
              <div className="border-t border-input p-3 xl:hidden">
                <div className="mb-2 flex gap-1">
                  {(["insights", "recommendations"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setRightTab(tab)}
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-medium capitalize",
                        rightTab === tab ? "bg-violet-600 text-white" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {rightTab === "insights" ? (
                  <AiWorkspaceInsightsPanel compact />
                ) : (
                  <AiWorkspaceRecommendationsPanel compact />
                )}
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {mode === "insights" && <AiWorkspaceInsightsPanel />}
              {mode === "recommendations" && <AiWorkspaceRecommendationsPanel />}
              {mode === "predictions" && <AiWorkspacePredictionsPanel />}
              {mode === "actions" && <AiWorkspaceActionsPanel />}
              {mode === "history" && <AiWorkspaceHistoryPanel />}
            </div>
          )}

          {/* Zone E — Actions footer (chat mode) */}
          {mode === "chat" ? (
            <div className="shrink-0 border-t border-input bg-muted/10 px-3 py-3">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-violet-600" aria-hidden />
                <span className="text-xs font-semibold">Quick Actions</span>
              </div>
              <AiWorkspaceActionsPanel compact />
            </div>
          ) : null}

          {/* Zone F — History strip (chat mode) */}
          {mode === "chat" ? (
            <details className="shrink-0 border-t border-input bg-card">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-xs font-semibold marker:content-none">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                AI History
                <span className="text-[10px] font-normal text-muted-foreground">— recent queries, reports, recommendations</span>
              </summary>
              <div className="max-h-64 overflow-y-auto border-t border-input px-4 py-3">
                <AiWorkspaceHistoryPanel compact />
              </div>
            </details>
          ) : null}
        </div>
      </div>

      {/* Footer metadata */}
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-input bg-muted/20 px-4 py-1.5 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Bot className="h-3 w-3" aria-hidden />
          workforce_agent · model v2.4 · as of 17 Jun 2026 09:15
        </span>
        <span>Advisory only · Human confirmation required for writes</span>
      </footer>
    </div>
  );
}

export function AiWorkspace() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-input bg-muted/20 text-sm text-muted-foreground">
          Loading AI workspace…
        </div>
      }
    >
      <AiWorkspaceContent />
    </Suspense>
  );
}

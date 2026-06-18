"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  History,
  Lightbulb,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { SmwAiContextHeader } from "@/components/sales-marketing/ai/smw-ai-context-header";
import { SmwAiConversation } from "@/components/sales-marketing/ai/smw-ai-conversation";
import {
  SmwAiActionsPanel,
  SmwAiHistoryPanel,
  SmwAiInsightsPanel,
  SmwAiPredictionsPanel,
  SmwAiRecommendationsPanel,
} from "@/components/sales-marketing/ai/smw-ai-panels";
import { SMW_AI_CONTEXT, SMW_AI_MODES, type SmwAiMode } from "@/lib/mock-data/smw-ai-workspace";
import { cn } from "@/lib/utils";

const MODE_ICONS: Record<SmwAiMode, typeof MessageSquare> = {
  chat: MessageSquare,
  insights: Lightbulb,
  recommendations: Sparkles,
  predictions: TrendingUp,
  actions: Zap,
  history: History,
};

function SmwAiWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as SmwAiMode) || "chat";
  const rightTab = (searchParams.get("rail") as "insights" | "recommendations") || "insights";

  const setMode = useCallback(
    (next: SmwAiMode) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("mode", next);
      router.push(`/sales-marketing/ai?${params.toString()}`);
    },
    [router, searchParams],
  );

  const setRightTab = useCallback(
    (tab: "insights" | "recommendations") => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("rail", tab);
      router.push(`/sales-marketing/ai?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-input bg-background">
      <SmwAiContextHeader context={SMW_AI_CONTEXT} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <nav
          aria-label="AI workspace modes"
          className="flex shrink-0 gap-1 overflow-x-auto border-b border-input bg-muted/20 p-2 lg:w-44 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r"
        >
          {SMW_AI_MODES.map((item) => {
            const Icon = MODE_ICONS[item.id];
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium transition-colors lg:w-full",
                  active ? "bg-violet-600 text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {mode === "chat" && (
            <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
              <div className="flex min-h-0 min-w-0 flex-1 flex-col p-3">
                <SmwAiConversation />
              </div>
              <aside className="hidden w-full shrink-0 border-t border-input xl:flex xl:w-[340px] xl:flex-col xl:border-l xl:border-t-0">
                <div className="flex border-b border-input">
                  {(["insights", "recommendations"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setRightTab(tab)}
                      className={cn(
                        "flex-1 px-3 py-2 text-xs font-medium capitalize",
                        rightTab === tab ? "border-b-2 border-violet-600 text-violet-700 dark:text-violet-300" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-3">
                  {rightTab === "insights" ? <SmwAiInsightsPanel compact /> : <SmwAiRecommendationsPanel compact />}
                </div>
              </aside>
            </div>
          )}
          {mode === "insights" && (
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <SmwAiInsightsPanel />
            </div>
          )}
          {mode === "recommendations" && (
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <SmwAiRecommendationsPanel />
            </div>
          )}
          {mode === "predictions" && <SmwAiPredictionsPanel />}
          {mode === "actions" && <SmwAiActionsPanel />}
          {mode === "history" && <SmwAiHistoryPanel />}
        </div>
      </div>
    </div>
  );
}

export function SmwAiWorkspace() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading AI copilot…</p>}>
      <SmwAiWorkspaceContent />
    </Suspense>
  );
}

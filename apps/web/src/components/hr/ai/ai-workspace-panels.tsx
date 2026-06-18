"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  ClipboardList,
  FileText,
  Mail,
  Minus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  AI_HISTORY,
  AI_INSIGHTS,
  AI_INSIGHT_CATEGORY_LABELS,
  AI_PREDICTIONS,
  AI_RECOMMENDATIONS,
  AI_WORKSPACE_ACTIONS,
  type AiInsightCard,
  type AiPrediction,
  type AiRecommendation,
  type AiWorkspaceAction,
} from "@/lib/mock-data/hr-ai-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** ZONE C — Insights panel */
export function AiWorkspaceInsightsPanel({ compact }: { compact?: boolean }) {
  const categories = ["attendance", "leave", "payroll", "performance"] as const;

  return (
    <section aria-label="AI insights" className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
        <h2 className="text-sm font-semibold">AI Insights</h2>
      </div>
      {categories.map((cat) => {
        const items = AI_INSIGHTS.filter((i) => i.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat}>
            <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {AI_INSIGHT_CATEGORY_LABELS[cat]} Insights
            </h3>
            <ul className={cn("space-y-2", compact && "max-h-[200px] overflow-y-auto")}>
              {items.map((item) => (
                <InsightCard key={item.id} item={item} compact={compact} />
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

function InsightCard({ item, compact }: { item: AiInsightCard; compact?: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "block rounded-lg border p-3 transition-colors hover:border-violet-300",
          item.severity === "critical" && "border-red-200 bg-red-50/40 dark:border-red-900 dark:bg-red-950/20",
          item.severity === "warning" && "border-amber-200 bg-amber-50/40 dark:border-amber-900 dark:bg-amber-950/20",
          item.severity === "info" && "border-input bg-card",
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="text-[9px] capitalize">
            {item.confidence}
          </Badge>
          {!compact ? (
            <Badge variant="outline" className="text-[9px] capitalize">
              {item.severity}
            </Badge>
          ) : null}
        </div>
        <p className="mt-1 text-xs font-semibold leading-snug">{item.title}</p>
        {!compact ? <p className="mt-1 text-[11px] text-muted-foreground">{item.summary}</p> : null}
      </Link>
    </li>
  );
}

/** ZONE D — Recommendations */
export function AiWorkspaceRecommendationsPanel({ compact }: { compact?: boolean }) {
  const groups = [
    { key: "promotion", label: "Promotion Recommendations" },
    { key: "training", label: "Training Recommendations" },
    { key: "policy", label: "Policy Suggestions" },
  ] as const;

  return (
    <section aria-label="AI recommendations" className="space-y-3">
      <h2 className="text-sm font-semibold">AI Recommendations</h2>
      {groups.map((group) => {
        const items = AI_RECOMMENDATIONS.filter((r) => r.type === group.key);
        return (
          <div key={group.key}>
            <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {group.label}
            </h3>
            <ul className={cn("space-y-2", compact && "max-h-[160px] overflow-y-auto")}>
              {items.map((item) => (
                <RecommendationCard key={item.id} item={item} compact={compact} />
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

function RecommendationCard({ item, compact }: { item: AiRecommendation; compact?: boolean }) {
  return (
    <li>
      <Link href={item.href} className="block rounded-lg border border-input bg-card p-3 hover:border-violet-300">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant={item.priority === "high" ? "warning" : "outline"}
            className="text-[9px] capitalize"
          >
            {item.priority}
          </Badge>
          {item.subject ? (
            <span className="font-mono text-[10px] text-muted-foreground">{item.subject}</span>
          ) : null}
        </div>
        <p className="mt-1 text-xs font-semibold">{item.title}</p>
        {!compact ? <p className="mt-1 text-[11px] text-muted-foreground">{item.summary}</p> : null}
      </Link>
    </li>
  );
}

/** Predictions view */
export function AiWorkspacePredictionsPanel() {
  return (
    <section aria-label="AI predictions" className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-violet-500" aria-hidden />
        <h2 className="text-sm font-semibold">AI Predictions</h2>
        <Badge variant="outline" className="text-[9px]">
          Forecast · advisory
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {AI_PREDICTIONS.map((pred) => (
          <PredictionCard key={pred.id} item={pred} />
        ))}
      </div>
    </section>
  );
}

function PredictionCard({ item }: { item: AiPrediction }) {
  const TrendIcon =
    item.trend === "up" ? ArrowUpRight : item.trend === "down" ? ArrowDownRight : Minus;

  return (
    <div className="rounded-lg border border-input bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold">{item.title}</p>
        <TrendIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{item.summary}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
        <Badge variant="outline">{item.horizon}</Badge>
        <Badge variant="outline" className="capitalize">
          {item.confidence}
        </Badge>
        {item.metric ? <span className="font-semibold tabular-nums">{item.metric}</span> : null}
      </div>
    </div>
  );
}

const ACTION_ICONS: Record<AiWorkspaceAction["icon"], typeof FileText> = {
  report: FileText,
  summary: ClipboardList,
  attendance: TrendingUp,
  payroll: Banknote,
  letter: Mail,
};

/** ZONE E — Actions */
export function AiWorkspaceActionsPanel({ compact }: { compact?: boolean }) {
  return (
    <section aria-label="AI actions" className={cn(compact && "rounded-lg border border-input bg-card p-3")}>
      {!compact ? <h2 className="mb-3 text-sm font-semibold">AI Actions</h2> : null}
      <div className={cn("grid gap-2", compact ? "grid-cols-2 sm:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-3")}>
        {AI_WORKSPACE_ACTIONS.map((action) => {
          const Icon = ACTION_ICONS[action.icon];
          return (
            <button
              key={action.id}
              type="button"
              disabled
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border border-input bg-card p-3 text-left transition-colors hover:border-violet-300 hover:bg-violet-50/30 disabled:opacity-80 dark:hover:bg-violet-950/20",
                compact && "min-h-[72px] items-center justify-center p-2 text-center",
              )}
            >
              <Icon className={cn("text-violet-600", compact ? "h-5 w-5" : "h-4 w-4")} aria-hidden />
              <span className={cn("font-medium", compact ? "text-[10px] leading-tight" : "text-sm")}>
                {action.label}
              </span>
              {!compact ? (
                <span className="text-[11px] text-muted-foreground">{action.description}</span>
              ) : null}
            </button>
          );
        })}
      </div>
      {!compact ? (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Actions show a preview before execution. High-impact operations require confirmation.
        </p>
      ) : null}
    </section>
  );
}

/** ZONE F — History */
export function AiWorkspaceHistoryPanel({ compact }: { compact?: boolean }) {
  const queries = AI_HISTORY.filter((h) => h.type === "query");
  const reports = AI_HISTORY.filter((h) => h.type === "report");
  const recs = AI_HISTORY.filter((h) => h.type === "recommendation");

  return (
    <section aria-label="AI history" className="space-y-4">
      <h2 className="text-sm font-semibold">AI History</h2>
      <HistoryGroup title="Recent Queries" items={queries} compact={compact} />
      <HistoryGroup title="Recent Reports" items={reports} compact={compact} />
      <HistoryGroup title="Recent Recommendations" items={recs} compact={compact} />
    </section>
  );
}

function HistoryGroup({
  title,
  items,
  compact,
}: {
  title: string;
  items: typeof AI_HISTORY;
  compact?: boolean;
}) {
  return (
    <div>
      <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <ul className={cn("space-y-1.5", compact && "max-h-[120px] overflow-y-auto")}>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 rounded-md border border-input px-3 py-2 text-xs"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{item.title}</p>
              <p className="truncate text-[10px] text-muted-foreground">{item.meta}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-muted-foreground">{item.timestamp}</p>
              {item.status ? (
                <Badge variant="outline" className="mt-0.5 text-[9px] capitalize">
                  {item.status}
                </Badge>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

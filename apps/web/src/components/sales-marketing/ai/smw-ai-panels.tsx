"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus, Sparkles, Zap } from "lucide-react";
import {
  SMW_AI_ACTIONS,
  SMW_AI_HISTORY,
  SMW_AI_INSIGHTS,
  SMW_AI_INSIGHT_LABELS,
  SMW_AI_PREDICTIONS,
  SMW_AI_RECOMMENDATIONS,
  type SmwAiInsight,
  type SmwAiPrediction,
  type SmwAiRecommendation,
} from "@/lib/mock-data/smw-ai-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SmwAiInsightsPanel({ compact }: { compact?: boolean }) {
  const categories = ["pipeline", "leads", "campaigns", "quotations"] as const;
  return (
    <section aria-label="AI insights" className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
        <h2 className="text-sm font-semibold">AI Insights</h2>
      </div>
      {categories.map((cat) => {
        const items = SMW_AI_INSIGHTS.filter((i) => i.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat}>
            <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {SMW_AI_INSIGHT_LABELS[cat]}
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

function InsightCard({ item, compact }: { item: SmwAiInsight; compact?: boolean }) {
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
        <Badge variant="outline" className="text-[9px] capitalize">{item.confidence}</Badge>
        <p className="mt-1 text-xs font-semibold leading-snug">{item.title}</p>
        {!compact && <p className="mt-1 text-[11px] text-muted-foreground">{item.summary}</p>}
      </Link>
    </li>
  );
}

export function SmwAiRecommendationsPanel({ compact }: { compact?: boolean }) {
  return (
    <section aria-label="AI recommendations" className="space-y-3">
      <h2 className="text-sm font-semibold">Recommendations</h2>
      <ul className={cn("space-y-2", compact && "max-h-[280px] overflow-y-auto")}>
        {SMW_AI_RECOMMENDATIONS.map((item) => (
          <RecommendationCard key={item.id} item={item} compact={compact} />
        ))}
      </ul>
    </section>
  );
}

function RecommendationCard({ item, compact }: { item: SmwAiRecommendation; compact?: boolean }) {
  return (
    <li>
      <Link href={item.href} className="block rounded-lg border border-input bg-card p-3 hover:border-violet-300">
        <div className="flex gap-2">
          <Badge variant="outline" className="text-[9px] capitalize">{item.type}</Badge>
          <Badge variant="secondary" className="text-[9px] capitalize">{item.priority}</Badge>
        </div>
        <p className="mt-1 text-xs font-semibold">{item.title}</p>
        {!compact && <p className="mt-1 text-[11px] text-muted-foreground">{item.summary}</p>}
      </Link>
    </li>
  );
}

export function SmwAiPredictionsPanel() {
  return (
    <section aria-label="AI predictions" className="space-y-3 p-3">
      <h2 className="text-sm font-semibold">Predictions</h2>
      <ul className="space-y-2">
        {SMW_AI_PREDICTIONS.map((p) => (
          <PredictionCard key={p.id} item={p} />
        ))}
      </ul>
    </section>
  );
}

function PredictionCard({ item }: { item: SmwAiPrediction }) {
  const TrendIcon = item.trend === "up" ? ArrowUpRight : item.trend === "down" ? ArrowDownRight : Minus;
  return (
    <li className="rounded-lg border border-input bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold">{item.title}</p>
        <TrendIcon className={cn("h-4 w-4 shrink-0", item.trend === "up" && "text-emerald-600", item.trend === "down" && "text-red-500")} aria-hidden />
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">{item.summary}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
        {item.metric && <Badge variant="secondary">{item.metric}</Badge>}
        <span>{item.horizon}</span>
        <span className="capitalize">{item.confidence} confidence</span>
      </div>
    </li>
  );
}

export function SmwAiActionsPanel() {
  return (
    <section aria-label="AI actions" className="space-y-3 p-3">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-violet-500" aria-hidden />
        <h2 className="text-sm font-semibold">Quick actions</h2>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {SMW_AI_ACTIONS.map((action) => (
          <li key={action.id}>
            <Link href={action.href} className="flex h-full flex-col rounded-lg border border-input bg-card p-3 hover:border-violet-300">
              <p className="text-xs font-semibold">{action.label}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{action.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SmwAiHistoryPanel() {
  return (
    <section aria-label="AI history" className="space-y-3 p-3">
      <h2 className="text-sm font-semibold">History</h2>
      <ul className="divide-y divide-input rounded-lg border border-input">
        {SMW_AI_HISTORY.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-2 px-3 py-2.5">
            <div>
              <p className="text-xs font-medium">{item.title}</p>
              <p className="text-[10px] text-muted-foreground">{item.meta}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">{item.timestamp}</p>
              {item.status && (
                <Badge variant="outline" className="mt-1 text-[9px] capitalize">{item.status}</Badge>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" size="sm" className="h-8 w-full text-xs" disabled>
        Export session log
      </Button>
    </section>
  );
}

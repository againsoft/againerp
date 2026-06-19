"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { CrmPageHeader } from "@/components/crm/crm-page-header";
import { AiWidget } from "@/components/dashboard/widgets/ai-widget";
import { Button } from "@/components/ui/button";
import { crmAiInsights } from "@/lib/mock-data/crm/ai";
import { crmScoreColor } from "@/lib/mock-data/crm/types";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

/** AI CRM — lead scores · summaries · suggested actions · opportunity insights. */
export function CrmAiWorkspace() {
  const openUtilityPanel = useAppStore((s) => s.openUtilityPanel);

  return (
    <div className="space-y-6" data-layout="LAYOUT-ANALYTICS">
      <CrmPageHeader title="AI CRM" subtitle="Lead scoring · summaries · suggested actions · opportunity insights." showImportExport={false} />

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium">Lead Score</h2>
        <ul className="mt-3 space-y-2">
          {crmAiInsights.leadScores.map((l) => (
            <li key={l.leadId} className="flex items-center justify-between rounded-md border px-3 py-2 text-xs">
              <div>
                <Link href={`/crm/leads?view=${l.leadId}`} className="font-medium text-primary hover:underline">
                  {l.name}
                </Link>
                <p className="text-muted-foreground">{l.company}</p>
              </div>
              <div className="text-right">
                <span className={cn("rounded px-2 py-0.5 text-[11px] font-semibold text-white", crmScoreColor(l.score))}>
                  {l.score}
                </span>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{l.trend}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium">Lead Summary</h2>
        <p className="mt-2 text-xs text-muted-foreground">{crmAiInsights.leadSummary}</p>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium">Suggested Actions</h2>
        <div className="mt-3 flex flex-col gap-2">
          {crmAiInsights.suggestedActions.map((a) => (
            <Button key={a.id} asChild variant="outline" size="sm" className="min-h-11 justify-start">
              <Link href={a.href}>{a.label}</Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium">Opportunity Insights</h2>
        <ul className="mt-3 space-y-2">
          {crmAiInsights.opportunityInsights.map((o) => (
            <li key={o.id} className="rounded-md border border-violet-200 bg-violet-50 p-3 text-xs dark:border-violet-900 dark:bg-violet-950/30">
              <p className="font-medium text-violet-800 dark:text-violet-200">{o.title}</p>
              <p className="mt-1 text-muted-foreground">{o.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <Button type="button" className="min-h-11 w-full gap-2 sm:w-auto" onClick={() => openUtilityPanel("ai")}>
        <Sparkles className="h-4 w-4" aria-hidden />
        Open AI Assistant
      </Button>

      <div className="rounded-lg border bg-muted/20 p-4">
        <AiWidget
          briefing={{
            id: "crm-ai-panel",
            title: "AI Briefing",
            bullets: crmAiInsights.opportunityInsights.map((o) => o.body),
            ctaLabel: "Ask follow-up",
          }}
        />
      </div>
    </div>
  );
}

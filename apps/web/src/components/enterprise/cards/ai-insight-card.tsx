import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { enterpriseCardClass } from "../shared";
import type { AiConfidence, EnterpriseAiInsightCardData, EnterpriseCardSize } from "../types";

type Props = EnterpriseAiInsightCardData & {
  size?: EnterpriseCardSize;
  className?: string;
  compact?: boolean;
};

function ConfidenceBadge({ confidence }: { confidence: AiConfidence }) {
  return (
    <span className="rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[9px] font-medium capitalize text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
      {confidence} confidence
    </span>
  );
}

/** CMP-AI-CARD-INSIGHT-001 — ✨ + title + confidence + CTAs */
export function EnterpriseAiInsightCard({
  title,
  summary,
  severity = "info",
  confidence = "medium",
  href,
  actions,
  size = "md",
  className,
  compact,
}: Props) {
  const severityClass =
    severity === "critical"
      ? "border-red-200 bg-red-50/40 dark:border-red-900 dark:bg-red-950/20"
      : severity === "warning"
        ? "border-amber-200 bg-amber-50/40 dark:border-amber-900 dark:bg-amber-950/20"
        : "border-[var(--ai-accent-border)] bg-[var(--ai-accent-bg)]";

  const inner = (
    <>
      <div className="flex items-start gap-2">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ai-accent-fg)]" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <ConfidenceBadge confidence={confidence} />
            {!compact ? (
              <span className="text-[9px] capitalize text-muted-foreground">{severity}</span>
            ) : null}
          </div>
          <h3 className="mt-1 text-sm font-semibold leading-snug text-[var(--ai-accent-fg)]">{title}</h3>
          {!compact ? <p className="mt-1 text-xs text-muted-foreground">{summary}</p> : null}
          {actions && actions.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {actions.map((action) =>
                action.href ? (
                  <Link
                    key={action.id}
                    href={action.href}
                    className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-800 hover:bg-violet-200 dark:bg-violet-950 dark:text-violet-200"
                  >
                    {action.label} →
                  </Link>
                ) : (
                  <span
                    key={action.id}
                    className="rounded-full border border-input px-2 py-0.5 text-[10px] font-medium"
                  >
                    {action.label}
                  </span>
                ),
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );

  const cardClass = cn(enterpriseCardClass(size), severityClass, href && "hover:opacity-90", className);

  if (href) {
    return (
      <Link href={href} className={cn(cardClass, "block")}>
        {inner}
      </Link>
    );
  }

  return <article className={cardClass}>{inner}</article>;
}

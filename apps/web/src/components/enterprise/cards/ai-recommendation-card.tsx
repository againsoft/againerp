import Link from "next/link";
import { Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { enterpriseCardClass } from "../shared";
import type { EnterpriseAiRecommendationCardData, EnterpriseCardSize } from "../types";

type Props = EnterpriseAiRecommendationCardData & {
  size?: EnterpriseCardSize;
  className?: string;
  compact?: boolean;
};

/** CMP-AI-CARD-RECOMMEND-001 — promotion, training, policy suggestions */
export function EnterpriseAiRecommendationCard({
  title,
  summary,
  type = "general",
  priority = "medium",
  subject,
  href,
  size = "md",
  className,
  compact,
}: Props) {
  const priorityClass =
    priority === "high"
      ? "border-amber-200 dark:border-amber-900"
      : "border-input";

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950">
            {type === "promotion" ? (
              <TrendingUp className="h-4 w-4 text-violet-600 dark:text-violet-300" aria-hidden />
            ) : (
              <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-300" aria-hidden />
            )}
          </span>
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
              {type} · {priority} priority
            </span>
            {subject ? (
              <p className="font-mono text-[10px] text-muted-foreground">{subject}</p>
            ) : null}
          </div>
        </div>
      </div>
      <h3 className="mt-2 text-sm font-semibold">{title}</h3>
      {!compact ? <p className="mt-1 text-xs text-muted-foreground">{summary}</p> : null}
      {href ? (
        <span className="mt-2 inline-block text-[10px] font-medium text-primary">Review recommendation →</span>
      ) : null}
    </>
  );

  const cardClass = cn(
    enterpriseCardClass(size),
    priorityClass,
    href && "hover:border-violet-300 hover:bg-violet-50/30 dark:hover:bg-violet-950/20",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(cardClass, "block")}>
        {inner}
      </Link>
    );
  }

  return <article className={cardClass}>{inner}</article>;
}

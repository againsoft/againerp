import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { enterpriseCardClass } from "../shared";
import type { EnterpriseAnalyticsCardData, EnterpriseCardSize } from "../types";

type Props = EnterpriseAnalyticsCardData & {
  size?: EnterpriseCardSize;
  className?: string;
  children?: ReactNode;
};

/** CMP-CARD-ANALYTICS — title + chart/metric area for dashboard Zone C */
export function EnterpriseAnalyticsCard({
  title,
  subtitle,
  metric,
  metricLabel,
  footer,
  href,
  size = "md",
  className,
  children,
}: Props) {
  const content = (
    <>
      <header className="flex items-start justify-between gap-2 border-b border-border/60 pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <h3 className="truncate text-sm font-semibold">{title}</h3>
          </div>
          {subtitle ? <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p> : null}
        </div>
        {metric ? (
          <div className="shrink-0 text-right">
            <p className="text-lg font-semibold tabular-nums">{metric}</p>
            {metricLabel ? <p className="text-[10px] text-muted-foreground">{metricLabel}</p> : null}
          </div>
        ) : null}
      </header>

      <div className="min-h-[120px] py-3">{children}</div>

      {(footer || href) && (
        <footer className="flex items-center justify-between gap-2 border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
          <span>{footer}</span>
          {href ? (
            <span className="inline-flex items-center gap-0.5 font-medium text-primary">
              Explore
              <ArrowRight className="h-3 w-3" aria-hidden />
            </span>
          ) : null}
        </footer>
      )}
    </>
  );

  const cardClass = cn(enterpriseCardClass(size, "flex flex-col"), className);

  if (href) {
    return (
      <Link href={href} className={cn(cardClass, "hover:border-primary/30")}>
        {content}
      </Link>
    );
  }

  return <article className={cardClass}>{content}</article>;
}

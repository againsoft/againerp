import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { enterpriseCardClass } from "../shared";
import type { EnterpriseCardSize, EnterpriseKpiCardData } from "../types";

type Props = EnterpriseKpiCardData & {
  size?: EnterpriseCardSize;
  className?: string;
  onClick?: () => void;
};

const STATUS_BORDER: Record<NonNullable<EnterpriseKpiCardData["status"]>, string> = {
  good: "border-emerald-200 dark:border-emerald-900",
  warning: "border-amber-200 dark:border-amber-900",
  critical: "border-red-200 dark:border-red-900",
  neutral: "border-input",
};

/** CMP-CARD-KPI — label + value + delta + drill link */
export function EnterpriseKpiCard({
  label,
  value,
  trend,
  trendDirection = "neutral",
  hint,
  href,
  status = "neutral",
  size = "md",
  className,
  onClick,
}: Props) {
  const TrendIcon =
    trendDirection === "up" ? ArrowUpRight : trendDirection === "down" ? ArrowDownRight : Minus;

  const inner = (
    <>
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      {trend ? (
        <p className="mt-1 flex items-center gap-1 text-[11px]">
          <TrendIcon className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
          <span className="font-medium tabular-nums">{trend}</span>
          {hint ? <span className="text-muted-foreground">{hint}</span> : null}
        </p>
      ) : hint ? (
        <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>
      ) : null}
      {href ? (
        <span className="mt-2 inline-flex items-center gap-0.5 text-[10px] font-medium text-primary">
          View details
          <ArrowRight className="h-3 w-3" aria-hidden />
        </span>
      ) : null}
    </>
  );

  const cardClass = cn(
    enterpriseCardClass(size),
    STATUS_BORDER[status],
    href && "hover:border-primary/30 hover:bg-accent/20",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(cardClass, "block")} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(cardClass, "w-full text-left")}>
        {inner}
      </button>
    );
  }

  return <article className={cardClass}>{inner}</article>;
}

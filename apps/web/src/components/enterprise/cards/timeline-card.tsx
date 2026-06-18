import Link from "next/link";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { enterpriseCardClass } from "../shared";
import type { EnterpriseCardSize, EnterpriseTimelineCardData } from "../types";

type Props = EnterpriseTimelineCardData & {
  size?: EnterpriseCardSize;
  className?: string;
  onClick?: () => void;
  compact?: boolean;
};

/** CMP-TML-CARD-001 — enterprise timeline event card */
export function EnterpriseTimelineCard({
  title,
  description,
  user,
  department,
  module,
  timestamp,
  relativeTime,
  priority,
  unread,
  href,
  size = "md",
  className,
  onClick,
  compact,
}: Props) {
  const priorityBorder =
    priority === "critical"
      ? "border-l-4 border-l-red-500"
      : priority === "high"
        ? "border-l-4 border-l-amber-500"
        : "";

  const inner = (
    <div className="flex items-start gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted"
        aria-hidden
      >
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {unread ? (
              <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-label="Unread" />
            ) : null}
            <h3 className={cn("font-semibold", compact ? "text-xs" : "text-sm")}>{title}</h3>
          </div>
          <div className="shrink-0 text-right">
            {relativeTime ? (
              <p className="text-[10px] text-muted-foreground">{relativeTime}</p>
            ) : null}
            {!compact ? <p className="text-[10px] text-muted-foreground">{timestamp}</p> : null}
          </div>
        </div>

        {!compact && description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className="font-medium">{user}</span>
          {department ? <span className="text-muted-foreground">· {department}</span> : null}
          {module ? (
            <span className="rounded bg-muted px-1.5 py-0.5 font-medium text-muted-foreground">
              {module}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );

  const cardClass = cn(
    enterpriseCardClass(size),
    priorityBorder,
    unread && "bg-blue-50/30 dark:bg-blue-950/10",
    (onClick || href) && "cursor-pointer hover:border-primary/30 hover:bg-accent/20",
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(cardClass, "w-full text-left")}>
        {inner}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={cn(cardClass, "block")}>
        {inner}
      </Link>
    );
  }

  return <article className={cardClass}>{inner}</article>;
}

import Link from "next/link";
import { cn } from "@/lib/utils";
import { enterpriseCardClass } from "../shared";
import type { EnterpriseCardSize, EnterpriseNotificationCardData } from "../types";

type Props = EnterpriseNotificationCardData & {
  size?: EnterpriseCardSize;
  className?: string;
  onClick?: () => void;
};

/** CMP-CARD-NOTIFICATION — alert / inbox notification row */
export function EnterpriseNotificationCard({
  title,
  body,
  time,
  unread,
  href,
  category,
  size = "md",
  className,
  onClick,
}: Props) {
  const inner = (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "mt-2 h-2 w-2 shrink-0 rounded-full",
          unread ? "bg-blue-500" : "bg-transparent",
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{title}</p>
          {category ? (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
              {category}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{body}</p>
        <p className="mt-1.5 text-[10px] text-muted-foreground">{time}</p>
      </div>
    </div>
  );

  const cardClass = cn(
    enterpriseCardClass(size),
    unread && "border-primary/20 bg-primary/5",
    (href || onClick) && "hover:bg-muted/50",
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

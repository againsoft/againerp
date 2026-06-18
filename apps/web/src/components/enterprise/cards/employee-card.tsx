import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnterpriseStatusBadge } from "../badges/status-badge";
import { enterpriseCardClass } from "../shared";
import type { EnterpriseCardSize, EnterpriseEmployeeCardData } from "../types";

type Props = EnterpriseEmployeeCardData & {
  size?: EnterpriseCardSize;
  className?: string;
  onClick?: () => void;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** CMP-CARD-EMPLOYEE — avatar + name + meta + chevron */
export function EnterpriseEmployeeCard({
  name,
  employeeNumber,
  designation,
  department,
  branch,
  status,
  href,
  meta,
  size = "md",
  className,
  onClick,
}: Props) {
  const inner = (
    <div className="flex items-center gap-3">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)] text-sm font-semibold text-primary"
        aria-hidden
      >
        {initials(name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{name}</p>
        <p className="font-mono text-[10px] text-muted-foreground">{employeeNumber}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{designation}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <EnterpriseStatusBadge status={status} size="sm" />
          <span className="text-[10px] text-muted-foreground">{department}</span>
        </div>
        {branch || meta ? (
          <p className="mt-1 text-[10px] text-muted-foreground">
            {[branch, meta].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </div>
  );

  const cardClass = cn(
    enterpriseCardClass(size),
    "hover:border-primary/30 hover:bg-accent/20",
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(cardClass, "w-full text-left")}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={href} className={cn(cardClass, "block")}>
      {inner}
    </Link>
  );
}

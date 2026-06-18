import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnterpriseApprovalBadge } from "../badges/approval-badge";
import { EnterpriseRiskBadge } from "../badges/risk-badge";
import { enterpriseCardClass } from "../shared";
import type { EnterpriseApprovalCardData, EnterpriseCardSize } from "../types";

type Props = EnterpriseApprovalCardData & {
  size?: EnterpriseCardSize;
  className?: string;
  onClick?: () => void;
  riskLevel?: "critical" | "high" | "medium" | "low" | "none";
};

function ModuleChip({ module }: { module: string }) {
  return (
    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      {module}
    </span>
  );
}

function PriorityDot({ priority }: { priority: EnterpriseApprovalCardData["priority"] }) {
  const color =
    priority === "critical" || priority === "high"
      ? "bg-amber-500"
      : priority === "medium"
        ? "bg-blue-500"
        : "bg-muted-foreground";
  return <span className={cn("h-2 w-2 shrink-0 rounded-full", color)} aria-hidden />;
}

/** CMP-APR-CARD-001 — approval inbox card */
export function EnterpriseApprovalCard({
  requestId,
  module,
  requestType,
  requester,
  department,
  priority,
  status,
  submittedAt,
  href,
  size = "md",
  className,
  onClick,
  riskLevel,
}: Props) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <PriorityDot priority={priority} />
          <span className="font-mono text-xs font-semibold text-primary">{requestId}</span>
        </div>
        <EnterpriseApprovalBadge status={status} size="sm" />
      </div>

      <p className="mt-2 text-sm font-medium">{requestType}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {requester}
        {department ? ` · ${department}` : ""}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ModuleChip module={module} />
        <span className="text-[10px] capitalize text-muted-foreground">{priority} priority</span>
        {riskLevel && riskLevel !== "none" ? (
          <EnterpriseRiskBadge level={riskLevel} size="sm" showIcon={false} />
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{submittedAt}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
      </div>
    </>
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

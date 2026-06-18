import { cn } from "@/lib/utils";
import type { EnterpriseApprovalStatus } from "../types";
import { badgeSizeClasses } from "../shared";

type Props = {
  status: EnterpriseApprovalStatus;
  label?: string;
  size?: keyof typeof badgeSizeClasses;
  className?: string;
};

/** CMP-BDG-APPROVAL — approval workflow status */
const APPROVAL_CONFIG: Record<EnterpriseApprovalStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "border-transparent bg-[var(--status-pending-bg)] text-[var(--status-pending)]",
  },
  approved: {
    label: "Approved",
    className: "border-transparent bg-[var(--status-approved-bg)] text-[var(--status-approved)]",
  },
  rejected: {
    label: "Rejected",
    className: "border-transparent bg-[var(--status-rejected-bg)] text-[var(--status-rejected)]",
  },
  escalated: {
    label: "Escalated",
    className: "border-transparent bg-[var(--status-warning-bg)] text-[var(--status-warning)]",
  },
  delegated: {
    label: "Delegated",
    className: "border-transparent bg-[var(--status-info-bg)] text-[var(--status-info)]",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-transparent bg-[var(--status-archived-bg)] text-[var(--status-archived)]",
  },
};

export function EnterpriseApprovalBadge({ status, label, size = "md", className }: Props) {
  const config = APPROVAL_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold capitalize",
        badgeSizeClasses[size],
        config.className,
        className,
      )}
    >
      {label ?? config.label}
    </span>
  );
}

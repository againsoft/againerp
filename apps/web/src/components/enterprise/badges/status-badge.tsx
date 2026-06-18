import { cn } from "@/lib/utils";
import type { EnterpriseStatus } from "../types";
import { badgeSizeClasses } from "../shared";

type Props = {
  status: EnterpriseStatus;
  label?: string;
  size?: keyof typeof badgeSizeClasses;
  className?: string;
};

/** CMP-BDG-STATUS — semantic status badge */
const STATUS_CONFIG: Record<EnterpriseStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "border-transparent bg-[var(--status-success-bg)] text-[var(--status-success)]",
  },
  inactive: {
    label: "Inactive",
    className: "border-transparent bg-[var(--status-archived-bg)] text-[var(--status-archived)]",
  },
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
  archived: {
    label: "Archived",
    className: "border-transparent bg-[var(--status-archived-bg)] text-[var(--status-archived)]",
  },
  draft: {
    label: "Draft",
    className: "border-transparent bg-[var(--status-draft-bg)] text-[var(--status-draft)]",
  },
  locked: {
    label: "Locked",
    className: "border-transparent bg-[var(--status-danger-bg)] text-[var(--status-danger)]",
  },
};

export function EnterpriseStatusBadge({ status, label, size = "md", className }: Props) {
  const config = STATUS_CONFIG[status];
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

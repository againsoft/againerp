import { AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnterpriseRiskLevel } from "../types";
import { badgeSizeClasses } from "../shared";

type Props = {
  level: EnterpriseRiskLevel;
  label?: string;
  size?: keyof typeof badgeSizeClasses;
  showIcon?: boolean;
  className?: string;
};

/** CMP-BDG-RISK — AI / compliance risk level */
const RISK_CONFIG: Record<EnterpriseRiskLevel, { label: string; className: string }> = {
  critical: {
    label: "Critical risk",
    className: "border-transparent bg-[var(--status-danger-bg)] text-[var(--status-danger)]",
  },
  high: {
    label: "High risk",
    className: "border-transparent bg-[var(--status-warning-bg)] text-[var(--status-warning)]",
  },
  medium: {
    label: "Medium risk",
    className: "border-transparent bg-[var(--status-info-bg)] text-[var(--status-info)]",
  },
  low: {
    label: "Low risk",
    className: "border-transparent bg-[var(--status-draft-bg)] text-[var(--status-draft)]",
  },
  none: {
    label: "No risk",
    className: "border-transparent bg-[var(--status-success-bg)] text-[var(--status-success)]",
  },
};

export function EnterpriseRiskBadge({ level, label, size = "md", showIcon = true, className }: Props) {
  const config = RISK_CONFIG[level];
  const Icon = level === "critical" || level === "high" ? ShieldAlert : AlertTriangle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold",
        badgeSizeClasses[size],
        config.className,
        className,
      )}
    >
      {showIcon && level !== "none" ? <Icon className="h-3 w-3 shrink-0" aria-hidden /> : null}
      {label ?? config.label}
    </span>
  );
}

import { cn } from "@/lib/utils";
import type { EnterpriseCardSize } from "./types";

export const enterpriseCardBase = "rounded-lg border border-input bg-card transition-colors";

export const enterpriseCardPadding: Record<EnterpriseCardSize, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export function enterpriseCardClass(size: EnterpriseCardSize = "md", className?: string) {
  return cn(enterpriseCardBase, enterpriseCardPadding[size], className);
}

export const badgeSizeClasses = {
  sm: "px-1.5 py-0 text-[9px]",
  md: "px-2 py-0.5 text-[10px]",
  lg: "px-2.5 py-0.5 text-xs",
} as const;

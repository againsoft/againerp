import Link from "next/link";
import {
  Calendar,
  Clock,
  FileText,
  Sparkles,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { enterpriseCardClass } from "../shared";
import type { EnterpriseCardSize, EnterpriseQuickActionCardData } from "../types";

type Props = EnterpriseQuickActionCardData & {
  size?: EnterpriseCardSize;
  className?: string;
};

const ICONS: Record<NonNullable<EnterpriseQuickActionCardData["icon"]>, LucideIcon> = {
  calendar: Calendar,
  clock: Clock,
  wallet: Wallet,
  file: FileText,
  users: Users,
  sparkles: Sparkles,
};

/** CMP-CARD-QUICK-ACTION — dashboard / ESS quick action tile */
export function EnterpriseQuickActionCard({
  label,
  description,
  href,
  icon = "calendar",
  size = "md",
  className,
}: Props) {
  const Icon = ICONS[icon];

  return (
    <Link
      href={href}
      className={cn(
        enterpriseCardClass(size),
        "flex min-h-[72px] flex-col items-center justify-center gap-1.5 text-center hover:border-primary/30 hover:bg-accent/30",
        className,
      )}
    >
      <Icon className="h-5 w-5 text-primary" aria-hidden />
      <span className="text-[11px] font-medium leading-tight">{label}</span>
      {description ? (
        <span className="line-clamp-2 text-[10px] text-muted-foreground">{description}</span>
      ) : null}
    </Link>
  );
}

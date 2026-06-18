"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Calendar, Home, Menu, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = [
  { href: "/ess", label: "Home", icon: Home, match: (p: string) => p === "/ess" },
  { href: "/ess/leave", label: "Leave", icon: Calendar, match: (p: string) => p.startsWith("/ess/leave") },
  { href: "/ess/payslips", label: "Payslips", icon: Wallet, match: (p: string) => p.startsWith("/ess/payslips") },
  { href: "/ess/notifications", label: "Alerts", icon: Bell, match: (p: string) => p.startsWith("/ess/notifications") },
];

type Props = {
  onMoreClick: () => void;
};

export function EssBottomNav({ onMoreClick }: Props) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Employee portal navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-input bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:static md:border-t-0 md:bg-transparent md:backdrop-blur-none"
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)] md:max-w-none md:justify-start md:gap-1 md:px-0 md:pb-0">
        {PRIMARY_NAV.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1 text-[10px] font-medium transition-colors md:flex-none md:flex-row md:gap-2 md:px-3 md:text-xs",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0 md:h-4 md:w-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onMoreClick}
          className="flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground md:flex-none md:flex-row md:gap-2 md:px-3 md:text-xs"
          aria-label="More menu"
        >
          <Menu className="h-5 w-5 shrink-0 md:h-4 md:w-4" aria-hidden />
          More
        </button>
      </div>
    </nav>
  );
}

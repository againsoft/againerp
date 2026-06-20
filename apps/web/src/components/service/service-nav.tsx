"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_TABS = [
  { label: "Dashboard", href: "/service" },
  { label: "Catalog", href: "/service/catalog" },
  { label: "Assets", href: "/service/assets" },
  { label: "Orders", href: "/service/orders" },
  { label: "Work Orders", href: "/service/work-orders" },
  { label: "Schedule", href: "/service/schedule" },
  { label: "Contracts", href: "/service/contracts" },
  { label: "Reports", href: "/service/reports" },
] as const;

export function ServiceNav({ compact }: { compact?: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/service") return pathname === "/service";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const tabs = compact ? NAV_TABS.slice(0, 3) : NAV_TABS;

  return (
    <nav className="flex flex-wrap gap-1 rounded-lg border border-input bg-muted/30 p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            isActive(tab.href)
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

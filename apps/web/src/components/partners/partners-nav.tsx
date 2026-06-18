"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PARTNER_NAV_ITEMS } from "@/lib/mock-data/business-partners";
import { cn } from "@/lib/utils";

export function PartnersBreadcrumb({ tab }: { tab: string }) {
  const item = PARTNER_NAV_ITEMS.find((n) => n.id === tab);
  return (
    <p className="page-subtitle mb-1">
      AgainERP › Business Partners
      {item && item.id !== "overview" ? ` › ${item.label}` : ""}
    </p>
  );
}

export function PartnersNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 rounded-lg border border-input bg-muted/30 p-1">
      {PARTNER_NAV_ITEMS.map((item) => {
        const active =
          item.href === "/partners"
            ? pathname === "/partners"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

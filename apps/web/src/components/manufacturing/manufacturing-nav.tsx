"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MANUFACTURING_TAB_LABELS,
  MANUFACTURING_TABS,
  pathFromManufacturingTab,
  tabFromManufacturingPath,
  type ManufacturingTab,
} from "@/lib/mock-data/manufacturing";
import { cn } from "@/lib/utils";

export function ManufacturingNav() {
  const pathname = usePathname();
  const active = tabFromManufacturingPath(pathname);

  return (
    <nav className="flex flex-wrap gap-1 rounded-lg border border-input bg-muted/30 p-1">
      {MANUFACTURING_TABS.map((tab) => (
        <Link
          key={tab}
          href={pathFromManufacturingTab(tab)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            active === tab
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {MANUFACTURING_TAB_LABELS[tab]}
        </Link>
      ))}
    </nav>
  );
}

export function ManufacturingBreadcrumb({ tab }: { tab: ManufacturingTab }) {
  return (
    <p className="mb-1 text-[11px] text-muted-foreground">
      AgainERP › Manufacturing › {MANUFACTURING_TAB_LABELS[tab]}
    </p>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HR_NAV_ITEMS, hrBreadcrumbLabel, type HrNavId } from "@/lib/mock-data/hr";
import { cn } from "@/lib/utils";

export function HrBreadcrumb({ tab }: { tab: HrNavId }) {
  const section = hrBreadcrumbLabel(tab);
  return (
    <nav aria-label="Breadcrumb" className="mb-1">
      <ol className="page-subtitle flex flex-wrap items-center gap-1">
        <li>
          <Link href="/dashboard" className="hover:text-foreground">
            AgainERP
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li>
          <Link href="/hr" className="hover:text-foreground">
            HR &amp; Payroll
          </Link>
        </li>
        {tab !== "overview" && (
          <>
            <li aria-hidden="true">›</li>
            <li aria-current="page">{section}</li>
          </>
        )}
      </ol>
    </nav>
  );
}

export function HrNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="HR module sections"
      className="flex flex-wrap gap-1 rounded-lg border border-input bg-muted/30 p-1"
    >
      {HR_NAV_ITEMS.map((item) => {
        const active =
          item.href === "/hr"
            ? pathname === "/hr"
            : item.href === "/payroll"
              ? pathname.startsWith("/payroll")
              : pathname.startsWith(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
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

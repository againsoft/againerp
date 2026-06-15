"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { sidebarNav, type NavItem } from "@/lib/navigation";
import { useAppStore } from "@/lib/store/app-store";

function isNavActive(pathname: string, href?: string) {
  if (!href) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.href && isNavActive(pathname, item.href)) return true;
  return item.children?.some((c) => isNavItemActive(pathname, c)) ?? false;
}

function NavChildren({
  items,
  pathname,
  depth,
  addRecent,
}: {
  items: NavItem[];
  pathname: string;
  depth: number;
  addRecent: (title: string, href: string) => void;
}) {
  return (
    <div className={cn("border-l pl-2", depth > 0 ? "ml-2" : "ml-3")}>
      {items.map((child) => {
        if (child.children?.length) {
          return (
            <div key={child.title} className="mb-1">
              {child.href ? (
                <Link
                  href={child.href}
                  onClick={() => addRecent(child.title, child.href!)}
                  className={cn(
                    "block rounded-md px-1.5 py-1 text-xs font-semibold hover:bg-accent",
                    pathname === child.href
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {child.title}
                </Link>
              ) : (
                <p className="px-1.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {child.title}
                </p>
              )}
              <NavChildren items={child.children} pathname={pathname} depth={depth + 1} addRecent={addRecent} />
            </div>
          );
        }
        if (!child.href) return null;
        return (
          <Link
            key={child.href}
            href={child.href}
            onClick={() => addRecent(child.title, child.href!)}
            className={cn(
              "block rounded-md px-1.5 py-1 text-xs hover:bg-accent",
              isNavActive(pathname, child.href) && "bg-accent font-medium",
            )}
          >
            {child.title}
          </Link>
        );
      })}
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const recentPages = useAppStore((s) => s.recentPages);
  const addRecent = useAppStore((s) => s.addRecent);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Catalog: true, Orders: true, System: true });

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r bg-muted/20 transition-all",
        collapsed ? "w-12" : "w-52",
      )}
    >
      <div className="flex-1 overflow-y-auto p-1.5 text-xs">
        <nav className="space-y-0.5">
          {sidebarNav.map((item) => {
            if (item.children) {
              const open = openGroups[item.title] ?? false;
              const groupActive = isNavItemActive(pathname, item);
              return (
                <div key={item.title}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroups((g) => ({ ...g, [item.title]: !open }))
                    }
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-1.5 py-1.5 text-xs font-medium hover:bg-accent",
                      groupActive && "bg-accent/50",
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {item.icon && <item.icon className="h-3.5 w-3.5 shrink-0" />}
                      {!collapsed && item.title}
                    </span>
                    {!collapsed && (
                      <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
                    )}
                  </button>
                  {open && !collapsed && (
                    <NavChildren
                      items={item.children}
                      pathname={pathname}
                      depth={0}
                      addRecent={addRecent}
                    />
                  )}
                </div>
              );
            }
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.title}
                href={item.href!}
                onClick={() => addRecent(item.title, item.href!)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-xs font-medium hover:bg-accent",
                  active && "bg-accent",
                )}
              >
                {item.icon && <item.icon className="h-3.5 w-3.5 shrink-0" />}
                {!collapsed && item.title}
              </Link>
            );
          })}
        </nav>
        {!collapsed && recentPages.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase text-muted-foreground">
              Recent
            </p>
            {recentPages.slice(0, 5).map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="block truncate rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {p.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

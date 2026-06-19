"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  PanelLeft,
  PanelLeftClose,
  Search,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  flattenWorkspaceNav,
  workspaceDashboardItem,
  workspaceHomeItem,
  workspaceNavGroups,
  type WorkspaceNavItem,
} from "@/lib/workspace/navigation-config";

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/hr") return pathname.startsWith("/hr") || pathname.startsWith("/payroll");
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  item,
  pathname,
  collapsed,
  onNavigate,
  depth = 0,
}: {
  item: WorkspaceNavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate: (title: string, href: string) => void;
  depth?: number;
}) {
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const favorites = useAppStore((s) => s.favorites);
  if (!item.href) return null;
  const active = isActive(pathname, item.href);
  const favorited = favorites.includes(item.href);
  const Icon = item.icon;

  return (
    <div className="group relative">
      <Link
        href={item.href}
        onClick={() => onNavigate(item.title, item.href!)}
        aria-current={active ? "page" : undefined}
        title={collapsed ? item.title : undefined}
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium hover:bg-accent",
          active && "border-l-2 border-primary bg-accent pl-[calc(0.5rem-2px)]",
          depth > 0 && "ml-2",
        )}
      >
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
        {!collapsed && <span className="truncate">{item.title}</span>}
        {!collapsed && item.badge ? (
          <span className="ml-auto rounded-full bg-primary/10 px-1.5 text-[10px] text-primary">
            {item.badge}
          </span>
        ) : null}
      </Link>
      {!collapsed && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(item.href!);
          }}
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 rounded p-0.5 opacity-0 hover:bg-muted group-hover:opacity-100",
            favorited && "opacity-100 text-amber-500",
          )}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={cn("h-3 w-3", favorited && "fill-current")} />
        </button>
      )}
    </div>
  );
}

type Props = {
  className?: string;
  onNavigate?: () => void;
};

/** WS-SIDE-* — Zone C left sidebar (240px / 64px collapsed). */
export function WorkspaceSidebar({ className, onNavigate }: Props) {
  const pathname = usePathname();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const recentPages = useAppStore((s) => s.recentPages);
  const favorites = useAppStore((s) => s.favorites);
  const addRecent = useAppStore((s) => s.addRecent);
  const [filter, setFilter] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(workspaceNavGroups.map((g) => [g.id, true])),
  );

  const navIndex = useMemo(() => flattenWorkspaceNav(), []);
  const favoriteItems = useMemo(
    () =>
      favorites
        .map((href) => navIndex.find((n) => n.href === href))
        .filter(Boolean) as { title: string; href: string }[],
    [favorites, navIndex],
  );

  const handleNavigate = (title: string, href: string) => {
    addRecent(title, href);
    onNavigate?.();
  };

  const filterLower = filter.trim().toLowerCase();

  return (
    <aside
      data-zone="C"
      data-component="WS-SIDE"
      className={cn(
        "flex h-full shrink-0 flex-col border-r bg-muted/20 transition-[width] duration-200",
        collapsed ? "w-16" : "w-60",
        className,
      )}
      aria-label="Main navigation"
    >
      {!collapsed && (
        <div className="border-b p-2" data-component="WS-SIDE-SEARCH">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filter menu…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-8 pl-8 text-xs"
              aria-label="Filter sidebar navigation"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 text-xs">
        <nav className="space-y-1">
          <NavLink
            item={workspaceHomeItem}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={handleNavigate}
          />
          <NavLink
            item={workspaceDashboardItem}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={handleNavigate}
          />
        </nav>

        {!collapsed && favoriteItems.length > 0 && (
          <section className="mt-3" data-component="WS-SIDE-FAV">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Favorites
            </p>
            {favoriteItems.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                onClick={() => handleNavigate(f.title, f.href)}
                className="block truncate rounded-md px-2 py-1 text-xs hover:bg-accent"
              >
                {f.title}
              </Link>
            ))}
          </section>
        )}

        {!collapsed && recentPages.length > 0 && (
          <section className="mt-3">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Recent
            </p>
            {recentPages.slice(0, 10).map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => handleNavigate(p.title, p.href)}
                className="block truncate rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {p.title}
              </Link>
            ))}
          </section>
        )}

        {workspaceNavGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) =>
              !filterLower ||
              item.title.toLowerCase().includes(filterLower) ||
              group.title.toLowerCase().includes(filterLower),
          );
          if (filterLower && visibleItems.length === 0) return null;

          const open = openGroups[group.id] ?? true;
          return (
            <section key={group.id} className="mt-3">
              {!collapsed && (
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                  onClick={() => setOpenGroups((g) => ({ ...g, [group.id]: !open }))}
                  aria-expanded={open}
                >
                  {group.title}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition", open && "rotate-180")} />
                </button>
              )}
              {(collapsed || open) && (
                <div className="space-y-0.5">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      collapsed={collapsed}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="hidden border-t p-2 lg:block" data-component="WS-SIDE-COLLAPSE">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 px-2 text-xs"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <PanelLeftClose className="h-4 w-4 shrink-0" aria-hidden />
          )}
          {!collapsed && <span>Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}

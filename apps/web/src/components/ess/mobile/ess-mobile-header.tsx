"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Bell, Search, Sparkles } from "lucide-react";
import { getEssMobileRouteMeta } from "@/components/ess/mobile/ess-mobile-config";
import { useEssMobileStore } from "@/components/ess/mobile/ess-mobile-store";
import { useEssOnlineStatus } from "@/components/ess/mobile/use-ess-online-status";
import { getEssEmployeeContext } from "@/lib/mock-data/ess-portal";
import { ESS_ALL_NOTIFICATIONS } from "@/lib/mock-data/ess-portal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "dashboard" | "page";
  title?: string;
};

/** Sticky mobile header — search, notifications, AI entry */
export function EssMobileHeader({ variant, title: titleOverride }: Props) {
  const pathname = usePathname();
  const meta = getEssMobileRouteMeta(pathname);
  const headerVariant = variant ?? meta.header;
  const title = titleOverride ?? meta.title;

  const setSearchOpen = useEssMobileStore((s) => s.setSearchOpen);
  const setNotificationsOpen = useEssMobileStore((s) => s.setNotificationsOpen);
  const toggleEssAi = useEssMobileStore((s) => s.toggleEssAi);
  const { isOnline } = useEssOnlineStatus();

  const unreadCount = ESS_ALL_NOTIFICATIONS.filter((n) => n.unread).length;
  const { employee } = getEssEmployeeContext();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (headerVariant === "hidden") return null;

  if (headerVariant === "dashboard") {
    return (
      <header className="sticky top-0 z-30 border-b border-input bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-2 px-3 py-2">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
            aria-hidden
          >
            {employee.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-muted-foreground">{greeting}</p>
            <p className="truncate text-sm font-semibold">{employee.name}</p>
          </div>
          <HeaderActions
            unreadCount={unreadCount}
            isOnline={isOnline}
            onSearch={() => setSearchOpen(true)}
            onNotifications={() => setNotificationsOpen(true)}
            onAi={toggleEssAi}
          />
        </div>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="mx-3 mb-2 flex h-10 w-[calc(100%-1.5rem)] items-center gap-2 rounded-lg border border-input bg-muted/40 px-3 text-left text-sm text-muted-foreground"
          aria-label="Search employee portal"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden />
          Search leave, payslips, requests…
        </button>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-input bg-background/95 px-3 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" asChild>
        <Link href="/ess" aria-label="Back to dashboard">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <h1 className="min-w-0 flex-1 truncate text-base font-semibold">{title}</h1>
      <HeaderActions
        unreadCount={unreadCount}
        isOnline={isOnline}
        onSearch={() => setSearchOpen(true)}
        onNotifications={() => setNotificationsOpen(true)}
        onAi={toggleEssAi}
        compact
      />
    </header>
  );
}

function HeaderActions({
  unreadCount,
  isOnline,
  onSearch,
  onNotifications,
  onAi,
  compact,
}: {
  unreadCount: number;
  isOnline: boolean;
  onSearch: () => void;
  onNotifications: () => void;
  onAi: () => void;
  compact?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {!compact ? null : (
        <Button type="button" variant="ghost" size="icon" className="h-10 w-10" onClick={onSearch} aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative h-10 w-10"
        onClick={onNotifications}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("h-10 w-10", !isOnline && "opacity-60")}
        onClick={onAi}
        aria-label="AI Assistant"
      >
        <Sparkles className="h-4 w-4 text-violet-500" />
      </Button>
    </div>
  );
}

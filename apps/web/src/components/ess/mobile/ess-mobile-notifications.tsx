"use client";

import Link from "next/link";
import { useEssMobileStore } from "@/components/ess/mobile/ess-mobile-store";
import { ESS_ALL_NOTIFICATIONS } from "@/lib/mock-data/ess-portal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/** Mobile notifications sheet */
export function EssMobileNotifications() {
  const open = useEssMobileStore((s) => s.notificationsOpen);
  const setNotificationsOpen = useEssMobileStore((s) => s.setNotificationsOpen);

  const unread = ESS_ALL_NOTIFICATIONS.filter((n) => n.unread);

  return (
    <Sheet open={open} onOpenChange={setNotificationsOpen}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <div className="flex items-center justify-between border-b border-input px-4 py-3">
          <h2 className="text-base font-semibold">Notifications</h2>
          {unread.length > 0 ? (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              {unread.length} new
            </span>
          ) : null}
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto p-2">
          {ESS_ALL_NOTIFICATIONS.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href}
                onClick={() => setNotificationsOpen(false)}
                className={cn(
                  "mb-1 flex min-h-[64px] gap-3 rounded-xl p-3 transition-colors hover:bg-muted",
                  n.unread ? "bg-primary/5" : "",
                )}
              >
                <span
                  className={cn(
                    "mt-2 h-2 w-2 shrink-0 rounded-full",
                    n.unread ? "bg-blue-500" : "bg-transparent",
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{n.time}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-input p-3">
          <Button variant="outline" className="h-11 w-full" asChild onClick={() => setNotificationsOpen(false)}>
            <Link href="/ess/notifications">View all notifications</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

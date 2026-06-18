"use client";

import Link from "next/link";
import { CloudOff, RefreshCw, Wifi } from "lucide-react";
import { useEssMobileStore } from "@/components/ess/mobile/ess-mobile-store";
import { useEssOnlineStatus } from "@/components/ess/mobile/use-ess-online-status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Offline-ready UI banner — shows queue status and sync affordances */
export function EssOfflineBanner() {
  const { isOnline } = useEssOnlineStatus();
  const offlineQueue = useEssMobileStore((s) => s.offlineQueue);
  const setOfflineSimulated = useEssMobileStore((s) => s.setOfflineSimulated);
  const clearOfflineQueue = useEssMobileStore((s) => s.clearOfflineQueue);
  const offlineSimulated = useEssMobileStore((s) => s.offlineSimulated);

  if (isOnline && offlineQueue.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 border-b border-input bg-muted/30 px-3 py-1.5">
        <span className="text-[10px] text-muted-foreground">Offline-ready</span>
        <button
          type="button"
          className="text-[10px] font-medium text-primary underline-offset-2 hover:underline"
          onClick={() => setOfflineSimulated(true)}
        >
          Simulate offline
        </button>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "shrink-0 border-b px-3 py-2",
        isOnline
          ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40"
          : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40",
      )}
    >
      <div className="mx-auto flex max-w-3xl items-start gap-2 md:max-w-5xl lg:max-w-6xl">
        {isOnline ? (
          <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
        ) : (
          <CloudOff className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium">
            {isOnline
              ? `Syncing ${offlineQueue.length} queued action${offlineQueue.length === 1 ? "" : "s"}…`
              : "You are offline — changes will sync when connected"}
          </p>
          {!isOnline && offlineQueue.length > 0 ? (
            <ul className="mt-1 space-y-0.5">
              {offlineQueue.map((item) => (
                <li key={item.id} className="text-[10px] text-muted-foreground">
                  · {item.title}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-1">
          {isOnline && offlineQueue.length > 0 ? (
            <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={clearOfflineQueue}>
              Dismiss
            </Button>
          ) : null}
          {offlineSimulated ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-[10px]"
              onClick={() => setOfflineSimulated(false)}
            >
              <Wifi className="h-3 w-3" aria-hidden />
              Go online
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Compact offline indicator for queued form submits */
export function EssOfflineQueueHint() {
  const { isOnline } = useEssOnlineStatus();

  if (isOnline) return null;

  return (
    <p className="flex items-center gap-1.5 rounded-md border border-dashed border-amber-300 bg-amber-50/50 px-3 py-2 text-[11px] text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
      <CloudOff className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Offline mode — your request will be queued and submitted when back online.
      <Link href="/ess/requests" className="ml-auto font-medium underline">
        View queue
      </Link>
    </p>
  );
}

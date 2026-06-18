"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EssMobileAiAssistant } from "@/components/ess/mobile/ess-mobile-ai-assistant";
import { EssMobileBottomNav } from "@/components/ess/mobile/ess-mobile-bottom-nav";
import { getEssMobileRouteMeta } from "@/components/ess/mobile/ess-mobile-config";
import { EssMobileHeader } from "@/components/ess/mobile/ess-mobile-header";
import { EssMobileNotifications } from "@/components/ess/mobile/ess-mobile-notifications";
import { EssOfflineBanner } from "@/components/ess/mobile/ess-offline-banner";
import { EssMobileSearch } from "@/components/ess/mobile/ess-mobile-search";
import { ESS_MORE_LINKS } from "@/lib/mock-data/ess-portal";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  children: React.ReactNode;
};

/**
 * ESS mobile layout framework — SCR-ESS-SHELL-001
 * Bottom nav · sticky header · search · notifications · AI · offline banner
 */
export function EssMobileShell({ children }: Props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const meta = getEssMobileRouteMeta(pathname);

  return (
    <div className="flex min-h-dvh flex-col bg-background" data-ess-mobile-shell>
      <EssOfflineBanner />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col md:max-w-5xl lg:max-w-6xl">
        <EssMobileHeader variant={meta.header === "dashboard" ? "dashboard" : "page"} title={meta.title} />

        <main
          className="min-h-0 flex-1 overflow-y-auto pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-4"
          id="ess-main-content"
        >
          {children}
        </main>

        <div className="md:mt-2 md:px-0">
          <EssMobileBottomNav onMoreClick={() => setMoreOpen(true)} />
        </div>
      </div>

      <EssMobileSearch />
      <EssMobileNotifications />
      <EssMobileAiAssistant />

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="right" className="w-full max-w-sm">
          <h2 className="mb-4 text-base font-semibold">More</h2>
          <ul className="mt-4 space-y-1">
            {ESS_MORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium hover:bg-muted"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-input pt-2">
              <Link
                href="/ess/notifications"
                onClick={() => setMoreOpen(false)}
                className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium hover:bg-muted"
              >
                Notifications
              </Link>
            </li>
            <li>
              <Link
                href="/ess/ai"
                onClick={() => setMoreOpen(false)}
                className="flex min-h-[44px] items-center gap-2 rounded-md px-3 text-sm font-medium text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/40"
              >
                AI Assistant
              </Link>
            </li>
            <li>
              <Link
                href="/hr"
                onClick={() => setMoreOpen(false)}
                className="flex min-h-[44px] items-center rounded-md px-3 text-sm text-muted-foreground hover:bg-muted"
              >
                Switch to HR Admin →
              </Link>
            </li>
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  );
}

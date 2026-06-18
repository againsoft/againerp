"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  ESS_MOBILE_AI_NAV,
  ESS_MOBILE_PRIMARY_NAV,
} from "@/components/ess/mobile/ess-mobile-config";
import { cn } from "@/lib/utils";

type Props = {
  onMoreClick: () => void;
};

/** Persistent bottom navigation — 5 tabs + center AI + More */
export function EssMobileBottomNav({ onMoreClick }: Props) {
  const pathname = usePathname();
  const aiActive = ESS_MOBILE_AI_NAV.match(pathname);
  const AiIcon = ESS_MOBILE_AI_NAV.icon;

  const leftNav = ESS_MOBILE_PRIMARY_NAV.slice(0, 2);
  const rightNav = ESS_MOBILE_PRIMARY_NAV.slice(2);

  return (
    <nav
      aria-label="Employee portal navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-input bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:static md:rounded-lg md:border md:bg-card"
    >
      <div className="mx-auto flex h-[4.5rem] max-w-lg items-stretch px-1 pb-[env(safe-area-inset-bottom)] md:max-w-none md:justify-center md:gap-1 md:px-2 md:pb-0">
        {leftNav.map((item) => (
          <NavItem key={item.id} item={item} pathname={pathname} />
        ))}

        <Link
          href={ESS_MOBILE_AI_NAV.href}
          className={cn(
            "relative -mt-4 flex min-h-[44px] min-w-[52px] flex-col items-center justify-center gap-0.5 rounded-full px-2",
            aiActive ? "text-violet-600" : "text-muted-foreground",
          )}
          aria-current={aiActive ? "page" : undefined}
        >
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-colors",
              aiActive
                ? "bg-violet-600 text-white"
                : "border border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-800 dark:bg-violet-950",
            )}
          >
            <AiIcon className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-[9px] font-semibold">{ESS_MOBILE_AI_NAV.label}</span>
        </Link>

        {rightNav.map((item) => (
          <NavItem key={item.id} item={item} pathname={pathname} />
        ))}

        <button
          type="button"
          onClick={onMoreClick}
          className="flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-1 py-1 text-[9px] font-medium text-muted-foreground hover:text-foreground md:flex-none md:min-w-[72px] md:text-xs"
          aria-label="More menu"
        >
          <Menu className="h-5 w-5 shrink-0 md:h-4 md:w-4" aria-hidden />
          More
        </button>
      </div>
    </nav>
  );
}

function NavItem({
  item,
  pathname,
}: {
  item: (typeof ESS_MOBILE_PRIMARY_NAV)[number];
  pathname: string;
}) {
  const active = item.match(pathname);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-1 py-1 text-[9px] font-medium transition-colors md:flex-none md:min-w-[72px] md:flex-row md:gap-2 md:px-3 md:text-xs",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-5 w-5 shrink-0 md:h-4 md:w-4" aria-hidden />
      <span className="leading-tight">{item.label}</span>
    </Link>
  );
}

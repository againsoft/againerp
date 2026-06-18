"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, FileText, Search, Sparkles, Wallet, X } from "lucide-react";
import { useEssMobileStore } from "@/components/ess/mobile/ess-mobile-store";
import { ESS_MOBILE_SEARCH_INDEX } from "@/lib/mock-data/ess-portal";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  page: Search,
  action: Sparkles,
  record: FileText,
  payslip: Wallet,
  attendance: Clock,
} as const;

/** Full-screen mobile search sheet */
export function EssMobileSearch() {
  const open = useEssMobileStore((s) => s.searchOpen);
  const setSearchOpen = useEssMobileStore((s) => s.setSearchOpen);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ESS_MOBILE_SEARCH_INDEX.slice(0, 8);
    return ESS_MOBILE_SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q)),
    );
  }, [query]);

  const navigate = (href: string) => {
    setSearchOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Sheet open={open} onOpenChange={setSearchOpen}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <div className="border-b border-input px-4 py-3">
          <h2 className="text-base font-semibold">Search</h2>
        </div>
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Leave, payslips, attendance, training…"
              className="h-11 pl-9 pr-9"
              autoFocus
              aria-label="Search query"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md hover:bg-muted"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {query ? "Results" : "Quick links"}
          </p>
          <ul className="space-y-1">
            {results.length === 0 ? (
              <li className="px-3 py-8 text-center text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</li>
            ) : (
              results.map((item) => {
                const Icon = CATEGORY_ICONS[item.category];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => navigate(item.href)}
                      className="flex min-h-[52px] w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{item.title}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">{item.subtitle}</span>
                      </span>
                      <BadgeCategory category={item.category} />
                    </button>
                  </li>
                );
              })
            )}
          </ul>
          <div className="mt-4 border-t border-input px-2 pt-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Ask AI</p>
            <button
              type="button"
              onClick={() => navigate("/ess/ai")}
              className="flex min-h-[44px] w-full items-center gap-2 rounded-lg border border-violet-200 bg-violet-50/50 px-3 text-sm font-medium text-violet-800 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-200"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              &ldquo;{query || "How many leave days do I have?"}&rdquo;
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BadgeCategory({ category }: { category: keyof typeof CATEGORY_ICONS }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium capitalize text-muted-foreground",
        category === "action" && "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
      )}
    >
      {category}
    </span>
  );
}

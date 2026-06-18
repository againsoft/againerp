"use client";

import { Suspense, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ApprovalCenterNav, resolveApprovalNavView } from "@/components/approvals/approval-center-nav";
import { ApprovalDashboard } from "@/components/approvals/approval-dashboard";
import { ApprovalDetailSheet } from "@/components/approvals/approval-detail-sheet";
import { ApprovalInbox } from "@/components/approvals/approval-inbox";
import { getApprovalById } from "@/lib/mock-data/approval-center";
import { cn } from "@/lib/utils";

type Props = {
  mode?: "default" | "history";
};

function ApprovalCenterContent({ mode = "default" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewId = searchParams.get("view");

  const isHistory = mode === "history" || pathname.startsWith("/inbox/approvals/history");
  const navView = isHistory ? "history" : resolveApprovalNavView(pathname, searchParams);
  const showDashboard =
    !isHistory &&
    navView === "dashboard" &&
    pathname === "/inbox/approvals" &&
    !searchParams.get("status") &&
    !searchParams.get("assignee");

  const approval = viewId ? getApprovalById(viewId) : null;

  const handleDrawerChange = useCallback(
    (open: boolean) => {
      if (open) return;
      const params = new URLSearchParams(searchParams.toString());
      params.delete("view");
      const base = isHistory ? "/inbox/approvals/history" : "/inbox/approvals";
      const query = params.toString();
      router.push(query ? `${base}?${query}` : base);
    },
    [router, searchParams, isHistory],
  );

  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col gap-4 lg:min-h-[calc(100vh-2.75rem-2rem)] lg:flex-row lg:gap-6">
      <aside className="shrink-0 lg:w-52">
        <p className="mb-2 hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:block">
          Approval Center
        </p>
        <div className="lg:hidden overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ApprovalCenterNav className="flex-row gap-1" />
        </div>
        <div className="hidden lg:block">
          <ApprovalCenterNav />
        </div>
      </aside>

      <main className={cn("min-w-0 flex-1", showDashboard ? "" : "flex flex-col")}>
        {showDashboard ? <ApprovalDashboard /> : <ApprovalInbox mode={isHistory ? "history" : "inbox"} />}
      </main>

      <ApprovalDetailSheet open={!!viewId && !!approval} onOpenChange={handleDrawerChange} approval={approval ?? null} />
    </div>
  );
}

export function ApprovalCenter(props: Props) {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading approval center…</div>}>
      <ApprovalCenterContent {...props} />
    </Suspense>
  );
}

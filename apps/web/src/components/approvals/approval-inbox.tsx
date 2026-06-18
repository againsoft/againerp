"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, GanttChart, LayoutGrid, List, RefreshCw, Search } from "lucide-react";
import { ApprovalKanbanView } from "@/components/approvals/approval-kanban-view";
import { ApprovalListTable } from "@/components/approvals/approval-list-table";
import { ApprovalTimelineView } from "@/components/approvals/approval-timeline-view";
import {
  getApprovalViewTitle,
  resolveApprovalNavView,
  type ApprovalNavView,
} from "@/components/approvals/approval-center-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  APPROVAL_MODULES,
  APPROVAL_PRIORITIES,
  filterApprovals,
  getApprovalRequests,
} from "@/lib/mock-data/approval-center";
import { cn } from "@/lib/utils";

export type ApprovalLayoutMode = "list" | "kanban" | "timeline";

const VIEW_MODES: { id: ApprovalLayoutMode; label: string; icon: typeof List }[] = [
  { id: "list", label: "List", icon: List },
  { id: "kanban", label: "Kanban", icon: LayoutGrid },
  { id: "timeline", label: "Timeline", icon: GanttChart },
];

type Props = {
  mode?: "inbox" | "history";
};

function ApprovalInboxContent({ mode = "inbox" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [layout, setLayout] = useState<ApprovalLayoutMode>("list");
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const navView: ApprovalNavView =
    mode === "history" ? "history" : resolveApprovalNavView(pathname, searchParams);
  const status = searchParams.get("status");
  const assigneeMe = searchParams.get("assignee") === "me";

  const items = useMemo(() => {
    return filterApprovals(getApprovalRequests(), {
      status: mode === "history" ? null : assigneeMe ? null : status,
      assigneeMe,
      delegated: status === "delegated",
      history: mode === "history",
      module: moduleFilter,
      priority: priorityFilter,
      search: search || undefined,
    });
  }, [mode, status, assigneeMe, moduleFilter, priorityFilter, search]);

  const openDetail = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", id);
      const base = mode === "history" ? "/inbox/approvals/history" : "/inbox/approvals";
      router.push(`${base}?${params.toString()}`);
    },
    [router, searchParams, mode],
  );

  const selectClass =
    "h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="page-title">{getApprovalViewTitle(navView)}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{items.length} requests</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="View mode"
            className="flex rounded-md border border-input p-0.5"
          >
            {VIEW_MODES.map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setLayout(v.id)}
                  className={cn(
                    "flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors",
                    layout === v.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-pressed={layout === v.id}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              );
            })}
          </div>
          <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" disabled>
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" disabled>
            <Download className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Search requests…"
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search approvals"
          />
        </div>
        <select
          aria-label="Module filter"
          className={selectClass}
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
        >
          {APPROVAL_MODULES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Priority filter"
          className={selectClass}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          {APPROVAL_PRIORITIES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {layout === "list" ? <ApprovalListTable items={items} onRowClick={openDetail} /> : null}
      {layout === "kanban" ? <ApprovalKanbanView items={items} onCardClick={openDetail} /> : null}
      {layout === "timeline" ? <ApprovalTimelineView items={items} onItemClick={openDetail} /> : null}
    </div>
  );
}

export function ApprovalInbox(props: Props) {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading approvals…</div>}>
      <ApprovalInboxContent {...props} />
    </Suspense>
  );
}

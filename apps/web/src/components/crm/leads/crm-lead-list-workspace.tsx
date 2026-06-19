"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { CrmBulkBar } from "@/components/crm/crm-bulk-bar";
import { CrmListToolbar } from "@/components/crm/crm-list-toolbar";
import { CrmPageHeader } from "@/components/crm/crm-page-header";
import { CrmLeadDetailSheet } from "@/components/crm/leads/crm-lead-detail-sheet";
import { CrmLeadFormSheet } from "@/components/crm/leads/crm-lead-form-sheet";
import {
  CrmEmptyLeads,
  CrmLeadMobileList,
  CrmLeadTable,
} from "@/components/crm/leads/crm-lead-table";
import { Button } from "@/components/ui/button";
import { getCrmLeadById } from "@/lib/mock-data/crm/leads";
import {
  CRM_LEAD_STATUSES,
  CRM_LEAD_STATUS_LABELS,
  type CrmLead,
  type CrmLeadDetailTab,
} from "@/lib/mock-data/crm/types";
import { useCrmStore } from "@/lib/store/crm-store";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;

function buildUrl(params: URLSearchParams) {
  const q = params.toString();
  return q ? `/crm/leads?${q}` : "/crm/leads";
}

function LeadListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leads = useCrmStore((s) => s.leads);

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const tabParam = searchParams.get("tab") ?? "overview";
  const qParam = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(qParam);
  const [debouncedSearch, setDebouncedSearch] = useState(qParam);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? searchParams.get("filter") ?? "all");
  const [ownerFilter, setOwnerFilter] = useState(searchParams.get("owner") ?? "all");
  const [savedView, setSavedView] = useState(searchParams.get("savedView") ?? "all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);

  const pushParams = (mutate: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    pushParams((p) => {
      if (debouncedSearch) p.set("q", debouncedSearch);
      else p.delete("q");
    });
  }, [debouncedSearch]);

  const resolveLead = (id: string | null): CrmLead | null => {
    if (!id) return null;
    return leads.find((l) => l.id === id) ?? getCrmLeadById(id) ?? null;
  };

  const viewLead = useMemo(() => resolveLead(viewId), [viewId, leads]);
  const editLead = useMemo(() => resolveLead(editId), [editId, leads]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return leads.filter((l) => {
      if (statusFilter === "open" && ["converted", "lost"].includes(l.status)) return false;
      if (statusFilter !== "all" && statusFilter !== "open" && l.status !== statusFilter) return false;
      if (ownerFilter === "my" && l.ownerId !== "karim") return false;
      if (ownerFilter !== "all" && ownerFilter !== "my" && ownerFilter !== "unassigned" && l.ownerId !== ownerFilter)
        return false;
      if (savedView === "hot" && l.score < 80) return false;
      if (savedView === "stale" && !l.lastActivityRelative.includes("d")) return false;
      if (q && !`${l.name} ${l.email} ${l.company}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [leads, debouncedSearch, statusFilter, ownerFilter, savedView]);

  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: "open", label: "Open" },
    ...CRM_LEAD_STATUSES.map((s) => ({ value: s, label: CRM_LEAD_STATUS_LABELS[s] })),
  ];

  const openCreate = () =>
    pushParams((p) => {
      p.delete("edit");
      p.delete("view");
      p.set("create", "1");
    });

  const openView = (lead: CrmLead, tab?: CrmLeadDetailTab) => {
    pushParams((p) => {
      p.delete("create");
      p.delete("edit");
      p.set("view", lead.id);
      if (tab) p.set("tab", tab);
      else p.delete("tab");
    });
  };

  const openEdit = (lead: CrmLead) => {
    pushParams((p) => {
      p.delete("create");
      p.delete("view");
      p.set("edit", lead.id);
    });
  };

  const closeDrawer = () => {
    pushParams((p) => {
      p.delete("create");
      p.delete("edit");
      p.delete("view");
      p.delete("tab");
    });
  };

  return (
    <div className="space-y-4" data-layout="LAYOUT-LIST">
      <CrmPageHeader
        title="Leads"
        subtitle="Capture, qualify, and convert inbound and outbound leads."
        onCreate={openCreate}
        createLabel="Create Lead"
      />

      <CrmListToolbar
        search={searchInput}
        onSearchChange={setSearchInput}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        ownerFilter={ownerFilter}
        onOwnerChange={setOwnerFilter}
        savedView={savedView}
        onSavedViewChange={setSavedView}
        statusOptions={statusOptions}
      />

      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">{filtered.length} leads</span>
        <span className="text-muted-foreground">·</span>
        <Link href="/crm/pipeline" className="inline-flex items-center gap-1 text-primary hover:underline">
          <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
          Pipeline view
        </Link>
        <span className="ml-auto flex gap-1">
          <Button type="button" variant="outline" size="sm" className="h-8 gap-1" aria-pressed>
            <List className="h-3.5 w-3.5" aria-hidden />
            List
          </Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 gap-1" asChild>
            <Link href="/crm/pipeline">
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
              Kanban
            </Link>
          </Button>
        </span>
      </div>

      <CrmBulkBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
      />

      {filtered.length === 0 ? (
        <CrmEmptyLeads onCreate={openCreate} />
      ) : (
        <>
          <CrmLeadTable
            leads={pageRows}
            selectedIds={selectedIds}
            onToggleSelect={(id) =>
              setSelectedIds((prev) => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              })
            }
            onToggleAll={(checked) =>
              setSelectedIds(checked ? new Set(pageRows.map((l) => l.id)) : new Set())
            }
            onView={openView}
          />
          <CrmLeadMobileList leads={pageRows} onView={openView} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="h-8" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <CrmLeadDetailSheet
        open={!!viewId && !!viewLead}
        onOpenChange={(o) => !o && closeDrawer()}
        lead={viewLead}
        tab={tabParam}
        onTabChange={(t) =>
          pushParams((p) => {
            p.set("tab", t);
          })
        }
        onEdit={openEdit}
      />

      <CrmLeadFormSheet open={createOpen} onOpenChange={(o) => !o && closeDrawer()} mode="create" />
      <CrmLeadFormSheet
        open={!!editId && !!editLead}
        onOpenChange={(o) => !o && closeDrawer()}
        mode="edit"
        lead={editLead}
      />
    </div>
  );
}

export function CrmLeadListWorkspace() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading leads…</div>}>
      <LeadListContent />
    </Suspense>
  );
}

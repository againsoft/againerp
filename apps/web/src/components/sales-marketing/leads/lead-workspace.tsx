"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PaginationState, RowSelectionState, SortingState } from "@tanstack/react-table";
import {
  Archive,
  Download,
  LayoutGrid,
  List,
  Plus,
  Table2,
  Tag,
  UserCog,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { LeadCompactList } from "@/components/sales-marketing/leads/lead-compact-list";
import { LeadFormSheet } from "@/components/sales-marketing/leads/lead-form-sheet";
import { LeadInsightsRail } from "@/components/sales-marketing/leads/lead-insights-rail";
import { LeadKanban } from "@/components/sales-marketing/leads/lead-kanban";
import { LeadTable, getSelectedLeads } from "@/components/sales-marketing/leads/lead-table";
import { LeadViewSheet } from "@/components/sales-marketing/leads/lead-view-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  countLeadsByStatus,
  getLeadById,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_SOURCE_LABELS,
  SMW_LEAD_OWNERS,
  SMW_LEAD_SAVED_VIEWS,
  SMW_LEAD_TERRITORIES,
  smwLeadsSeed,
  type LeadSource,
  type LeadStatus,
  type SmwLead,
} from "@/lib/mock-data/smw-leads";
import { useSmwLeadStore } from "@/lib/store/smw-lead-store";
import { cn } from "@/lib/utils";

type LayoutMode = "table" | "kanban" | "compact";

const PAGE_SIZE = 25;

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/sales-marketing/leads?${query}` : "/sales-marketing/leads";
}

function LeadWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeLeads = useSmwLeadStore((s) => s.leads);
  const updateStatus = useSmwLeadStore((s) => s.updateStatus);
  const assignOwner = useSmwLeadStore((s) => s.assignOwner);
  const archiveLeads = useSmwLeadStore((s) => s.archiveLeads);
  const leads = storeLeads.length > 0 ? storeLeads : smwLeadsSeed;

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const layout = (searchParams.get("layout") as LayoutMode) || "table";
  const statusParam = searchParams.get("status");
  const sourceParam = searchParams.get("source");
  const ownerParam = searchParams.get("owner");
  const territoryParam = searchParams.get("territory");
  const savedViewParam = searchParams.get("savedView");
  const qParam = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(qParam);
  const [debouncedSearch, setDebouncedSearch] = useState(qParam);
  const [scoreMin, setScoreMin] = useState("");
  const [scoreMax, setScoreMax] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(
    statusParam === "open" ? "open" : statusParam && LEAD_STATUSES.includes(statusParam as LeadStatus) ? statusParam : "all",
  );
  const [sourceFilter, setSourceFilter] = useState(sourceParam ?? "all");
  const [ownerFilter, setOwnerFilter] = useState(ownerParam ?? "all");
  const [territoryFilter, setTerritoryFilter] = useState(territoryParam ?? "all");
  const [savedView, setSavedView] = useState(savedViewParam ?? "all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "score", desc: true }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    pushParams((params) => {
      if (debouncedSearch) params.set("q", debouncedSearch);
      else params.delete("q");
    });
  }, [debouncedSearch]);

  const resolveLead = (id: string | null) => {
    if (!id) return null;
    return leads.find((l) => l.id === id) ?? getLeadById(id) ?? null;
  };

  const editLead = useMemo(() => resolveLead(editId), [editId, leads]);
  const viewLead = useMemo(() => resolveLead(viewId), [viewId, leads]);

  const counts = useMemo(() => countLeadsByStatus(leads), [leads]);

  const filteredRows = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    const saved = SMW_LEAD_SAVED_VIEWS.find((v) => v.id === savedView);

    return leads.filter((l) => {
      if (l.archived) return false;

      if (saved?.id === "hot" && l.score < 80) return false;
      if (saved?.id === "open" && (l.status === "converted" || l.status === "unqualified")) return false;
      if (saved?.ownerId && l.ownerId !== saved.ownerId) return false;
      if (saved?.stale && !l.lastActivityRelative.includes("d ago") && !l.lastActivityRelative.includes("w")) {
        return false;
      }

      if (statusFilter === "open") {
        if (l.status === "converted" || l.status === "unqualified") return false;
      } else if (statusFilter !== "all" && l.status !== statusFilter) {
        return false;
      }

      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (ownerFilter !== "all" && l.ownerId !== ownerFilter) return false;
      if (territoryFilter !== "all" && l.territoryId !== territoryFilter) return false;
      if (scoreMin && l.score < Number(scoreMin)) return false;
      if (scoreMax && l.score > Number(scoreMax)) return false;

      if (
        q &&
        !l.name.toLowerCase().includes(q) &&
        !l.company.toLowerCase().includes(q) &&
        !l.email.toLowerCase().includes(q) &&
        !l.leadNumber.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [
    leads,
    debouncedSearch,
    statusFilter,
    sourceFilter,
    ownerFilter,
    territoryFilter,
    scoreMin,
    scoreMax,
    savedView,
  ]);

  const selectedLeads = useMemo(
    () => getSelectedLeads(filteredRows, rowSelection),
    [filteredRows, rowSelection],
  );

  const paginatedRows = useMemo(
    () =>
      filteredRows.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize,
      ),
    [filteredRows, pagination],
  );

  const openCreate = () => {
    pushParams((params) => {
      params.delete("edit");
      params.delete("view");
      params.set("create", "1");
    });
  };

  const handleEdit = (lead: SmwLead) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("view");
      params.set("edit", lead.id);
    });
  };

  const handleView = (lead: SmwLead) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", lead.id);
    });
  };

  const closeForm = () => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
    });
  };

  const closeView = () => {
    pushParams((params) => {
      params.delete("view");
    });
  };

  const handleSaved = (lead: SmwLead) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", lead.id);
    });
  };

  const setLayout = (mode: LayoutMode) => {
    pushParams((params) => {
      if (mode === "table") params.delete("layout");
      else params.set("layout", mode);
    });
  };

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setSourceFilter("all");
    setOwnerFilter("all");
    setTerritoryFilter("all");
    setScoreMin("");
    setScoreMax("");
    setSavedView("all");
    setPagination((p) => ({ ...p, pageIndex: 0 }));
    pushParams((params) => {
      ["q", "status", "source", "owner", "territory", "savedView"].forEach((k) => params.delete(k));
    });
  };

  const activeFilterCount = [
    debouncedSearch,
    statusFilter !== "all",
    sourceFilter !== "all",
    ownerFilter !== "all",
    territoryFilter !== "all",
    scoreMin,
    scoreMax,
    savedView !== "all",
  ].filter(Boolean).length;

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debouncedSearch, statusFilter, sourceFilter, ownerFilter, territoryFilter, savedView, layout]);

  useEffect(() => {
    if (editId && !editLead) {
      toast.error("Lead not found");
      closeForm();
    }
  }, [editId, editLead]);

  useEffect(() => {
    if (viewId && !viewLead && !editId && !createOpen) {
      toast.error("Lead not found");
      closeView();
    }
  }, [viewId, viewLead, editId, createOpen]);

  const isEmpty = leads.filter((l) => !l.archived).length === 0;
  const noResults = !isEmpty && filteredRows.length === 0;

  return (
    <>
      {/* Status tabs */}
      <div className="flex flex-wrap gap-0.5 overflow-x-auto rounded-lg border border-input bg-muted/30 p-1">
        {(
          [
            { value: "all" as const, label: "All" },
            { value: "open" as const, label: "Open" },
            ...LEAD_STATUSES.map((s) => ({ value: s, label: LEAD_STATUS_LABELS[s] })),
          ] as const
        ).map((tab) => {
          const count = counts[tab.value] ?? 0;
          const active = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
              )}
            >
              {tab.label}
              <span className={cn("ml-1.5 tabular-nums", active ? "text-foreground" : "text-muted-foreground/70")}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          placeholder="Search name, company, email, lead #…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-8 max-w-[260px] text-xs"
          aria-label="Search leads"
        />
        <Select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="h-8 w-[130px] text-xs"
          aria-label="Source filter"
        >
          <option value="all">All sources</option>
          {(Object.keys(LEAD_SOURCE_LABELS) as LeadSource[]).map((s) => (
            <option key={s} value={s}>
              {LEAD_SOURCE_LABELS[s]}
            </option>
          ))}
        </Select>
        <Select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          className="h-8 w-[140px] text-xs"
          aria-label="Owner filter"
        >
          <option value="all">All owners</option>
          {SMW_LEAD_OWNERS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </Select>
        <Select
          value={territoryFilter}
          onChange={(e) => setTerritoryFilter(e.target.value)}
          className="h-8 w-[130px] text-xs"
          aria-label="Territory filter"
        >
          <option value="all">All territories</option>
          {SMW_LEAD_TERRITORIES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
        <Select
          value={savedView}
          onChange={(e) => setSavedView(e.target.value)}
          className="h-8 w-[130px] text-xs"
          aria-label="Saved views"
        >
          {SMW_LEAD_SAVED_VIEWS.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </Select>

        {activeFilterCount > 0 && (
          <Button type="button" variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={resetFilters}>
            <X className="mr-1 h-3.5 w-3.5" aria-hidden />
            Clear
          </Button>
        )}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-input p-0.5">
            {(
              [
                { id: "table" as const, icon: Table2, label: "Table" },
                { id: "kanban" as const, icon: LayoutGrid, label: "Kanban" },
                { id: "compact" as const, icon: List, label: "Compact" },
              ] as const
            ).map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                type="button"
                variant={layout === id ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2"
                onClick={() => setLayout(id)}
                aria-label={label}
                aria-pressed={layout === id}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </Button>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => toast.success(`Export · ${filteredRows.length} leads`)}>
            <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Export
          </Button>
          <Button type="button" size="sm" className="h-8" onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            New lead
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>
          {filteredRows.length} lead{filteredRows.length === 1 ? "" : "s"}
          {activeFilterCount > 0 ? " · filtered" : ""}
        </span>
        <Input
          type="number"
          placeholder="Score min"
          value={scoreMin}
          onChange={(e) => setScoreMin(e.target.value)}
          className="h-7 w-20 text-xs"
          aria-label="Minimum score"
        />
        <Input
          type="number"
          placeholder="Score max"
          value={scoreMax}
          onChange={(e) => setScoreMax(e.target.value)}
          className="h-7 w-20 text-xs"
          aria-label="Maximum score"
        />
      </div>

      {selectedLeads.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
          <span className="text-xs font-medium">{selectedLeads.length} selected</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7"
            onClick={() => {
              assignOwner(selectedLeads.map((l) => l.id), "karim", "Karim Hassan");
              toast.success(`Assigned ${selectedLeads.length} leads to Karim Hassan`);
              setRowSelection({});
            }}
          >
            <UserCog className="mr-1 h-3.5 w-3.5" aria-hidden />
            Assign
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7"
            onClick={() => toast.info("Tag leads — prototype")}
          >
            <Tag className="mr-1 h-3.5 w-3.5" aria-hidden />
            Tag
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7"
            onClick={() => toast.success(`Export · ${selectedLeads.length} selected`)}
          >
            <Download className="mr-1 h-3.5 w-3.5" aria-hidden />
            Export
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7"
            onClick={() => {
              archiveLeads(selectedLeads.map((l) => l.id));
              toast.success(`Archived ${selectedLeads.length} leads`);
              setRowSelection({});
            }}
          >
            <Archive className="mr-1 h-3.5 w-3.5" aria-hidden />
            Archive
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto h-7 w-7 p-0"
            onClick={() => setRowSelection({})}
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      )}

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-12">
        <div className="min-h-0 xl:col-span-9">
          {isEmpty ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-input p-8 text-center">
              <p className="text-sm font-medium">No leads yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Capture your first lead to start the pipeline.</p>
              <Button type="button" size="sm" className="mt-4" onClick={openCreate}>
                Create lead
              </Button>
            </div>
          ) : noResults ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-input p-8 text-center">
              <p className="text-sm font-medium">No matches</p>
              <p className="mt-1 text-xs text-muted-foreground">Try adjusting filters or search.</p>
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
                Clear filters
              </Button>
            </div>
          ) : layout === "kanban" ? (
            <LeadKanban
              leads={filteredRows}
              onView={handleView}
              onStatusChange={(id, status) => {
                updateStatus(id, status);
                toast.success(`Status updated to ${LEAD_STATUS_LABELS[status]}`);
              }}
            />
          ) : layout === "compact" ? (
            <LeadCompactList leads={paginatedRows} onView={handleView} />
          ) : (
            <LeadTable
              className="min-h-0 flex-1"
              data={filteredRows}
              sorting={sorting}
              onSortingChange={setSorting}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              pagination={pagination}
              onPaginationChange={setPagination}
              onView={handleView}
              onEdit={handleEdit}
            />
          )}
        </div>
        <LeadInsightsRail leads={filteredRows} className="hidden xl:col-span-3 xl:block" />
      </div>

      <LeadViewSheet
        open={!!viewLead && !createOpen && !editLead}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        lead={viewLead}
        onEdit={handleEdit}
        onConvert={(lead) => updateStatus(lead.id, "converted")}
      />

      <LeadFormSheet
        open={createOpen || !!editLead}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
        mode={createOpen ? "create" : "edit"}
        lead={editLead}
        onSaved={handleSaved}
      />
    </>
  );
}

export function LeadWorkspace() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading leads…</p>}>
      <LeadWorkspaceContent />
    </Suspense>
  );
}

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BarChart3, LayoutGrid, Plus, Table2, X } from "lucide-react";
import { toast } from "sonner";
import { OpportunityForecastStrip } from "@/components/sales-marketing/opportunities/opportunity-forecast-strip";
import { OpportunityForecastView } from "@/components/sales-marketing/opportunities/opportunity-forecast-view";
import { OpportunityFormSheet } from "@/components/sales-marketing/opportunities/opportunity-form-sheet";
import { OpportunityKanban } from "@/components/sales-marketing/opportunities/opportunity-kanban";
import { OpportunityTable } from "@/components/sales-marketing/opportunities/opportunity-table";
import { OpportunityViewSheet } from "@/components/sales-marketing/opportunities/opportunity-view-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  getOpportunityById,
  smwOpportunitiesSeed,
  type SmwOpportunity,
} from "@/lib/mock-data/smw-opportunities";
import { SMW_OPP_OWNERS, SMW_OPP_TERRITORIES } from "@/lib/mock-data/smw-opportunities";
import { useSmwOpportunityStore } from "@/lib/store/smw-opportunity-store";

type LayoutMode = "kanban" | "table" | "forecast";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/sales-marketing/opportunities?${query}` : "/sales-marketing/opportunities";
}

function OpportunityPipelineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeOpps = useSmwOpportunityStore((s) => s.opportunities);
  const moveStage = useSmwOpportunityStore((s) => s.moveStage);
  const opportunities = storeOpps.length > 0 ? storeOpps : smwOpportunitiesSeed;

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const layoutParam = searchParams.get("layout");
  const layout: LayoutMode =
    layoutParam === "table" || layoutParam === "forecast" ? layoutParam : "kanban";
  const ownerParam = searchParams.get("owner") ?? "all";
  const territoryParam = searchParams.get("territory") ?? "all";
  const qParam = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(qParam);
  const [debouncedSearch, setDebouncedSearch] = useState(qParam);
  const [ownerFilter, setOwnerFilter] = useState(ownerParam);
  const [territoryFilter, setTerritoryFilter] = useState(territoryParam);

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

  const resolveOpp = (id: string | null) => {
    if (!id) return null;
    return opportunities.find((o) => o.id === id) ?? getOpportunityById(id) ?? null;
  };

  const editOpp = useMemo(() => resolveOpp(editId), [editId, opportunities]);
  const viewOpp = useMemo(() => resolveOpp(viewId), [viewId, opportunities]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return opportunities.filter((o) => {
      if (ownerFilter !== "all" && o.ownerId !== ownerFilter) return false;
      if (territoryFilter !== "all" && o.territoryId !== territoryFilter) return false;
      if (
        q &&
        !o.title.toLowerCase().includes(q) &&
        !o.accountName.toLowerCase().includes(q) &&
        !o.opportunityNumber.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [opportunities, debouncedSearch, ownerFilter, territoryFilter]);

  const openCreate = () => {
    pushParams((params) => {
      params.delete("edit");
      params.delete("view");
      params.set("create", "1");
    });
  };

  const handleEdit = (opp: SmwOpportunity) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("view");
      params.set("edit", opp.id);
    });
  };

  const handleView = (opp: SmwOpportunity) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", opp.id);
    });
  };

  const closeForm = () => pushParams((p) => { p.delete("create"); p.delete("edit"); });
  const closeView = () => pushParams((p) => p.delete("view"));

  const handleSaved = (opp: SmwOpportunity) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", opp.id);
    });
  };

  const setLayout = (mode: LayoutMode) => {
    pushParams((params) => {
      if (mode === "kanban") params.delete("layout");
      else params.set("layout", mode);
    });
  };

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setOwnerFilter("all");
    setTerritoryFilter("all");
    pushParams((params) => {
      params.delete("q");
      params.delete("owner");
      params.delete("territory");
    });
  };

  const activeFilters = [debouncedSearch, ownerFilter !== "all", territoryFilter !== "all"].filter(Boolean).length;

  useEffect(() => {
    if (editId && !editOpp) { toast.error("Deal not found"); closeForm(); }
  }, [editId, editOpp]);

  useEffect(() => {
    if (viewId && !viewOpp && !editId && !createOpen) { toast.error("Deal not found"); closeView(); }
  }, [viewId, viewOpp, editId, createOpen]);

  const isEmpty = opportunities.length === 0;

  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          placeholder="Search deals, accounts…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-8 max-w-[240px] text-xs"
          aria-label="Search opportunities"
        />
        <Select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="h-8 w-[140px] text-xs" aria-label="Owner">
          <option value="all">All owners</option>
          {SMW_OPP_OWNERS.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </Select>
        <Select value={territoryFilter} onChange={(e) => setTerritoryFilter(e.target.value)} className="h-8 w-[130px] text-xs" aria-label="Territory">
          <option value="all">All territories</option>
          {SMW_OPP_TERRITORIES.filter((t) => t.id !== "all").map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </Select>
        {activeFilters > 0 && (
          <Button type="button" variant="ghost" size="sm" className="h-8" onClick={resetFilters}>
            <X className="mr-1 h-3.5 w-3.5" aria-hidden /> Clear
          </Button>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          <div className="flex rounded-md border border-input p-0.5">
            {(
              [
                { id: "kanban" as const, icon: LayoutGrid, label: "Pipeline" },
                { id: "table" as const, icon: Table2, label: "Table" },
                { id: "forecast" as const, icon: BarChart3, label: "Forecast" },
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
          <Button type="button" size="sm" className="h-8" onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden /> New deal
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} deal{filtered.length === 1 ? "" : "s"}
        {activeFilters > 0 ? " · filtered" : ""}
      </p>

      {isEmpty ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm font-medium">No deals in pipeline</p>
          <Button type="button" size="sm" className="mt-4" onClick={openCreate}>Create deal</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm font-medium">No matches</p>
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={resetFilters}>Clear filters</Button>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          {layout === "forecast" ? (
            <OpportunityForecastView opportunities={filtered} />
          ) : layout === "table" ? (
            <OpportunityTable data={filtered} onView={handleView} onEdit={handleEdit} />
          ) : (
            <OpportunityKanban
              opportunities={filtered}
              onView={handleView}
              onMoveStage={(id, stage) => moveStage(id, stage)}
            />
          )}
          {(layout === "kanban" || layout === "table") && (
            <OpportunityForecastStrip opportunities={filtered} />
          )}
        </div>
      )}

      <OpportunityViewSheet
        open={!!viewOpp && !createOpen && !editOpp}
        onOpenChange={(open) => { if (!open) closeView(); }}
        opportunity={viewOpp}
        onEdit={handleEdit}
      />
      <OpportunityFormSheet
        open={createOpen || !!editOpp}
        onOpenChange={(open) => { if (!open) closeForm(); }}
        mode={createOpen ? "create" : "edit"}
        opportunity={editOpp}
        onSaved={handleSaved}
      />
    </>
  );
}

export function OpportunityPipeline() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading pipeline…</p>}>
      <OpportunityPipelineContent />
    </Suspense>
  );
}

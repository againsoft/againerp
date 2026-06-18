"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { TargetFormSheet } from "@/components/sales-marketing/targets/target-form-sheet";
import { TargetKpiStrip } from "@/components/sales-marketing/targets/target-kpi-strip";
import { TargetTable } from "@/components/sales-marketing/targets/target-table";
import { TargetViewSheet } from "@/components/sales-marketing/targets/target-view-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  TARGET_METRIC_LABELS,
  TARGET_PERIOD_LABELS,
  TARGET_SCOPE_LABELS,
  TARGET_STATUS_LABELS,
  getTargetById,
  smwTargetsSeed,
  type TargetMetric,
  type TargetPeriod,
  type TargetScope,
  type TargetStatus,
  type SmwTarget,
} from "@/lib/mock-data/smw-targets";
import { useSmwTargetStore } from "@/lib/store/smw-target-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/sales-marketing/targets?${query}` : "/sales-marketing/targets";
}

function TargetListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeTargets = useSmwTargetStore((s) => s.targets);
  const targets = storeTargets.length > 0 ? storeTargets : smwTargetsSeed;

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const periodParam = searchParams.get("period") ?? "all";

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [metricFilter, setMetricFilter] = useState(searchParams.get("metric") ?? "all");
  const [scopeFilter, setScopeFilter] = useState(searchParams.get("scope") ?? "all");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "all");
  const [periodFilter, setPeriodFilter] = useState(periodParam);

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const resolve = (id: string | null) => {
    if (!id) return null;
    return targets.find((t) => t.id === id) ?? getTargetById(id) ?? null;
  };

  const editTarget = useMemo(() => resolve(editId), [editId, targets]);
  const viewTarget = useMemo(() => resolve(viewId), [viewId, targets]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return targets.filter((t) => {
      if (t.status === "archived" && statusFilter !== "archived") return false;
      if (metricFilter !== "all" && t.metric !== metricFilter) return false;
      if (scopeFilter !== "all" && t.scope !== scopeFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (periodFilter !== "all" && t.period !== periodFilter) return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.targetNumber.toLowerCase().includes(q) && !t.scopeName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [targets, debouncedSearch, metricFilter, scopeFilter, statusFilter, periodFilter]);

  const openCreate = () => pushParams((p) => { p.delete("edit"); p.delete("view"); p.set("create", "1"); });
  const handleEdit = (t: SmwTarget) => pushParams((p) => { p.delete("create"); p.delete("view"); p.set("edit", t.id); });
  const handleView = (t: SmwTarget) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", t.id); });
  const closeForm = () => pushParams((p) => { p.delete("create"); p.delete("edit"); });
  const closeView = () => pushParams((p) => p.delete("view"));
  const handleSaved = (t: SmwTarget) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", t.id); });

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setMetricFilter("all");
    setScopeFilter("all");
    setStatusFilter("all");
    setPeriodFilter("all");
    pushParams((p) => { ["q", "metric", "scope", "status", "period"].forEach((k) => p.delete(k)); });
  };

  const activeFilters = [debouncedSearch, metricFilter !== "all", scopeFilter !== "all", statusFilter !== "all", periodFilter !== "all"].filter(Boolean).length;

  useEffect(() => {
    if (editId && !editTarget) { toast.error("Target not found"); closeForm(); }
  }, [editId, editTarget]);

  useEffect(() => {
    if (viewId && !viewTarget && !createOpen && !editId) { toast.error("Target not found"); closeView(); }
  }, [viewId, viewTarget, createOpen, editId]);

  return (
    <>
      <TargetKpiStrip targets={filtered} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input placeholder="Search targets…" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="h-8 max-w-[220px] text-xs" aria-label="Search targets" />
        <Select value={metricFilter} onChange={(e) => setMetricFilter(e.target.value)} className="h-8 w-[130px] text-xs" aria-label="Metric">
          <option value="all">All metrics</option>
          {(Object.keys(TARGET_METRIC_LABELS) as TargetMetric[]).map((m) => (
            <option key={m} value={m}>{TARGET_METRIC_LABELS[m]}</option>
          ))}
        </Select>
        <Select value={scopeFilter} onChange={(e) => setScopeFilter(e.target.value)} className="h-8 w-[120px] text-xs" aria-label="Scope">
          <option value="all">All scopes</option>
          {(Object.keys(TARGET_SCOPE_LABELS) as TargetScope[]).map((s) => (
            <option key={s} value={s}>{TARGET_SCOPE_LABELS[s]}</option>
          ))}
        </Select>
        <Select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} className="h-8 w-[120px] text-xs" aria-label="Period">
          <option value="all">All periods</option>
          {(Object.keys(TARGET_PERIOD_LABELS) as TargetPeriod[]).map((p) => (
            <option key={p} value={p}>{TARGET_PERIOD_LABELS[p]}</option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 w-[130px] text-xs" aria-label="Status">
          <option value="all">All statuses</option>
          {(Object.keys(TARGET_STATUS_LABELS) as TargetStatus[]).map((s) => (
            <option key={s} value={s}>{TARGET_STATUS_LABELS[s]}</option>
          ))}
        </Select>
        {activeFilters > 0 && (
          <Button type="button" variant="ghost" size="sm" className="h-8" onClick={resetFilters}>
            <X className="mr-1 h-3.5 w-3.5" aria-hidden /> Clear
          </Button>
        )}
        <div className="ml-auto">
          <Button type="button" size="sm" className="h-8" onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden /> New target
          </Button>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {filtered.length} target{filtered.length === 1 ? "" : "s"}
        {activeFilters > 0 ? " · filtered" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm font-medium">No targets found</p>
          <Button type="button" size="sm" className="mt-4" onClick={openCreate}>Create target</Button>
        </div>
      ) : (
        <div className="mt-3">
          <TargetTable data={filtered} onView={handleView} onEdit={handleEdit} />
        </div>
      )}

      <TargetViewSheet open={!!viewTarget && !createOpen && !editTarget} onOpenChange={(o) => { if (!o) closeView(); }} target={viewTarget} onEdit={handleEdit} />
      <TargetFormSheet open={createOpen || !!editTarget} onOpenChange={(o) => { if (!o) closeForm(); }} mode={createOpen ? "create" : "edit"} target={editTarget} onSaved={handleSaved} />
    </>
  );
}

export function TargetListWorkspace() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading targets…</p>}>
      <TargetListContent />
    </Suspense>
  );
}

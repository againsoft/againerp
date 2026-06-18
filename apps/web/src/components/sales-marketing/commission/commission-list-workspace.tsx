"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { CommissionFormSheet } from "@/components/sales-marketing/commission/commission-form-sheet";
import { CommissionKpiStrip } from "@/components/sales-marketing/commission/commission-kpi-strip";
import { CommissionTable } from "@/components/sales-marketing/commission/commission-table";
import { CommissionViewSheet } from "@/components/sales-marketing/commission/commission-view-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  COMMISSION_STATUS_LABELS,
  COMMISSION_TYPE_LABELS,
  SMW_COMMISSION_REPS,
  getCommissionById,
  smwCommissionsSeed,
  type CommissionStatus,
  type CommissionType,
  type SmwCommission,
} from "@/lib/mock-data/smw-commissions";
import { useSmwCommissionStore } from "@/lib/store/smw-commission-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/sales-marketing/commission?${query}` : "/sales-marketing/commission";
}

function CommissionListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeCommissions = useSmwCommissionStore((s) => s.commissions);
  const updateStatus = useSmwCommissionStore((s) => s.updateStatus);
  const commissions = storeCommissions.length > 0 ? storeCommissions : smwCommissionsSeed;

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const repParam = searchParams.get("rep");

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") ?? "all");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "all");
  const [repFilter, setRepFilter] = useState(repParam ?? "all");

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
    return commissions.find((c) => c.id === id) ?? getCommissionById(id) ?? null;
  };

  const editCommission = useMemo(() => resolve(editId), [editId, commissions]);
  const viewCommission = useMemo(() => resolve(viewId), [viewId, commissions]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return commissions.filter((c) => {
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (repFilter !== "all" && c.repId !== repFilter) return false;
      if (q && !c.dealName.toLowerCase().includes(q) && !c.commissionNumber.toLowerCase().includes(q) && !c.repName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [commissions, debouncedSearch, typeFilter, statusFilter, repFilter]);

  const openCreate = () => pushParams((p) => { p.delete("edit"); p.delete("view"); p.set("create", "1"); });
  const handleEdit = (c: SmwCommission) => pushParams((p) => { p.delete("create"); p.delete("view"); p.set("edit", c.id); });
  const handleView = (c: SmwCommission) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", c.id); });
  const closeForm = () => pushParams((p) => { p.delete("create"); p.delete("edit"); });
  const closeView = () => pushParams((p) => p.delete("view"));
  const handleSaved = (c: SmwCommission) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", c.id); });

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
    setRepFilter("all");
    pushParams((p) => { ["q", "type", "status", "rep"].forEach((k) => p.delete(k)); });
  };

  const activeFilters = [debouncedSearch, typeFilter !== "all", statusFilter !== "all", repFilter !== "all"].filter(Boolean).length;

  const handleStatusChange = (id: string, status: CommissionStatus) => {
    updateStatus(id, status);
    toast.success(status === "approved" ? "Commission approved" : status === "paid" ? "Marked as paid" : "Status updated");
  };

  useEffect(() => {
    if (editId && !editCommission) { toast.error("Commission entry not found"); closeForm(); }
  }, [editId, editCommission]);

  useEffect(() => {
    if (viewId && !viewCommission && !createOpen && !editId) { toast.error("Commission entry not found"); closeView(); }
  }, [viewId, viewCommission, createOpen, editId]);

  return (
    <>
      <CommissionKpiStrip commissions={filtered} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input placeholder="Search commissions…" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="h-8 max-w-[220px] text-xs" aria-label="Search commissions" />
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-8 w-[130px] text-xs" aria-label="Type">
          <option value="all">All types</option>
          {(Object.keys(COMMISSION_TYPE_LABELS) as CommissionType[]).map((t) => (
            <option key={t} value={t}>{COMMISSION_TYPE_LABELS[t]}</option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 w-[130px] text-xs" aria-label="Status">
          <option value="all">All statuses</option>
          {(Object.keys(COMMISSION_STATUS_LABELS) as CommissionStatus[]).map((s) => (
            <option key={s} value={s}>{COMMISSION_STATUS_LABELS[s]}</option>
          ))}
        </Select>
        <Select value={repFilter} onChange={(e) => setRepFilter(e.target.value)} className="h-8 w-[140px] text-xs" aria-label="Rep">
          <option value="all">All reps</option>
          {SMW_COMMISSION_REPS.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </Select>
        {activeFilters > 0 && (
          <Button type="button" variant="ghost" size="sm" className="h-8" onClick={resetFilters}>
            <X className="mr-1 h-3.5 w-3.5" aria-hidden /> Clear
          </Button>
        )}
        <div className="ml-auto">
          <Button type="button" size="sm" className="h-8" onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden /> New entry
          </Button>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
        {activeFilters > 0 ? " · filtered" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm font-medium">No commission entries found</p>
          <Button type="button" size="sm" className="mt-4" onClick={openCreate}>Create entry</Button>
        </div>
      ) : (
        <div className="mt-3">
          <CommissionTable
            data={filtered}
            onView={handleView}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}

      <CommissionViewSheet
        open={!!viewCommission && !createOpen && !editCommission}
        onOpenChange={(o) => { if (!o) closeView(); }}
        commission={viewCommission}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
      />
      <CommissionFormSheet
        open={createOpen || !!editCommission}
        onOpenChange={(o) => { if (!o) closeForm(); }}
        mode={createOpen ? "create" : "edit"}
        commission={editCommission}
        onSaved={handleSaved}
      />
    </>
  );
}

export function CommissionListWorkspace() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading commission…</p>}>
      <CommissionListContent />
    </Suspense>
  );
}

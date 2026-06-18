"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutList, Plus, Table2, X } from "lucide-react";
import { toast } from "sonner";
import { ActivityFormSheet } from "@/components/sales-marketing/activities/activity-form-sheet";
import { ActivityKpiStrip } from "@/components/sales-marketing/activities/activity-kpi-strip";
import { ActivityTable } from "@/components/sales-marketing/activities/activity-table";
import { ActivityTimeline } from "@/components/sales-marketing/activities/activity-timeline";
import { ActivityViewSheet } from "@/components/sales-marketing/activities/activity-view-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  SMW_ACTIVITY_OWNERS,
  getActivityById,
  smwActivitiesSeed,
  type ActivityStatus,
  type ActivityType,
  type SmwActivity,
} from "@/lib/mock-data/smw-activities";
import { useSmwActivityStore } from "@/lib/store/smw-activity-store";
import { cn } from "@/lib/utils";

type LayoutMode = "timeline" | "table";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/sales-marketing/activities?${query}` : "/sales-marketing/activities";
}

function ActivityWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeActivities = useSmwActivityStore((s) => s.activities);
  const completeActivity = useSmwActivityStore((s) => s.completeActivity);
  const activities = storeActivities.length > 0 ? storeActivities : smwActivitiesSeed;

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const layout = (searchParams.get("layout") as LayoutMode) || "timeline";

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") ?? "all");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "all");
  const [ownerFilter, setOwnerFilter] = useState(searchParams.get("owner") ?? "all");

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
    return activities.find((a) => a.id === id) ?? getActivityById(id) ?? null;
  };

  const editActivity = useMemo(() => resolve(editId), [editId, activities]);
  const viewActivity = useMemo(() => resolve(viewId), [viewId, activities]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return activities.filter((a) => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (statusFilter === "open") {
        if (!["open", "scheduled", "in_progress"].includes(a.status)) return false;
      } else if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (ownerFilter !== "all" && a.ownerId !== ownerFilter) return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.activityNumber.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [activities, debouncedSearch, typeFilter, statusFilter, ownerFilter]);

  const openCreate = () => pushParams((p) => { p.delete("edit"); p.delete("view"); p.set("create", "1"); });
  const handleEdit = (a: SmwActivity) => pushParams((p) => { p.delete("create"); p.delete("view"); p.set("edit", a.id); });
  const handleView = (a: SmwActivity) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", a.id); });
  const closeForm = () => pushParams((p) => { p.delete("create"); p.delete("edit"); });
  const closeView = () => pushParams((p) => p.delete("view"));
  const handleSaved = (a: SmwActivity) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", a.id); });

  const setLayout = (mode: LayoutMode) => pushParams((p) => p.set("layout", mode));

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
    setOwnerFilter("all");
    pushParams((p) => { ["q", "type", "status", "owner"].forEach((k) => p.delete(k)); });
  };

  const activeFilters = [debouncedSearch, typeFilter !== "all", statusFilter !== "all", ownerFilter !== "all"].filter(Boolean).length;

  const handleComplete = (id: string) => {
    completeActivity(id);
    toast.success("Activity marked complete");
  };

  useEffect(() => {
    if (editId && !editActivity) { toast.error("Activity not found"); closeForm(); }
  }, [editId, editActivity]);

  useEffect(() => {
    if (viewId && !viewActivity && !createOpen && !editId) { toast.error("Activity not found"); closeView(); }
  }, [viewId, viewActivity, createOpen, editId]);

  return (
    <>
      <ActivityKpiStrip activities={filtered} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input placeholder="Search activities…" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="h-8 max-w-[220px] text-xs" aria-label="Search activities" />
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-8 w-[120px] text-xs" aria-label="Type">
          <option value="all">All types</option>
          {(Object.keys(ACTIVITY_TYPE_LABELS) as ActivityType[]).map((t) => (
            <option key={t} value={t}>{ACTIVITY_TYPE_LABELS[t]}</option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 w-[130px] text-xs" aria-label="Status">
          <option value="all">All statuses</option>
          <option value="open">Open (all)</option>
          {(Object.keys(ACTIVITY_STATUS_LABELS) as ActivityStatus[]).map((s) => (
            <option key={s} value={s}>{ACTIVITY_STATUS_LABELS[s]}</option>
          ))}
        </Select>
        <Select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="h-8 w-[140px] text-xs" aria-label="Owner">
          <option value="all">All owners</option>
          {SMW_ACTIVITY_OWNERS.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </Select>
        {activeFilters > 0 && (
          <Button type="button" variant="ghost" size="sm" className="h-8" onClick={resetFilters}>
            <X className="mr-1 h-3.5 w-3.5" aria-hidden /> Clear
          </Button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-md border border-input p-0.5">
            <Button type="button" variant="ghost" size="sm" className={cn("h-7 px-2", layout === "timeline" && "bg-muted")} onClick={() => setLayout("timeline")} aria-label="Timeline view">
              <LayoutList className="h-3.5 w-3.5" aria-hidden />
            </Button>
            <Button type="button" variant="ghost" size="sm" className={cn("h-7 px-2", layout === "table" && "bg-muted")} onClick={() => setLayout("table")} aria-label="Table view">
              <Table2 className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </div>
          <Button type="button" size="sm" className="h-8" onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Log activity
          </Button>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {filtered.length} activit{filtered.length === 1 ? "y" : "ies"}
        {activeFilters > 0 ? " · filtered" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm font-medium">No activities found</p>
          <Button type="button" size="sm" className="mt-4" onClick={openCreate}>Log activity</Button>
        </div>
      ) : layout === "table" ? (
        <div className="mt-3">
          <ActivityTable data={filtered} onView={handleView} onEdit={handleEdit} onComplete={handleComplete} />
        </div>
      ) : (
        <div className="mt-3">
          <ActivityTimeline activities={filtered} onView={handleView} />
        </div>
      )}

      <ActivityViewSheet
        open={!!viewActivity && !createOpen && !editActivity}
        onOpenChange={(o) => { if (!o) closeView(); }}
        activity={viewActivity}
        onEdit={handleEdit}
        onComplete={handleComplete}
      />
      <ActivityFormSheet
        open={createOpen || !!editActivity}
        onOpenChange={(o) => { if (!o) closeForm(); }}
        mode={createOpen ? "create" : "edit"}
        activity={editActivity}
        onSaved={handleSaved}
      />
    </>
  );
}

export function ActivityWorkspace() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading activities…</p>}>
      <ActivityWorkspaceContent />
    </Suspense>
  );
}

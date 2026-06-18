"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { CampaignFormSheet } from "@/components/sales-marketing/campaigns/campaign-form-sheet";
import { CampaignKpiStrip } from "@/components/sales-marketing/campaigns/campaign-kpi-strip";
import { CampaignTable } from "@/components/sales-marketing/campaigns/campaign-table";
import { CampaignViewSheet } from "@/components/sales-marketing/campaigns/campaign-view-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  CAMPAIGN_CHANNEL_LABELS,
  CAMPAIGN_STATUS_LABELS,
  SMW_CAMPAIGN_OWNERS,
  getCampaignById,
  smwCampaignsSeed,
  type CampaignChannel,
  type CampaignStatus,
  type SmwCampaign,
} from "@/lib/mock-data/smw-campaigns";
import { useSmwCampaignStore } from "@/lib/store/smw-campaign-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/sales-marketing/campaigns?${query}` : "/sales-marketing/campaigns";
}

function CampaignListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeCampaigns = useSmwCampaignStore((s) => s.campaigns);
  const updateStatus = useSmwCampaignStore((s) => s.updateStatus);
  const campaigns = storeCampaigns.length > 0 ? storeCampaigns : smwCampaignsSeed;

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const channelParam = searchParams.get("channel") ?? "all";

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "all");
  const [channelFilter, setChannelFilter] = useState(channelParam);
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

  useEffect(() => {
    pushParams((params) => {
      if (debouncedSearch) params.set("q", debouncedSearch);
      else params.delete("q");
    });
  }, [debouncedSearch]);

  const resolve = (id: string | null) => {
    if (!id) return null;
    return campaigns.find((c) => c.id === id) ?? getCampaignById(id) ?? null;
  };

  const editCampaign = useMemo(() => resolve(editId), [editId, campaigns]);
  const viewCampaign = useMemo(() => resolve(viewId), [viewId, campaigns]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return campaigns.filter((c) => {
      if (c.status === "archived" && statusFilter !== "archived") return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (channelFilter !== "all" && c.channel !== channelFilter) return false;
      if (ownerFilter !== "all" && c.ownerId !== ownerFilter) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.campaignNumber.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [campaigns, debouncedSearch, statusFilter, channelFilter, ownerFilter]);

  const openCreate = () => pushParams((p) => { p.delete("edit"); p.delete("view"); p.set("create", "1"); });
  const handleEdit = (c: SmwCampaign) => pushParams((p) => { p.delete("create"); p.delete("view"); p.set("edit", c.id); });
  const handleView = (c: SmwCampaign) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", c.id); });
  const closeForm = () => pushParams((p) => { p.delete("create"); p.delete("edit"); });
  const closeView = () => pushParams((p) => p.delete("view"));
  const handleSaved = (c: SmwCampaign) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", c.id); });

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setChannelFilter("all");
    setOwnerFilter("all");
    pushParams((p) => { ["q", "status", "channel", "owner"].forEach((k) => p.delete(k)); });
  };

  const activeFilters = [debouncedSearch, statusFilter !== "all", channelFilter !== "all", ownerFilter !== "all"].filter(Boolean).length;

  useEffect(() => {
    if (editId && !editCampaign) { toast.error("Campaign not found"); closeForm(); }
  }, [editId, editCampaign]);

  useEffect(() => {
    if (viewId && !viewCampaign && !createOpen && !editId) { toast.error("Campaign not found"); closeView(); }
  }, [viewId, viewCampaign, createOpen, editId]);

  return (
    <>
      <CampaignKpiStrip campaigns={filtered} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input placeholder="Search campaigns…" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="h-8 max-w-[220px] text-xs" aria-label="Search campaigns" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 w-[130px] text-xs" aria-label="Status">
          <option value="all">All statuses</option>
          {(Object.keys(CAMPAIGN_STATUS_LABELS) as CampaignStatus[]).map((s) => (
            <option key={s} value={s}>{CAMPAIGN_STATUS_LABELS[s]}</option>
          ))}
        </Select>
        <Select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className="h-8 w-[130px] text-xs" aria-label="Channel">
          <option value="all">All channels</option>
          {(Object.keys(CAMPAIGN_CHANNEL_LABELS) as CampaignChannel[]).map((ch) => (
            <option key={ch} value={ch}>{CAMPAIGN_CHANNEL_LABELS[ch]}</option>
          ))}
        </Select>
        <Select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="h-8 w-[140px] text-xs" aria-label="Owner">
          <option value="all">All owners</option>
          {SMW_CAMPAIGN_OWNERS.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </Select>
        {activeFilters > 0 && (
          <Button type="button" variant="ghost" size="sm" className="h-8" onClick={resetFilters}>
            <X className="mr-1 h-3.5 w-3.5" aria-hidden /> Clear
          </Button>
        )}
        <div className="ml-auto">
          <Button type="button" size="sm" className="h-8" onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden /> New campaign
          </Button>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {filtered.length} campaign{filtered.length === 1 ? "" : "s"}
        {activeFilters > 0 ? " · filtered" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm font-medium">No campaigns found</p>
          <Button type="button" size="sm" className="mt-4" onClick={openCreate}>Create campaign</Button>
        </div>
      ) : (
        <div className="mt-3">
          <CampaignTable
            data={filtered}
            onView={handleView}
            onEdit={handleEdit}
            onStatusChange={(id, status) => {
              updateStatus(id, status);
              toast.success(`Campaign ${status === "paused" ? "paused" : "resumed"}`);
            }}
          />
        </div>
      )}

      <CampaignViewSheet open={!!viewCampaign && !createOpen && !editCampaign} onOpenChange={(o) => { if (!o) closeView(); }} campaign={viewCampaign} onEdit={handleEdit} />
      <CampaignFormSheet open={createOpen || !!editCampaign} onOpenChange={(o) => { if (!o) closeForm(); }} mode={createOpen ? "create" : "edit"} campaign={editCampaign} onSaved={handleSaved} />
    </>
  );
}

export function CampaignListWorkspace() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading campaigns…</p>}>
      <CampaignListContent />
    </Suspense>
  );
}

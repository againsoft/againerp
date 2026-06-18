"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  CAMPAIGN_CHANNEL_LABELS,
  CAMPAIGN_STATUS_LABELS,
  SMW_CAMPAIGN_OWNERS,
  emptyCampaign,
  type CampaignChannel,
  type CampaignStatus,
  type SmwCampaign,
} from "@/lib/mock-data/smw-campaigns";
import { useSmwCampaignStore } from "@/lib/store/smw-campaign-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  campaign: SmwCampaign | null;
  onSaved: (campaign: SmwCampaign) => void;
};

export function CampaignFormSheet({ open, onOpenChange, mode, campaign, onSaved }: Props) {
  const upsertCampaign = useSmwCampaignStore((s) => s.upsertCampaign);
  const [form, setForm] = useState<SmwCampaign>(campaign ?? emptyCampaign());

  useEffect(() => {
    setForm(campaign ?? emptyCampaign());
  }, [campaign, open, mode]);

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    const owner = SMW_CAMPAIGN_OWNERS.find((o) => o.id === form.ownerId) ?? SMW_CAMPAIGN_OWNERS[0]!;
    const saved: SmwCampaign = { ...form, name: form.name.trim(), ownerName: owner.name };
    upsertCampaign(saved);
    onSaved(saved);
    toast.success(mode === "create" ? "Campaign created" : "Campaign updated");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-lg gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <h2 className="text-lg font-semibold">{mode === "create" ? "New campaign" : `Edit · ${campaign?.name}`}</h2>
            <p className="text-xs text-muted-foreground">SCR-SMW-CMP-001</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Campaign name" className="sm:col-span-2">
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Channel">
              <Select value={form.channel} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value as CampaignChannel }))}>
                {(Object.keys(CAMPAIGN_CHANNEL_LABELS) as CampaignChannel[]).map((ch) => (
                  <option key={ch} value={ch}>{CAMPAIGN_CHANNEL_LABELS[ch]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CampaignStatus }))}>
                {(Object.keys(CAMPAIGN_STATUS_LABELS) as CampaignStatus[]).map((s) => (
                  <option key={s} value={s}>{CAMPAIGN_STATUS_LABELS[s]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Budget (BDT)">
              <Input type="number" min={0} value={form.budget || ""} onChange={(e) => setForm((f) => ({ ...f, budget: Number(e.target.value) || 0 }))} className="h-9" />
            </Field>
            <Field label="Owner">
              <Select value={form.ownerId} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, ownerId: e.target.value }))}>
                {SMW_CAMPAIGN_OWNERS.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Start date">
              <Input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="h-9" />
            </Field>
            <Field label="End date">
              <Input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Input value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="h-9" />
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="button" className="flex-1" onClick={save}>{mode === "create" ? "Create" : "Save"}</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-medium">{label}</span>
      {children}
    </label>
  );
}

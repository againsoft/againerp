"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  emptyOpportunity,
  OPPORTUNITY_STAGES,
  SMW_OPP_OWNERS,
  SMW_OPP_TERRITORIES,
  type SmwOpportunity,
} from "@/lib/mock-data/smw-opportunities";
import { useSmwOpportunityStore } from "@/lib/store/smw-opportunity-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  opportunity: SmwOpportunity | null;
  onSaved: (opp: SmwOpportunity) => void;
};

export function OpportunityFormSheet({ open, onOpenChange, mode, opportunity, onSaved }: Props) {
  const upsertOpportunity = useSmwOpportunityStore((s) => s.upsertOpportunity);
  const [form, setForm] = useState<SmwOpportunity>(opportunity ?? emptyOpportunity());

  useEffect(() => {
    setForm(opportunity ?? emptyOpportunity());
  }, [opportunity, open, mode]);

  const save = () => {
    if (!form.title.trim() || !form.accountName.trim()) {
      toast.error("Title and account are required");
      return;
    }
    const owner = SMW_OPP_OWNERS.find((o) => o.id === form.ownerId) ?? SMW_OPP_OWNERS[0]!;
    const territory =
      SMW_OPP_TERRITORIES.find((t) => t.id === form.territoryId) ?? SMW_OPP_TERRITORIES[1]!;
    const saved: SmwOpportunity = {
      ...form,
      title: form.title.trim(),
      accountName: form.accountName.trim(),
      ownerName: owner.name,
      territoryName: territory.name,
    };
    upsertOpportunity(saved);
    toast.success(mode === "create" ? "Deal created" : "Deal updated");
    onSaved(saved);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-lg gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <h2 className="text-lg font-semibold">{mode === "create" ? "New deal" : `Edit · ${opportunity?.title}`}</h2>
            <p className="text-xs text-muted-foreground">SCR-SMW-OPP-001</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Deal title" className="sm:col-span-2">
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Account" className="sm:col-span-2">
              <Input value={form.accountName} onChange={(e) => setForm((f) => ({ ...f, accountName: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Amount (BDT)">
              <Input type="number" min={0} value={form.amount || ""} onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) || 0 }))} className="h-9" />
            </Field>
            <Field label="Close date">
              <Input type="date" value={form.expectedCloseDate} onChange={(e) => setForm((f) => ({ ...f, expectedCloseDate: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Stage">
              <Select value={form.stage} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as SmwOpportunity["stage"] }))}>
                {OPPORTUNITY_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Owner">
              <Select value={form.ownerId} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, ownerId: e.target.value }))}>
                {SMW_OPP_OWNERS.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Territory" className="sm:col-span-2">
              <Select value={form.territoryId} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, territoryId: e.target.value }))}>
                {SMW_OPP_TERRITORIES.filter((t) => t.id !== "all").map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="button" className="flex-1" onClick={save}>{mode === "create" ? "Create deal" : "Save"}</Button>
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

"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  TEAM_STATUS_LABELS,
  emptyTeam,
  type SmwTeam,
  type TeamStatus,
} from "@/lib/mock-data/smw-teams";
import { SMW_LEAD_OWNERS, SMW_LEAD_TERRITORIES } from "@/lib/mock-data/smw-leads";
import { useSmwTeamStore } from "@/lib/store/smw-team-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  team: SmwTeam | null;
  onSaved: (team: SmwTeam) => void;
};

export function TeamFormSheet({ open, onOpenChange, mode, team, onSaved }: Props) {
  const upsertTeam = useSmwTeamStore((s) => s.upsertTeam);
  const [form, setForm] = useState<SmwTeam>(team ?? emptyTeam());

  useEffect(() => {
    setForm(team ?? emptyTeam());
  }, [team, open, mode]);

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Team name is required");
      return;
    }
    const manager = SMW_LEAD_OWNERS.find((o) => o.id === form.managerId) ?? SMW_LEAD_OWNERS[0]!;
    const saved: SmwTeam = { ...form, name: form.name.trim(), managerName: manager.name };
    upsertTeam(saved);
    onSaved(saved);
    toast.success(mode === "create" ? "Team created" : "Team updated");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-lg gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <h2 className="text-lg font-semibold">{mode === "create" ? "New team" : `Edit · ${team?.name}`}</h2>
            <p className="text-xs text-muted-foreground">SCR-SMW-TEM-001</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Team name" className="sm:col-span-2">
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Manager">
              <Select value={form.managerId} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, managerId: e.target.value }))}>
                {SMW_LEAD_OWNERS.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TeamStatus }))}>
                {(Object.keys(TEAM_STATUS_LABELS) as TeamStatus[]).map((s) => (
                  <option key={s} value={s}>{TEAM_STATUS_LABELS[s]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Primary territory">
              <Select
                value={form.territoryIds[0] ?? ""}
                className="h-9 w-full"
                onChange={(e) => {
                  const t = SMW_LEAD_TERRITORIES.find((x) => x.id === e.target.value);
                  if (t) setForm((f) => ({ ...f, territoryIds: [t.id], territoryNames: [t.name] }));
                }}
              >
                {SMW_LEAD_TERRITORIES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Quota target (BDT)">
              <Input type="number" min={0} value={form.quotaTarget || ""} onChange={(e) => setForm((f) => ({ ...f, quotaTarget: Number(e.target.value) || 0 }))} className="h-9" />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Input value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value || undefined }))} className="h-9" />
            </Field>
            <Field label="Notes" className="sm:col-span-2">
              <Input value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value || undefined }))} className="h-9" />
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

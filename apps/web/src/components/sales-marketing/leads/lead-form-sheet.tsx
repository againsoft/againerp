"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  emptyLead,
  LEAD_SOURCE_LABELS,
  SMW_LEAD_OWNERS,
  SMW_LEAD_TERRITORIES,
  type LeadSource,
  type SmwLead,
} from "@/lib/mock-data/smw-leads";
import { useSmwLeadStore } from "@/lib/store/smw-lead-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  lead: SmwLead | null;
  onSaved: (lead: SmwLead) => void;
};

export function LeadFormSheet({ open, onOpenChange, mode, lead, onSaved }: Props) {
  const upsertLead = useSmwLeadStore((s) => s.upsertLead);
  const [form, setForm] = useState<SmwLead>(lead ?? emptyLead());

  useEffect(() => {
    setForm(lead ?? emptyLead());
  }, [lead, open, mode]);

  const save = () => {
    if (!form.name.trim() || !form.company.trim()) {
      toast.error("Name and company are required");
      return;
    }
    const owner = SMW_LEAD_OWNERS.find((o) => o.id === form.ownerId) ?? SMW_LEAD_OWNERS[0]!;
    const territory =
      SMW_LEAD_TERRITORIES.find((t) => t.id === form.territoryId) ?? SMW_LEAD_TERRITORIES[0]!;
    const saved: SmwLead = {
      ...form,
      name: form.name.trim(),
      company: form.company.trim(),
      ownerName: owner.name,
      territoryName: territory.name,
      email: form.email || `${form.name.toLowerCase().replace(/\s+/g, ".")}@${form.company.toLowerCase().replace(/\s+/g, "")}.com`,
    };
    upsertLead(saved);
    toast.success(mode === "create" ? "Lead created" : "Lead updated");
    onSaved(saved);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-lg gap-0 overflow-y-auto p-0 sm:max-w-lg"
        aria-describedby={undefined}
      >
        <div className="flex flex-col gap-4 p-4">
          <div>
            <h2 className="text-lg font-semibold">
              {mode === "create" ? "New lead" : `Edit · ${lead?.name}`}
            </h2>
            <p className="text-xs text-muted-foreground">SCR-SMW-LDS-001</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name" className="sm:col-span-2">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="h-9"
              />
            </Field>
            <Field label="Company" className="sm:col-span-2">
              <Input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="h-9"
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="h-9"
              />
            </Field>
            <Field label="Phone">
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="h-9"
              />
            </Field>
            <Field label="Source">
              <Select
                value={form.source}
                className="h-9 w-full"
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value as LeadSource }))}
              >
                {Object.entries(LEAD_SOURCE_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Owner">
              <Select
                value={form.ownerId}
                className="h-9 w-full"
                onChange={(e) => setForm((f) => ({ ...f, ownerId: e.target.value }))}
              >
                {SMW_LEAD_OWNERS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Territory">
              <Select
                value={form.territoryId}
                className="h-9 w-full"
                onChange={(e) => setForm((f) => ({ ...f, territoryId: e.target.value }))}
              >
                {SMW_LEAD_TERRITORIES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Expected value (BDT)">
              <Input
                type="number"
                min={0}
                value={form.expectedValue || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expectedValue: Number(e.target.value) || 0 }))
                }
                className="h-9"
              />
            </Field>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" className="flex-1" onClick={save}>
              {mode === "create" ? "Create lead" : "Save changes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-medium">{label}</span>
      {children}
    </label>
  );
}

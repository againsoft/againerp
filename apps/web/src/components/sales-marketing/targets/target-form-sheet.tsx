"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  TARGET_METRIC_LABELS,
  TARGET_PERIOD_LABELS,
  TARGET_SCOPE_LABELS,
  TARGET_STATUS_LABELS,
  SMW_TARGET_OWNERS,
  emptyTarget,
  scopeOptions,
  type SmwTarget,
  type TargetMetric,
  type TargetPeriod,
  type TargetScope,
  type TargetStatus,
} from "@/lib/mock-data/smw-targets";
import { useSmwTargetStore } from "@/lib/store/smw-target-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  target: SmwTarget | null;
  onSaved: (target: SmwTarget) => void;
};

export function TargetFormSheet({ open, onOpenChange, mode, target, onSaved }: Props) {
  const upsertTarget = useSmwTargetStore((s) => s.upsertTarget);
  const [form, setForm] = useState<SmwTarget>(target ?? emptyTarget());

  useEffect(() => {
    setForm(target ?? emptyTarget());
  }, [target, open, mode]);

  const scopeList = scopeOptions(form.scope);
  const selectedScope = scopeList.find((s) => s.id === form.scopeId) ?? scopeList[0];

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Target name is required");
      return;
    }
    if (form.targetValue <= 0) {
      toast.error("Target value must be greater than zero");
      return;
    }
    const owner = SMW_TARGET_OWNERS.find((o) => o.id === form.ownerId) ?? SMW_TARGET_OWNERS[0]!;
    const saved: SmwTarget = {
      ...form,
      name: form.name.trim(),
      ownerName: owner.name,
      scopeName: selectedScope?.name ?? form.scopeName,
    };
    upsertTarget(saved);
    onSaved(saved);
    toast.success(mode === "create" ? "Target created" : "Target updated");
  };

  const handleScopeChange = (scope: TargetScope) => {
    const options = scopeOptions(scope);
    const first = options[0];
    setForm((f) => ({
      ...f,
      scope,
      scopeId: first?.id ?? "",
      scopeName: first?.name ?? "",
    }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-lg gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <h2 className="text-lg font-semibold">{mode === "create" ? "New target" : `Edit · ${target?.name}`}</h2>
            <p className="text-xs text-muted-foreground">SCR-SMW-TGT-001</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Target name" className="sm:col-span-2">
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Metric">
              <Select value={form.metric} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, metric: e.target.value as TargetMetric }))}>
                {(Object.keys(TARGET_METRIC_LABELS) as TargetMetric[]).map((m) => (
                  <option key={m} value={m}>{TARGET_METRIC_LABELS[m]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TargetStatus }))}>
                {(Object.keys(TARGET_STATUS_LABELS) as TargetStatus[]).map((s) => (
                  <option key={s} value={s}>{TARGET_STATUS_LABELS[s]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Scope type">
              <Select value={form.scope} className="h-9 w-full" onChange={(e) => handleScopeChange(e.target.value as TargetScope)}>
                {(Object.keys(TARGET_SCOPE_LABELS) as TargetScope[]).map((sc) => (
                  <option key={sc} value={sc}>{TARGET_SCOPE_LABELS[sc]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Assign to">
              <Select
                value={form.scopeId}
                className="h-9 w-full"
                onChange={(e) => {
                  const opt = scopeList.find((s) => s.id === e.target.value);
                  setForm((f) => ({ ...f, scopeId: e.target.value, scopeName: opt?.name ?? f.scopeName }));
                }}
              >
                {scopeList.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Period type">
              <Select value={form.period} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, period: e.target.value as TargetPeriod }))}>
                {(Object.keys(TARGET_PERIOD_LABELS) as TargetPeriod[]).map((p) => (
                  <option key={p} value={p}>{TARGET_PERIOD_LABELS[p]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Period label">
              <Input value={form.periodLabel} onChange={(e) => setForm((f) => ({ ...f, periodLabel: e.target.value }))} className="h-9" placeholder="Q2 2026" />
            </Field>
            <Field label="Target value">
              <Input type="number" min={0} value={form.targetValue || ""} onChange={(e) => setForm((f) => ({ ...f, targetValue: Number(e.target.value) || 0 }))} className="h-9" />
            </Field>
            <Field label="Achieved (manual)">
              <Input type="number" min={0} value={form.achievedValue || ""} onChange={(e) => setForm((f) => ({ ...f, achievedValue: Number(e.target.value) || 0 }))} className="h-9" />
            </Field>
            <Field label="Start date">
              <Input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="h-9" />
            </Field>
            <Field label="End date">
              <Input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Owner">
              <Select value={form.ownerId} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, ownerId: e.target.value }))}>
                {SMW_TARGET_OWNERS.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </Select>
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

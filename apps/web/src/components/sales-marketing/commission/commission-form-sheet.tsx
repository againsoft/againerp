"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  COMMISSION_STATUS_LABELS,
  COMMISSION_TYPE_LABELS,
  SMW_COMMISSION_PLANS,
  SMW_COMMISSION_REPS,
  calcCommissionAmount,
  emptyCommission,
  type CommissionStatus,
  type CommissionType,
  type SmwCommission,
} from "@/lib/mock-data/smw-commissions";
import { useSmwCommissionStore } from "@/lib/store/smw-commission-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  commission: SmwCommission | null;
  onSaved: (commission: SmwCommission) => void;
};

export function CommissionFormSheet({ open, onOpenChange, mode, commission, onSaved }: Props) {
  const upsertCommission = useSmwCommissionStore((s) => s.upsertCommission);
  const [form, setForm] = useState<SmwCommission>(commission ?? emptyCommission());

  useEffect(() => {
    setForm(commission ?? emptyCommission());
  }, [commission, open, mode]);

  const recalcAmount = (dealValue: number, rate: number) => calcCommissionAmount(dealValue, rate);

  const save = () => {
    if (!form.dealName.trim()) {
      toast.error("Deal / entry name is required");
      return;
    }
    const rep = SMW_COMMISSION_REPS.find((r) => r.id === form.repId) ?? SMW_COMMISSION_REPS[0]!;
    const amount =
      form.type === "standard"
        ? recalcAmount(form.dealValue, form.commissionRate)
        : form.commissionAmount;
    const saved: SmwCommission = {
      ...form,
      dealName: form.dealName.trim(),
      repName: rep.name,
      commissionAmount: amount,
    };
    upsertCommission(saved);
    onSaved(saved);
    toast.success(mode === "create" ? "Commission entry created" : "Commission updated");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-lg gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <h2 className="text-lg font-semibold">{mode === "create" ? "New commission entry" : `Edit · ${commission?.dealName}`}</h2>
            <p className="text-xs text-muted-foreground">SCR-SMW-COM-001</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Deal / entry name" className="sm:col-span-2">
              <Input value={form.dealName} onChange={(e) => setForm((f) => ({ ...f, dealName: e.target.value }))} className="h-9" />
            </Field>
            <Field label="Sales rep">
              <Select value={form.repId} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, repId: e.target.value }))}>
                {SMW_COMMISSION_REPS.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Type">
              <Select value={form.type} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CommissionType }))}>
                {(Object.keys(COMMISSION_TYPE_LABELS) as CommissionType[]).map((t) => (
                  <option key={t} value={t}>{COMMISSION_TYPE_LABELS[t]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Commission plan">
              <Select value={form.planName} className="h-9 w-full sm:col-span-2" onChange={(e) => {
                const plan = SMW_COMMISSION_PLANS.find((p) => p.name === e.target.value);
                const rateMatch = plan?.name.match(/(\d+)%/);
                const rate = rateMatch ? Number(rateMatch[1]) : form.commissionRate;
                setForm((f) => ({
                  ...f,
                  planName: e.target.value,
                  commissionRate: rate,
                  commissionAmount: f.type === "standard" ? recalcAmount(f.dealValue, rate) : f.commissionAmount,
                }));
              }}>
                {SMW_COMMISSION_PLANS.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} className="h-9 w-full" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CommissionStatus }))}>
                {(Object.keys(COMMISSION_STATUS_LABELS) as CommissionStatus[]).map((s) => (
                  <option key={s} value={s}>{COMMISSION_STATUS_LABELS[s]}</option>
                ))}
              </Select>
            </Field>
            <Field label="Deal value (BDT)">
              <Input
                type="number"
                value={form.dealValue || ""}
                onChange={(e) => {
                  const dealValue = Number(e.target.value) || 0;
                  setForm((f) => ({
                    ...f,
                    dealValue,
                    commissionAmount: f.type === "standard" ? recalcAmount(dealValue, f.commissionRate) : f.commissionAmount,
                  }));
                }}
                className="h-9"
              />
            </Field>
            <Field label="Rate (%)">
              <Input
                type="number"
                min={0}
                max={100}
                value={form.commissionRate || ""}
                onChange={(e) => {
                  const commissionRate = Number(e.target.value) || 0;
                  setForm((f) => ({
                    ...f,
                    commissionRate,
                    commissionAmount: f.type === "standard" ? recalcAmount(f.dealValue, commissionRate) : f.commissionAmount,
                  }));
                }}
                className="h-9"
              />
            </Field>
            <Field label="Commission amount (BDT)">
              <Input
                type="number"
                value={form.commissionAmount || ""}
                onChange={(e) => setForm((f) => ({ ...f, commissionAmount: Number(e.target.value) || 0 }))}
                className="h-9"
                disabled={form.type === "standard"}
              />
            </Field>
            <Field label="Period">
              <Input value={form.periodLabel} onChange={(e) => setForm((f) => ({ ...f, periodLabel: e.target.value }))} className="h-9" placeholder="Jun 2026" />
            </Field>
            <Field label="Closed date">
              <Input type="date" value={form.closedDate} onChange={(e) => setForm((f) => ({ ...f, closedDate: e.target.value }))} className="h-9" />
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

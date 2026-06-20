"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  apBillsSeed,
  arInvoicesSeed,
  bankAccountsSeed,
  formatBdt,
  type ApBill,
  type ArInvoice,
  type ChequeDirection,
  type ChequeInstrument,
} from "@/lib/mock-data/finance";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export type ChequeScheduleLine = {
  key: string;
  chequeNumber: string;
  amount: number;
  issueDate: string;
  maturityDate: string;
};

function emptyLine(issueDate = "2026-06-19"): ChequeScheduleLine {
  return {
    key: crypto.randomUUID(),
    chequeNumber: "",
    amount: 0,
    issueDate,
    maturityDate: issueDate,
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (cheques: ChequeInstrument[]) => void;
  initialDirection?: ChequeDirection;
  initialLinkedDocId?: string;
};

export function ChequeFormSheet({
  open,
  onClose,
  onSave,
  initialDirection = "received",
  initialLinkedDocId = "",
}: Props) {
  const [direction, setDirection] = useState<ChequeDirection>(initialDirection);
  const [linkedDocId, setLinkedDocId] = useState(initialLinkedDocId);
  const [bankAccountId, setBankAccountId] = useState(bankAccountsSeed[0].id);
  const [lines, setLines] = useState<ChequeScheduleLine[]>(() => [emptyLine()]);

  const openArDocs = useMemo(
    () => arInvoicesSeed.filter((i) => i.residual > 0),
    []
  );
  const openApDocs = useMemo(
    () => apBillsSeed.filter((b) => b.residual > 0),
    []
  );

  const linkOptions = direction === "received" ? openArDocs : openApDocs;

  const linkedDoc = useMemo(() => {
    if (!linkedDocId) return null;
    if (direction === "received") {
      return openArDocs.find((d) => d.id === linkedDocId) ?? null;
    }
    return openApDocs.find((d) => d.id === linkedDocId) ?? null;
  }, [linkedDocId, direction, openArDocs, openApDocs]);

  const party = linkedDoc
    ? direction === "received"
      ? (linkedDoc as ArInvoice).customer
      : (linkedDoc as ApBill).vendor
    : "";

  const linkedDocNumber = linkedDoc
    ? direction === "received"
      ? (linkedDoc as ArInvoice).number
      : (linkedDoc as ApBill).number
    : "";

  const openBalance = linkedDoc
    ? direction === "received"
      ? (linkedDoc as ArInvoice).residual
      : (linkedDoc as ApBill).residual
    : 0;

  const bank = bankAccountsSeed.find((b) => b.id === bankAccountId);

  const scheduleTotal = lines.reduce((s, l) => s + (l.amount || 0), 0);
  const scheduleValid = scheduleTotal > 0 && scheduleTotal <= openBalance;
  const allLinesFilled = lines.every(
    (l) => l.chequeNumber.trim() && l.amount > 0 && l.issueDate && l.maturityDate
  );

  const resetForm = () => {
    setDirection(initialDirection);
    setLinkedDocId(initialLinkedDocId);
    setBankAccountId(bankAccountsSeed[0].id);
    setLines([emptyLine()]);
  };

  useEffect(() => {
    if (!open) return;
    setDirection(initialDirection);
    setLinkedDocId(initialLinkedDocId);
    setBankAccountId(bankAccountsSeed[0].id);
    setLines([emptyLine()]);
  }, [open, initialDirection, initialLinkedDocId]);

  useEffect(() => {
    setLinkedDocId("");
    setLines([emptyLine()]);
  }, [direction]);

  const updateLine = (key: string, patch: Partial<ChequeScheduleLine>) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  };

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);

  const removeLine = (key: string) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.key !== key)));
  };

  const splitEvenly = () => {
    if (!openBalance || lines.length === 0) return;
    const perLine = Math.floor(openBalance / lines.length);
    const remainder = openBalance - perLine * lines.length;
    setLines((prev) =>
      prev.map((l, i) => ({
        ...l,
        amount: perLine + (i === prev.length - 1 ? remainder : 0),
      }))
    );
  };

  const handleSave = () => {
    if (!linkedDoc || !bank) {
      toast.error("Select a linked document and bank account");
      return;
    }
    if (!allLinesFilled) {
      toast.error("Fill all cheque schedule lines");
      return;
    }
    if (!scheduleValid) {
      toast.error(`Schedule total must be ≤ open balance (${formatBdt(openBalance)})`);
      return;
    }

    const created: ChequeInstrument[] = lines.map((line, i) => ({
      id: `ch-new-${Date.now()}-${i}`,
      chequeNumber: line.chequeNumber.trim(),
      direction,
      party,
      bank: bank.bank,
      bankAccountId: bank.id,
      amount: line.amount,
      issueDate: line.issueDate,
      maturityDate: line.maturityDate,
      linkedDoc: linkedDocNumber,
      linkedDocType: direction === "received" ? "AR Invoice" : "AP Bill",
      status: "issued",
      notes:
        lines.length > 1
          ? `Schedule ${i + 1} of ${lines.length} — ${formatBdt(line.amount)}`
          : undefined,
    }));

    onSave(created);
    toast.success(
      `${created.length} cheque${created.length > 1 ? "s" : ""} registered — ${formatBdt(scheduleTotal)}`
    );
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 pb-4 pt-3">
          <div className="shrink-0 border-b border-border pb-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold">Register Cheque</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Link to AR/AP document — add one or more post-dated cheques with maturity schedule.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 text-xs">
                Cancel
              </Button>
            </div>
          </div>

          {/* Direction */}
          <div className="mt-4 shrink-0">
            <label className="text-[11px] font-medium text-muted-foreground">Direction</label>
            <div className="mt-1 flex gap-1 rounded-lg border border-input p-0.5">
              {(["received", "issued"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDirection(d)}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    direction === d
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {d === "received" ? "Received (from customer)" : "Issued (to vendor)"}
                </button>
              ))}
            </div>
          </div>

          {/* Link document */}
          <div className="mt-4 shrink-0 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">
                {direction === "received" ? "AR Invoice" : "AP Bill"}
              </label>
              <Select
                value={linkedDocId}
                onChange={(e) => setLinkedDocId(e.target.value)}
                className="mt-1 h-8 w-full text-xs"
              >
                <option value="">Select document…</option>
                {linkOptions.map((doc) => {
                  const num = direction === "received" ? (doc as ArInvoice).number : (doc as ApBill).number;
                  const name =
                    direction === "received" ? (doc as ArInvoice).customer : (doc as ApBill).vendor;
                  const open =
                    direction === "received" ? (doc as ArInvoice).residual : (doc as ApBill).residual;
                  return (
                    <option key={doc.id} value={doc.id}>
                      {num} — {name} ({formatBdt(open)} open)
                    </option>
                  );
                })}
              </Select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Bank Account</label>
              <Select
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="mt-1 h-8 w-full text-xs"
              >
                {bankAccountsSeed.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bank} {b.accountNo}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {linkedDoc && (
            <div className="mt-3 shrink-0 rounded-lg border border-input bg-muted/30 p-3 text-xs">
              <div className="flex flex-wrap justify-between gap-2">
                <span>
                  <span className="text-muted-foreground">Party </span>
                  <strong>{party}</strong>
                </span>
                <span>
                  <span className="text-muted-foreground">Open balance </span>
                  <strong className="tabular-nums">{formatBdt(openBalance)}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Schedule lines */}
          <div className="mt-4 shrink-0">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[11px] font-medium text-muted-foreground">
                Cheque Schedule ({lines.length} line{lines.length !== 1 ? "s" : ""})
              </label>
              <div className="flex gap-1">
                {linkedDoc && lines.length > 1 && (
                  <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={splitEvenly}>
                    Split evenly
                  </Button>
                )}
                <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={addLine}>
                  <Plus className="mr-1 h-3 w-3" /> Add cheque
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {lines.map((line, idx) => (
                <div
                  key={line.key}
                  className="rounded-lg border border-input bg-card p-3 text-xs"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-muted-foreground">Cheque {idx + 1}</span>
                    {lines.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeLine(line.key)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground">Cheque #</label>
                      <Input
                        value={line.chequeNumber}
                        onChange={(e) => updateLine(line.key, { chequeNumber: e.target.value })}
                        placeholder="e.g. 452101"
                        className="mt-0.5 h-8 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Amount (৳)</label>
                      <Input
                        type="number"
                        min={0}
                        value={line.amount || ""}
                        onChange={(e) =>
                          updateLine(line.key, { amount: Number(e.target.value) || 0 })
                        }
                        className="mt-0.5 h-8 text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Issue date</label>
                      <Input
                        type="date"
                        value={line.issueDate}
                        onChange={(e) => updateLine(line.key, { issueDate: e.target.value })}
                        className="mt-0.5 h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Maturity date</label>
                      <Input
                        type="date"
                        value={line.maturityDate}
                        onChange={(e) => updateLine(line.key, { maturityDate: e.target.value })}
                        className="mt-0.5 h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total footer */}
          <div
            className={cn(
              "mt-4 shrink-0 rounded-lg border px-3 py-2 text-xs",
              scheduleValid
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                : "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30"
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-4 tabular-nums">
                <span>
                  <span className="text-muted-foreground">Schedule total </span>
                  <strong>{formatBdt(scheduleTotal)}</strong>
                </span>
                {linkedDoc && (
                  <span>
                    <span className="text-muted-foreground">Open balance </span>
                    <strong>{formatBdt(openBalance)}</strong>
                  </span>
                )}
              </div>
              {scheduleValid ? (
                <Badge variant="success" className="text-[10px]">
                  Within open balance
                </Badge>
              ) : linkedDoc ? (
                <span className="text-amber-700 dark:text-amber-400">
                  {scheduleTotal > openBalance
                    ? `Exceeds by ${formatBdt(scheduleTotal - openBalance)}`
                    : "Enter amounts"}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-4 shrink-0 flex gap-2 border-t border-border pt-3">
            <Button size="sm" onClick={handleSave} disabled={!linkedDoc || !allLinesFilled || !scheduleValid}>
              Register Cheque{lines.length > 1 ? "s" : ""}
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

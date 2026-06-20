"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  coaSeed,
  formatBdt,
  getPostableAccounts,
  type JournalEntry,
  type JournalLine,
  type JournalType,
} from "@/lib/mock-data/finance";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export type EditableJournalLine = JournalLine & { key: string };

const JOURNAL_TYPES: JournalType[] = ["SAL", "PUR", "BNK", "CSH", "MISC", "INV", "PAY", "TAX"];

function emptyLine(): EditableJournalLine {
  return { key: crypto.randomUUID(), accountCode: "", accountName: "", debit: 0, credit: 0 };
}

function defaultLines(): EditableJournalLine[] {
  return [
    { key: "1", accountCode: "1200", accountName: "Accounts Receivable", debit: 0, credit: 0 },
    { key: "2", accountCode: "4100", accountName: "Sales Revenue", debit: 0, credit: 0 },
  ];
}

function BalanceFooter({ debit, credit }: { debit: number; credit: number }) {
  const balanced = debit === credit && debit > 0;
  const diff = Math.abs(debit - credit);
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2 text-xs",
        balanced ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30" : "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-4 tabular-nums">
          <span><span className="text-muted-foreground">Debit </span><strong>{formatBdt(debit)}</strong></span>
          <span><span className="text-muted-foreground">Credit </span><strong>{formatBdt(credit)}</strong></span>
        </div>
        {balanced ? (
          <Badge variant="success" className="text-[10px]">Balanced</Badge>
        ) : (
          <span className="text-amber-700 dark:text-amber-400">Out of balance: {formatBdt(diff)}</span>
        )}
      </div>
    </div>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry, mode: "draft" | "post") => void;
  nextNumber: string;
  editEntry?: JournalEntry | null;
};

export function JournalEntryFormSheet({ open, onClose, onSave, nextNumber, editEntry }: Props) {
  const postable = useMemo(() => getPostableAccounts(coaSeed), []);
  const isEdit = !!editEntry && editEntry.status === "draft";

  const [type, setType] = useState<JournalType>("MISC");
  const [date, setDate] = useState("2026-06-19");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<EditableJournalLine[]>(defaultLines);

  const resetForm = () => {
    setType("MISC");
    setDate("2026-06-19");
    setReference("");
    setDescription("");
    setLines(defaultLines());
  };

  const loadEdit = () => {
    if (!editEntry) return;
    setType(editEntry.type);
    setDate(editEntry.date);
    setReference(editEntry.reference);
    setDescription(editEntry.description);
    setLines(editEntry.lines.map((l, i) => ({ ...l, key: String(i) })));
  };

  const handleOpenChange = (v: boolean) => {
    if (v) {
      if (editEntry) loadEdit();
      else resetForm();
    } else {
      onClose();
    }
  };

  const debitTotal = lines.reduce((s, l) => s + (l.debit || 0), 0);
  const creditTotal = lines.reduce((s, l) => s + (l.credit || 0), 0);
  const balanced = debitTotal === creditTotal && debitTotal > 0;

  const updateLine = (key: string, patch: Partial<EditableJournalLine>) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.key !== key) return l;
        const next = { ...l, ...patch };
        if (patch.accountCode !== undefined) {
          const acc = postable.find((a) => a.code === patch.accountCode);
          next.accountName = acc?.name ?? "";
        }
        if (patch.debit !== undefined && patch.debit > 0) next.credit = 0;
        if (patch.credit !== undefined && patch.credit > 0) next.debit = 0;
        return next;
      })
    );
  };

  const removeLine = (key: string) => {
    if (lines.length <= 2) {
      toast.error("At least two lines required");
      return;
    }
    setLines((prev) => prev.filter((l) => l.key !== key));
  };

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);

  const buildEntry = (status: "draft" | "posted"): JournalEntry | null => {
    if (!description.trim()) {
      toast.error("Description is required");
      return null;
    }
    if (!balanced) {
      toast.error("Journal must balance before saving");
      return null;
    }
    const invalidLine = lines.find((l) => !l.accountCode);
    if (invalidLine) {
      toast.error("All lines need an account");
      return null;
    }
    return {
      id: editEntry?.id ?? `je-${Date.now()}`,
      number: editEntry?.number ?? nextNumber,
      type,
      date,
      reference: reference || `REF-${Date.now().toString().slice(-4)}`,
      description: description.trim(),
      debitTotal,
      creditTotal,
      status,
      source: "Manual",
      lines: lines.map(({ accountCode, accountName, debit, credit }) => ({ accountCode, accountName, debit, credit })),
    };
  };

  const handleSave = (mode: "draft" | "post") => {
    const entry = buildEntry(mode === "post" ? "posted" : "draft");
    if (!entry) return;
    onSave(entry, mode);
    toast.success(mode === "post" ? "Journal posted" : "Draft saved");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-3xl gap-0 overflow-hidden p-0 sm:max-w-3xl [&>button.absolute]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 pb-4 pt-3">
        <div className="border-b border-border pb-4">
          <p className="font-mono text-xs text-muted-foreground">{isEdit ? editEntry?.number : nextNumber}</p>
          <h2 className="font-semibold mt-1">{isEdit ? "Edit Journal Entry" : "New Journal Entry"}</h2>
          <Badge variant="warning" className="mt-2 text-[10px]">Draft</Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[11px] text-muted-foreground">Journal type</label>
            <Select value={type} onChange={(e) => setType(e.target.value as JournalType)} className="mt-1 h-8 text-xs w-full">
              {JOURNAL_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground">Accounting date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 h-8 text-xs" />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground">Reference</label>
            <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="External ref…" className="mt-1 h-8 text-xs" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] text-muted-foreground">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Journal description…" className="mt-1 h-8 text-xs" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium">Journal Lines</h3>
            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={addLine}>
              <Plus className="h-3 w-3 mr-1" /> Add line
            </Button>
          </div>
          <div className="rounded-lg border border-input overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-2 py-1.5 text-left font-medium">Account</th>
                  <th className="px-2 py-1.5 text-right font-medium w-28">Debit</th>
                  <th className="px-2 py-1.5 text-right font-medium w-28">Credit</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.key} className="border-t border-border">
                    <td className="px-2 py-1">
                      <Select
                        value={line.accountCode}
                        onChange={(e) => updateLine(line.key, { accountCode: e.target.value })}
                        className="h-7 text-[10px] w-full"
                      >
                        <option value="">Select account…</option>
                        {postable.map((a) => (
                          <option key={a.id} value={a.code}>{a.code} — {a.name}</option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        type="number"
                        min={0}
                        value={line.debit || ""}
                        onChange={(e) => updateLine(line.key, { debit: Number(e.target.value) || 0 })}
                        className="h-7 text-xs text-right tabular-nums"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        type="number"
                        min={0}
                        value={line.credit || ""}
                        onChange={(e) => updateLine(line.key, { credit: Number(e.target.value) || 0 })}
                        className="h-7 text-xs text-right tabular-nums"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-1 py-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => removeLine(line.key)}>
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3">
          <BalanceFooter debit={debitTotal} credit={creditTotal} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => handleSave("draft")} disabled={!balanced}>
            Save Draft
          </Button>
          <Button size="sm" onClick={() => handleSave("post")} disabled={!balanced}>
            Post Entry
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function JournalLinesTable({ lines, showFooter = true }: { lines: JournalLine[]; showFooter?: boolean }) {
  const debitTotal = lines.reduce((s, l) => s + l.debit, 0);
  const creditTotal = lines.reduce((s, l) => s + l.credit, 0);

  return (
    <>
      <table className="w-full text-xs border border-input rounded-lg overflow-hidden">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-2 py-1.5 text-left">Account</th>
            <th className="px-2 py-1.5 text-right">Debit</th>
            <th className="px-2 py-1.5 text-right">Credit</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <tr key={i} className="border-t border-border">
              <td className="px-2 py-1.5">
                <span className="font-mono text-[10px] text-muted-foreground">{l.accountCode}</span> {l.accountName}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums">{l.debit ? formatBdt(l.debit) : "—"}</td>
              <td className="px-2 py-1.5 text-right tabular-nums">{l.credit ? formatBdt(l.credit) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showFooter && (
        <div className="mt-2">
          <BalanceFooter debit={debitTotal} credit={creditTotal} />
        </div>
      )}
    </>
  );
}

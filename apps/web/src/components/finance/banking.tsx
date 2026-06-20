"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Landmark, Link2, RefreshCw, Sparkles, Unlink } from "lucide-react";
import { toast } from "sonner";
import {
  bankAccountsSeed,
  bankStatementsSeed,
  bankSystemTransactionsSeed,
  formatBdt,
  type BankAccount,
  type BankStatement,
  type SystemTransaction,
} from "@/lib/mock-data/finance";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinancePeriodBanner } from "./finance-period-banner";

export function Banking() {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount>(bankAccountsSeed[0]);
  const [statements, setStatements] = useState<BankStatement[]>(() => [...bankStatementsSeed]);
  const [systemTx, setSystemTx] = useState<SystemTransaction[]>(() => [...bankSystemTransactionsSeed]);
  const [selectedStmtId, setSelectedStmtId] = useState<string | null>(null);
  const [selectedSysId, setSelectedSysId] = useState<string | null>(null);

  const accountStatements = useMemo(
    () => statements.filter((s) => s.bankAccountId === selectedAccount.id),
    [statements, selectedAccount.id]
  );

  const accountSystemTx = useMemo(
    () => systemTx.filter((t) => t.bankAccountId === selectedAccount.id),
    [systemTx, selectedAccount.id]
  );

  const unreconciledStmt = accountStatements.filter((s) => !s.matched).length;
  const diff = selectedAccount.glBalance - selectedAccount.statementBalance;

  const matchPair = (stmtId: string, sysId: string) => {
    setStatements((prev) =>
      prev.map((s) => (s.id === stmtId ? { ...s, matched: true, matchedToId: sysId } : s))
    );
    setSystemTx((prev) =>
      prev.map((t) => (t.id === sysId ? { ...t, matched: true, matchedToId: stmtId } : t))
    );
    setSelectedStmtId(null);
    setSelectedSysId(null);
    toast.success("Lines matched");
  };

  const unmatch = (stmtId: string) => {
    const stmt = statements.find((s) => s.id === stmtId);
    if (!stmt?.matchedToId) return;
    const sysId = stmt.matchedToId;
    setStatements((prev) =>
      prev.map((s) => (s.id === stmtId ? { ...s, matched: false, matchedToId: undefined } : s))
    );
    setSystemTx((prev) =>
      prev.map((t) => (t.id === sysId ? { ...t, matched: false, matchedToId: undefined } : t))
    );
    toast.info("Match removed");
  };

  const handleManualMatch = () => {
    if (!selectedStmtId || !selectedSysId) {
      toast.error("Select one statement line and one system transaction");
      return;
    }
    const stmt = statements.find((s) => s.id === selectedStmtId);
    const sys = systemTx.find((t) => t.id === selectedSysId);
    if (!stmt || !sys) return;
    if (stmt.amount !== sys.amount) {
      toast.error(`Amount mismatch: statement ${formatBdt(stmt.amount)} vs system ${formatBdt(sys.amount)}`);
      return;
    }
    matchPair(selectedStmtId, selectedSysId);
  };

  const handleAiSuggest = () => {
    const unmatchedStmt = accountStatements.find((s) => !s.matched);
    const unmatchedSys = accountSystemTx.find((t) => !t.matched && unmatchedStmt && t.amount === unmatchedStmt.amount);
    if (unmatchedStmt && unmatchedSys) {
      setSelectedStmtId(unmatchedStmt.id);
      setSelectedSysId(unmatchedSys.id);
      toast.info(`AI suggests: match "${unmatchedStmt.description.slice(0, 30)}…" ↔ ${unmatchedSys.ref}`);
    } else {
      toast.info("No obvious matches found");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FinancePeriodBanner />

      <div className="grid gap-3 md:grid-cols-3">
        {bankAccountsSeed.map((acc) => {
          const unrec = statements.filter((s) => s.bankAccountId === acc.id && !s.matched).length;
          return (
            <button
              key={acc.id}
              type="button"
              onClick={() => {
                setSelectedAccount(acc);
                setSelectedStmtId(null);
                setSelectedSysId(null);
              }}
              className={cn(
                "rounded-xl border border-input bg-card p-4 text-left hover:border-indigo-300 transition-colors",
                selectedAccount.id === acc.id && "border-indigo-400 ring-1 ring-indigo-200"
              )}
            >
              <div className="flex items-center gap-2">
                <Landmark className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{acc.bank}</span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{acc.accountNo}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                <div><span className="text-muted-foreground">GL</span><p className="font-semibold">{formatBdt(acc.glBalance)}</p></div>
                <div><span className="text-muted-foreground">Statement</span><p className="font-semibold">{formatBdt(acc.statementBalance)}</p></div>
              </div>
              {unrec > 0 && (
                <Badge variant="warning" className="mt-2 text-[10px]">{unrec} unreconciled</Badge>
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-input bg-card p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-4 text-xs">
          <span><span className="text-muted-foreground">GL Balance </span><strong>{formatBdt(selectedAccount.glBalance)}</strong></span>
          <span><span className="text-muted-foreground">Statement </span><strong>{formatBdt(selectedAccount.statementBalance)}</strong></span>
          <span><span className="text-muted-foreground">Difference </span><strong className={cn(diff !== 0 && "text-amber-600")}>{formatBdt(diff)}</strong></span>
          <span><span className="text-muted-foreground">Unreconciled </span><strong>{unreconciledStmt}</strong></span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleAiSuggest}>
            <Sparkles className="h-3.5 w-3.5 mr-1" /> AI Suggest
          </Button>
          <Button variant="outline" size="sm" onClick={handleManualMatch} disabled={!selectedStmtId || !selectedSysId}>
            <Link2 className="h-3.5 w-3.5 mr-1" /> Match Selected
          </Button>
          <Button size="sm" onClick={() => toast.success("Reconciliation completed (prototype)")}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reconcile
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 min-h-[360px]">
        <div className="rounded-xl border border-input bg-card overflow-hidden flex flex-col">
          <div className="border-b border-border px-4 py-2.5 flex items-center justify-between">
            <h3 className="text-sm font-medium">Bank Statement Lines</h3>
            <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => toast.info("Import statement (prototype)")}>Import</Button>
          </div>
          <div className="overflow-y-auto flex-1 max-h-[400px]">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-medium w-8" />
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-left font-medium">Description</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {accountStatements.map((line) => (
                  <tr
                    key={line.id}
                    onClick={() => !line.matched && setSelectedStmtId(line.id === selectedStmtId ? null : line.id)}
                    className={cn(
                      "border-t border-border",
                      !line.matched && "cursor-pointer hover:bg-muted/40",
                      selectedStmtId === line.id && "bg-indigo-50 dark:bg-indigo-950/40",
                      line.matched && "opacity-70"
                    )}
                  >
                    <td className="px-3 py-2">
                      {line.matched ? (
                        <button type="button" onClick={(e) => { e.stopPropagation(); unmatch(line.id); }} title="Unmatch">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </button>
                      ) : (
                        <span className={cn("block h-3 w-3 rounded-full border-2", selectedStmtId === line.id ? "border-indigo-600 bg-indigo-600" : "border-muted-foreground")} />
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{line.date}</td>
                    <td className="px-3 py-2">{line.description}</td>
                    <td className={cn("px-3 py-2 text-right tabular-nums font-medium", line.amount < 0 ? "text-rose-600" : "text-emerald-600")}>
                      {line.amount < 0 ? "−" : "+"}{formatBdt(Math.abs(line.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-input bg-card overflow-hidden flex flex-col">
          <div className="border-b border-border px-4 py-2.5">
            <h3 className="text-sm font-medium">System Transactions</h3>
            <p className="text-[10px] text-muted-foreground">Receipts · Payments · Journal entries</p>
          </div>
          <div className="overflow-y-auto flex-1 max-h-[400px]">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-medium w-8" />
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-left font-medium">Ref / Type</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {accountSystemTx.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => !tx.matched && setSelectedSysId(tx.id === selectedSysId ? null : tx.id)}
                    className={cn(
                      "border-t border-border",
                      !tx.matched && "cursor-pointer hover:bg-muted/40",
                      selectedSysId === tx.id && "bg-indigo-50 dark:bg-indigo-950/40",
                      tx.matched && "opacity-70"
                    )}
                  >
                    <td className="px-3 py-2">
                      {tx.matched ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className={cn("block h-3 w-3 rounded-full border-2", selectedSysId === tx.id ? "border-indigo-600 bg-indigo-600" : "border-muted-foreground")} />
                      )}
                    </td>
                    <td className="px-3 py-2">{tx.date}</td>
                    <td className="px-3 py-2">
                      <span className="font-mono">{tx.ref}</span>
                      <Badge variant="secondary" className="ml-1 text-[9px] capitalize">{tx.type}</Badge>
                    </td>
                    <td className={cn("px-3 py-2 text-right tabular-nums font-medium", tx.amount < 0 ? "text-rose-600" : "text-emerald-600")}>
                      {tx.amount < 0 ? "−" : "+"}{formatBdt(Math.abs(tx.amount))}
                    </td>
                  </tr>
                ))}
                {accountSystemTx.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No system transactions for this account.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(selectedStmtId || selectedSysId) && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 px-3 py-2 text-xs flex items-center justify-between dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <span>
            {selectedStmtId && selectedSysId
              ? "Ready to match — amounts must be equal"
              : "Select one line from each side to match"}
          </span>
          {selectedStmtId && selectedSysId && (
            <Button variant="ghost" size="sm" className="h-7" onClick={() => { setSelectedStmtId(null); setSelectedSysId(null); }}>
              <Unlink className="h-3.5 w-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

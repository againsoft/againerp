"use client";

import { useMemo, useState } from "react";
import { Download, FileBarChart, Printer } from "lucide-react";
import { toast } from "sonner";
import { financeReportPreviews, financeReportsCatalog, formatBdt } from "@/lib/mock-data/finance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { FinancePeriodBanner } from "./finance-period-banner";

const PERIODS = ["Jun 2026", "May 2026", "Q2 2026", "YTD 2026"];

export function FinanceReports() {
  const [selectedId, setSelectedId] = useState<string>("pl");
  const [period, setPeriod] = useState(PERIODS[0]);

  const preview = useMemo(() => {
    const base = financeReportPreviews[selectedId];
    if (base) return { ...base, title: base.title.replace(/Jun 2026|19 Jun 2026/, period.split(" ")[0] === "YTD" ? "YTD 2026" : period) };
    const report = financeReportsCatalog.find((r) => r.id === selectedId);
    return {
      title: `${report?.title ?? "Report"} — ${period}`,
      rows: [{ label: "No detailed preview (prototype)", amount: 0 }],
      totals: [{ label: "Run full report in production", amount: 0 }],
    };
  }, [selectedId, period]);

  const selectedReport = financeReportsCatalog.find((r) => r.id === selectedId);

  return (
    <div className="flex flex-col gap-4 min-h-0 flex-1">
      <FinancePeriodBanner />

      <div className="grid gap-4 lg:grid-cols-4 min-h-[480px]">
        <div className="lg:col-span-1 space-y-2">
          <p className="text-xs font-medium text-muted-foreground px-1">Reports</p>
          {financeReportsCatalog.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => setSelectedId(report.id)}
              className={cn(
                "w-full rounded-lg border border-input bg-card p-3 text-left text-xs transition-colors hover:border-indigo-300",
                selectedId === report.id && "border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30"
              )}
            >
              <div className="flex items-center gap-2">
                <FileBarChart className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium">{report.title}</span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">{report.description}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 flex flex-col rounded-xl border border-input bg-card overflow-hidden min-h-[420px]">
          <div className="border-b border-border px-4 py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div>
              <h3 className="text-sm font-medium">{preview.title}</h3>
              {selectedReport && <p className="text-[10px] text-muted-foreground">{selectedReport.description}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="h-8 w-32 text-xs">
                {PERIODS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Select>
              <Button variant="outline" size="sm" className="h-8" onClick={() => toast.info("Print (prototype)")}>
                <Printer className="h-3.5 w-3.5 mr-1" /> Print
              </Button>
              <Button variant="outline" size="sm" className="h-8" onClick={() => toast.success("Export CSV (prototype)")}>
                <Download className="h-3.5 w-3.5 mr-1" /> Export
              </Button>
              <Button size="sm" className="h-8" onClick={() => toast.success(`${selectedReport?.title} refreshed`)}>
                Run Report
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <table className="w-full text-xs max-w-2xl">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left font-medium">Account / Bucket</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className={cn("py-2", row.indent && "pl-4 text-muted-foreground")}>{row.label}</td>
                    <td className={cn("py-2 text-right tabular-nums font-medium", row.amount < 0 && "text-rose-600")}>
                      {formatBdt(Math.abs(row.amount))}
                      {row.amount < 0 && " (Dr)"}
                    </td>
                  </tr>
                ))}
              </tbody>
              {preview.totals && preview.totals.length > 0 && (
                <tfoot>
                  {preview.totals.map((t, i) => (
                    <tr key={i} className="border-t-2 border-border font-semibold">
                      <td className="py-2">{t.label}</td>
                      <td className="py-2 text-right tabular-nums">{formatBdt(t.amount)}</td>
                    </tr>
                  ))}
                </tfoot>
              )}
            </table>

            {financeReportPreviews[selectedId] && (
              <Button variant="ghost" className="mt-4 h-auto p-0 text-xs text-indigo-600" onClick={() => toast.info("Drill-down to journal entries (prototype)")}>
                Drill down to journal entries →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  formatBdt,
  taxFilingSeed,
  taxRatesSeed,
  taxReturnsSeed,
  taxRulesSeed,
} from "@/lib/mock-data/finance";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinancePeriodBanner } from "./finance-period-banner";

const TABS = [
  { id: "rates", label: "Tax Rates" },
  { id: "rules", label: "Rules" },
  { id: "returns", label: "Returns" },
  { id: "filing", label: "Filing Status" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function TaxManagement() {
  const [tab, setTab] = useState<TabId>("rates");

  return (
    <div className="flex flex-col gap-4">
      <FinancePeriodBanner />

      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors",
              tab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "rates" && (
        <>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Tax rate added (prototype)")}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Rate
            </Button>
          </div>
          <div className="rounded-xl border border-input bg-card overflow-x-auto">
            <table className="w-full text-xs min-w-[520px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Name</th>
                  <th className="px-4 py-2 text-right font-medium">Rate</th>
                  <th className="px-4 py-2 text-left font-medium">Type</th>
                  <th className="px-4 py-2 text-left font-medium">GL</th>
                  <th className="px-4 py-2 text-center font-medium">Active</th>
                </tr>
              </thead>
              <tbody>
                {taxRatesSeed.map((rate) => (
                  <tr key={rate.id} className="border-t border-border">
                    <td className="px-4 py-2 font-medium">{rate.name}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{rate.rate}%</td>
                    <td className="px-4 py-2 capitalize">{rate.type}</td>
                    <td className="px-4 py-2 font-mono">{rate.glAccount}</td>
                    <td className="px-4 py-2 text-center">
                      <Badge variant={rate.active ? "success" : "muted"} className="text-[10px]">{rate.active ? "Yes" : "No"}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Output VAT MTD", value: formatBdt(620_000) },
              { label: "Input VAT MTD", value: formatBdt(410_000) },
              { label: "Net VAT Payable", value: formatBdt(210_000) },
            ].map((k) => (
              <div key={k.label} className="rounded-xl border border-input bg-card p-4">
                <p className="text-[11px] text-muted-foreground">{k.label}</p>
                <p className="mt-1 text-xl font-semibold">{k.value}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "rules" && (
        <div className="rounded-xl border border-input bg-card overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Rule</th>
                <th className="px-4 py-2 text-left font-medium">Applies to</th>
                <th className="px-4 py-2 text-left font-medium">Rate</th>
                <th className="px-4 py-2 text-left font-medium">Condition</th>
                <th className="px-4 py-2 text-center font-medium">Active</th>
              </tr>
            </thead>
            <tbody>
              {taxRulesSeed.map((rule) => (
                <tr key={rule.id} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{rule.name}</td>
                  <td className="px-4 py-2">{rule.appliesTo}</td>
                  <td className="px-4 py-2">{rule.rateName}</td>
                  <td className="px-4 py-2 text-muted-foreground">{rule.condition}</td>
                  <td className="px-4 py-2 text-center">
                    <Badge variant={rule.active ? "success" : "muted"} className="text-[10px]">{rule.active ? "Yes" : "No"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "returns" && (
        <div className="rounded-xl border border-input bg-card overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Period</th>
                <th className="px-4 py-2 text-right font-medium">Gross Sales</th>
                <th className="px-4 py-2 text-right font-medium">Output Tax</th>
                <th className="px-4 py-2 text-right font-medium">Input Tax</th>
                <th className="px-4 py-2 text-right font-medium">Net Payable</th>
                <th className="px-4 py-2 text-center font-medium">Status</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taxReturnsSeed.map((ret) => (
                <tr key={ret.id} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{ret.period}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatBdt(ret.grossSales)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatBdt(ret.outputTax)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatBdt(ret.inputTax)}</td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">{formatBdt(ret.netPayable)}</td>
                  <td className="px-4 py-2 text-center">
                    <Badge variant={ret.status === "paid" ? "success" : ret.status === "filed" ? "secondary" : "warning"} className="text-[10px] capitalize">{ret.status}</Badge>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {ret.status === "draft" && (
                      <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => toast.success("VAT return filed (prototype)")}>File</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "filing" && (
        <div className="space-y-3">
          {taxFilingSeed.map((f) => (
            <div key={f.id} className="rounded-xl border border-input bg-card p-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <p className="font-medium">{f.period} VAT Return</p>
                <p className="text-muted-foreground mt-0.5">Due {f.dueDate}{f.filedDate ? ` · Filed ${f.filedDate}` : ""}</p>
              </div>
              <Badge
                variant={f.status === "filed" ? "success" : f.status === "overdue" ? "muted" : "warning"}
                className="text-[10px] capitalize"
              >
                {f.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

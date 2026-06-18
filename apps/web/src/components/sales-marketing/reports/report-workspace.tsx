"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import { ReportCatalog } from "@/components/sales-marketing/reports/report-catalog";
import { ReportDetailView } from "@/components/sales-marketing/reports/report-detail-view";
import { ReportKpiStrip } from "@/components/sales-marketing/reports/report-kpi-strip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  SMW_REPORT_CATEGORY_LABELS,
  SMW_REPORT_PERIODS,
  getReportById,
  isValidReportId,
  smwReportCatalog,
  type SmwReportCategory,
  type SmwReportDefinition,
  type SmwReportPeriod,
} from "@/lib/mock-data/smw-reports";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/sales-marketing/reports?${query}` : "/sales-marketing/reports";
}

function ReportWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportParam = searchParams.get("report");

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") ?? "all");
  const [period, setPeriod] = useState<SmwReportPeriod>((searchParams.get("period") as SmwReportPeriod) || "month");

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const activeReport = useMemo(() => {
    if (!reportParam || !isValidReportId(reportParam)) return null;
    return getReportById(reportParam) ?? null;
  }, [reportParam]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return smwReportCatalog.filter((r) => {
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (q && !r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [debouncedSearch, categoryFilter]);

  const openReport = (report: SmwReportDefinition) => pushParams((p) => p.set("report", report.id));
  const closeReport = () => pushParams((p) => p.delete("report"));

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setCategoryFilter("all");
    pushParams((p) => { ["q", "category"].forEach((k) => p.delete(k)); });
  };

  const activeFilters = [debouncedSearch, categoryFilter !== "all"].filter(Boolean).length;
  const periodLabel = SMW_REPORT_PERIODS.find((p) => p.id === period)?.label ?? "This month";

  useEffect(() => {
    if (reportParam && !activeReport) {
      toast.error("Report not found");
      closeReport();
    }
  }, [reportParam, activeReport]);

  return (
    <>
      {!activeReport && <ReportKpiStrip reports={filtered} />}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {activeReport ? (
          <Button type="button" variant="ghost" size="sm" className="h-8" onClick={closeReport}>
            <ArrowLeft className="mr-1 h-3.5 w-3.5" aria-hidden /> Back to catalog
          </Button>
        ) : (
          <Input placeholder="Search reports…" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="h-8 max-w-[220px] text-xs" aria-label="Search reports" />
        )}
        {!activeReport && (
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-8 w-[130px] text-xs" aria-label="Category">
            <option value="all">All categories</option>
            {(Object.keys(SMW_REPORT_CATEGORY_LABELS) as SmwReportCategory[]).map((c) => (
              <option key={c} value={c}>{SMW_REPORT_CATEGORY_LABELS[c]}</option>
            ))}
          </Select>
        )}
        <Select
          value={period}
          onChange={(e) => {
            const val = e.target.value as SmwReportPeriod;
            setPeriod(val);
            pushParams((p) => { if (val === "month") p.delete("period"); else p.set("period", val); });
          }}
          className="h-8 w-[130px] text-xs"
          aria-label="Period"
        >
          {SMW_REPORT_PERIODS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </Select>
        {!activeReport && activeFilters > 0 && (
          <Button type="button" variant="ghost" size="sm" className="h-8" onClick={resetFilters}>
            <X className="mr-1 h-3.5 w-3.5" aria-hidden /> Clear
          </Button>
        )}
      </div>

      {!activeReport && (
        <p className="mt-2 text-xs text-muted-foreground">
          {filtered.length} report{filtered.length === 1 ? "" : "s"}
          {activeFilters > 0 ? " · filtered" : ""}
        </p>
      )}

      <div className="mt-3">
        {activeReport ? (
          <ReportDetailView report={activeReport} periodLabel={periodLabel} />
        ) : (
          <ReportCatalog reports={filtered} onOpen={openReport} />
        )}
      </div>
    </>
  );
}

export function ReportWorkspace() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading reports…</p>}>
      <ReportWorkspaceContent />
    </Suspense>
  );
}

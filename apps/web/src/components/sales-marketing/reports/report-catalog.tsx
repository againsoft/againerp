"use client";

import type { SmwReportDefinition } from "@/lib/mock-data/smw-reports";
import { SMW_REPORT_CATEGORY_LABELS } from "@/lib/mock-data/smw-reports";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  reports: SmwReportDefinition[];
  onOpen: (report: SmwReportDefinition) => void;
  activeId?: string | null;
};

export function ReportCatalog({ reports, onOpen, activeId }: Props) {
  if (reports.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
        No reports match your filters.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => (
        <button
          key={report.id}
          type="button"
          onClick={() => onOpen(report)}
          className={cn(
            "flex flex-col rounded-lg border border-input bg-card p-4 text-left transition-colors hover:bg-muted/40",
            activeId === report.id && "ring-2 ring-violet-500",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <BarChart3 className="h-4 w-4" aria-hidden />
            </div>
            {report.featured && (
              <Badge variant="secondary" className="text-[10px]">Featured</Badge>
            )}
          </div>
          <h3 className="mt-3 text-sm font-semibold">{report.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{report.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
            <Badge variant="outline" className="font-normal">{SMW_REPORT_CATEGORY_LABELS[report.category]}</Badge>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden /> {report.lastRun}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
            <FileSpreadsheet className="h-3 w-3" aria-hidden />
            {report.format.join(" · ").toUpperCase()}
            {report.schedule ? ` · ${report.schedule}` : ""}
          </div>
        </button>
      ))}
    </div>
  );
}

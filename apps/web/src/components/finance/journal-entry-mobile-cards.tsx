"use client";

import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import {
  formatBdt,
  JOURNAL_STATUS_LABELS,
  type JournalEntry,
  type JournalStatus,
} from "@/lib/mock-data/finance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function statusVariant(s: JournalStatus): "success" | "warning" | "muted" {
  if (s === "posted") return "success";
  if (s === "draft") return "warning";
  return "muted";
}

type Props = {
  entries: JournalEntry[];
  onView: (entry: JournalEntry) => void;
  onEdit: (entry: JournalEntry) => void;
};

export function JournalEntryMobileCards({ entries, onView, onEdit }: Props) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-input bg-card p-8 text-center">
        <p className="text-sm font-medium">No journal entries found</p>
        <p className="mt-1 text-xs text-muted-foreground">Try adjusting filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-20">
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => onView(entry)}
          className="flex w-full gap-3 rounded-lg border border-input bg-card p-3 text-left hover:border-indigo-300 transition-colors"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">{entry.number}</span>
              <Badge variant="secondary" className="font-mono text-[9px]">{entry.type}</Badge>
              <Badge variant={statusVariant(entry.status)} className="text-[9px]">
                {JOURNAL_STATUS_LABELS[entry.status]}
              </Badge>
            </div>
            <p className="mt-1 text-sm font-medium line-clamp-2">{entry.description}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>{entry.date}</span>
              <span className="font-medium text-foreground">{formatBdt(entry.debitTotal)}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 shrink-0 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(entry)}>
                <Eye className="mr-2 h-3.5 w-3.5" /> View
              </DropdownMenuItem>
              {entry.status === "draft" && (
                <DropdownMenuItem onClick={() => onEdit(entry)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </button>
      ))}
    </div>
  );
}

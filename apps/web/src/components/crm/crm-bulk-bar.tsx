"use client";

import { Download, Tag, Trash2, UserCog, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  count: number;
  onClear: () => void;
  onAssign?: () => void;
  onTag?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
};

/** DS-BULK-BAR — sticky when rows selected. */
export function CrmBulkBar({ count, onClear, onAssign, onTag, onDelete, onExport }: Props) {
  if (count === 0) return null;

  return (
    <div
      data-component="DS-BULK-BAR"
      className="sticky top-0 z-10 flex flex-wrap items-center gap-2 rounded-lg border bg-accent/80 px-3 py-2 backdrop-blur-sm"
    >
      <span className="text-xs font-medium">{count} selected</span>
      <Button type="button" variant="outline" size="sm" className="h-8" onClick={onAssign ?? (() => toast.info("Assign owner"))}>
        <UserCog className="mr-1 h-3.5 w-3.5" aria-hidden />
        Assign
      </Button>
      <Button type="button" variant="outline" size="sm" className="h-8" onClick={onTag ?? (() => toast.info("Add tag"))}>
        <Tag className="mr-1 h-3.5 w-3.5" aria-hidden />
        Tag
      </Button>
      <Button type="button" variant="outline" size="sm" className="h-8" onClick={onExport ?? (() => toast.success("Export selected"))}>
        <Download className="mr-1 h-3.5 w-3.5" aria-hidden />
        Export
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 text-destructive hover:text-destructive"
        onClick={onDelete ?? (() => toast.error("Delete — confirm in production"))}
      >
        <Trash2 className="mr-1 h-3.5 w-3.5" aria-hidden />
        Delete
      </Button>
      <Button type="button" variant="ghost" size="sm" className="ml-auto h-8" onClick={onClear} aria-label="Clear selection">
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

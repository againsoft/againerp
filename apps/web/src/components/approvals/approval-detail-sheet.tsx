"use client";

import type { ApprovalDetail } from "@/lib/mock-data/approval-center";
import { ApprovalDetailContent } from "@/components/approvals/approval-detail-content";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approval: ApprovalDetail | null;
};

/** DRW-APR-001 — Approval detail drawer (896px) */
export function ApprovalDetailSheet({ open, onOpenChange, approval }: Props) {
  if (!approval) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl [&>button.absolute]:hidden"
        aria-describedby={undefined}
      >
        <p className="sr-only">Approval details · {approval.requestId}</p>
        <ApprovalDetailContent approval={approval} onClose={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}

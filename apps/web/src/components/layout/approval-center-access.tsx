"use client";

import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApprovalCenterAccess() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 shrink-0"
      asChild
      title="Approval center"
    >
      <Link href="/inbox/approvals?status=pending" aria-label="Approval center">
        <ClipboardCheck className="h-4 w-4" aria-hidden />
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-0.5 text-[10px] font-medium text-white">
          5
        </span>
      </Link>
    </Button>
  );
}

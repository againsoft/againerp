"use client";

import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";
import { VENDOR_DIRECTORY_HREF } from "@/lib/mock-data/business-partners";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  compact?: boolean;
  partnerHref?: string;
  partnerLabel?: string;
};

export function VendorMigrationBanner({
  className,
  compact,
  partnerHref,
  partnerLabel,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-lg border border-violet-200 bg-violet-50/50 text-xs dark:border-violet-900/50 dark:bg-violet-950/20",
        compact ? "px-3 py-2" : "px-4 py-3",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <Handshake className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
          <div>
            <p className="font-medium text-foreground">Vendor master moved to Business Partners</p>
            <p className="mt-0.5 text-muted-foreground">
              Directory, roles, tiers, and catalog live under{" "}
              <strong>Business Partners</strong>. PO, RFQ, receipts, and bills stay here.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          <Button size="sm" variant="outline" className="h-7 text-[10px]" asChild>
            <Link href={VENDOR_DIRECTORY_HREF}>
              Vendor directory <ArrowRight className="ml-0.5 h-3 w-3" />
            </Link>
          </Button>
          {partnerHref && (
            <Button size="sm" className="h-7 text-[10px]" asChild>
              <Link href={partnerHref}>{partnerLabel ?? "Open partner"}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

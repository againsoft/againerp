"use client";

import Link from "next/link";
import { TopNavigation } from "@/components/navigation/top-navigation";

/** WS-HEADER-* — Zone A global header (56px). */
export function WorkspaceHeader() {
  return (
    <div data-zone="A" data-component="WS-HEADER">
      <TopNavigation
        leading={
          <Link
            href="/home"
            className="shrink-0 text-sm font-semibold tracking-tight text-foreground lg:hidden"
          >
            AgainERP
          </Link>
        }
      />
    </div>
  );
}

"use client";

import { Suspense } from "react";
import { Search, Tag } from "lucide-react";
import { MetaManager } from "@/components/seo/meta-manager";

function MetaManagerContent() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › SEO › Meta Manager</p>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-emerald-600" />
            <h1 className="page-title">Meta Manager</h1>
          </div>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
            Manage SEO meta tags, OG images, and schema types for all storefront pages from one place.
          </p>
        </div>
      </div>
      <MetaManager />
    </div>
  );
}

export default function MetaManagerPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading…</p>}>
        <MetaManagerContent />
      </Suspense>
    </div>
  );
}

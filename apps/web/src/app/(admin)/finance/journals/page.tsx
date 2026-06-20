"use client";

import { Suspense } from "react";
import { FileText } from "lucide-react";
import { JournalEntries } from "@/components/finance/journal-entries";

function Content() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="shrink-0">
        <p className="page-subtitle">AgainERP › Finance › Journal Entries</p>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h1 className="page-title">Journal Entries</h1>
        </div>
        <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
          Double-entry journal — draft, post, and reverse entries with full line detail.
        </p>
      </div>
      <JournalEntries />
    </div>
  );
}

export default function JournalsPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading…</p>}>
        <Content />
      </Suspense>
    </div>
  );
}

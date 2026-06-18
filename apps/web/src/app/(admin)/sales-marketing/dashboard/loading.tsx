import { SmwPageShell } from "@/components/sales-marketing/smw-page-shell";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={className ?? "h-4 animate-pulse rounded bg-muted"} />;
}

/** Dashboard route loading skeleton — independent widget placeholders */
export default function SmwDashboardLoading() {
  return (
    <SmwPageShell hideHeader>
      <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading dashboard">
        <div className="space-y-2">
          <SkeletonBlock className="h-7 w-48 animate-pulse rounded bg-muted" />
          <SkeletonBlock className="h-3 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-3 overflow-hidden lg:grid lg:grid-cols-4 xl:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-24 min-w-[9.5rem] shrink-0 animate-pulse rounded-lg bg-muted lg:min-w-0" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-12">
          <SkeletonBlock className="h-72 animate-pulse rounded-lg bg-muted lg:col-span-8" />
          <SkeletonBlock className="h-72 animate-pulse rounded-lg bg-muted lg:col-span-4" />
        </div>
        <div className="grid gap-4 lg:grid-cols-12">
          <SkeletonBlock className="h-80 animate-pulse rounded-lg bg-muted lg:col-span-7" />
          <SkeletonBlock className="h-80 animate-pulse rounded-lg bg-muted lg:col-span-5" />
        </div>
      </div>
    </SmwPageShell>
  );
}

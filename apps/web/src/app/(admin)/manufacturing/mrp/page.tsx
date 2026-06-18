"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { MrpGrid } from "@/components/manufacturing/mrp-grid";
import { MrpViewDialog } from "@/components/manufacturing/mrp-view-dialog";
import { ManufacturingListShell } from "@/components/manufacturing/manufacturing-page-shell";
import { Button } from "@/components/ui/button";
import {
  buildMrpRunDraft,
  getMrpRunById,
  mrpRunsSeed,
  type MrpRun,
} from "@/lib/mock-data/manufacturing-mrp";
import { useManufacturingMrpStore } from "@/lib/store/manufacturing-mrp-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/manufacturing/mrp?${query}` : "/manufacturing/mrp";
}

function MrpListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeRuns = useManufacturingMrpStore((s) => s.runs);
  const addRun = useManufacturingMrpStore((s) => s.addRun);

  const viewId = searchParams.get("view");

  const resolveRun = (id: string | null) => {
    if (!id) return null;
    return storeRuns.find((r) => r.id === id) ?? getMrpRunById(id) ?? null;
  };

  const viewRun = useMemo(() => resolveRun(viewId), [viewId, storeRuns]);

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  const handleView = (run: MrpRun) => {
    pushParams((params) => {
      params.set("view", run.id);
    });
  };

  const closeView = () => {
    pushParams((params) => {
      params.delete("view");
    });
  };

  const handleNewRun = () => {
    const draft = buildMrpRunDraft({
      warehouse: "WH-DHK",
      horizonDays: 30,
      notes: "New planning run — configure sources then Run MRP.",
    });
    addRun(draft);
    toast.success("Draft MRP run created");
    handleView(draft);
  };

  useEffect(() => {
    if (viewId && !viewRun) {
      toast.error("MRP run not found");
      closeView();
    }
  }, [viewId, viewRun]);

  const count = storeRuns.length || mrpRunsSeed.length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{count} MRP runs</p>
        <Button size="sm" className="h-8" onClick={handleNewRun}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> New MRP run
        </Button>
      </div>

      <MrpGrid className="min-h-0 flex-1" onView={handleView} />

      <MrpViewDialog
        open={!!viewRun}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        run={viewRun}
      />
    </>
  );
}

export default function ManufacturingMrpPage() {
  return (
    <ManufacturingListShell
      title="MRP"
      subtitle="Material requirements planning — demand থেকে work order ও purchase request proposal।"
    >
      <Suspense
        fallback={
          <p className="flex flex-1 items-center text-sm text-muted-foreground">Loading MRP runs…</p>
        }
      >
        <MrpListContent />
      </Suspense>
    </ManufacturingListShell>
  );
}

"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PartnersListShell } from "@/components/partners/partners-page-shell";
import { TerritoryFormDialog } from "@/components/partners/territory-form-dialog";
import { TerritoryGrid } from "@/components/partners/territory-grid";
import { TerritoryViewDialog } from "@/components/partners/territory-view-dialog";
import { Button } from "@/components/ui/button";
import {
  getTerritoryById,
  partnerTerritoriesSeed,
  type PartnerTerritoryAssignment,
} from "@/lib/mock-data/business-partner-territories";
import { useBusinessPartnerTerritoryStore } from "@/lib/store/business-partner-territory-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/partners/territories?${query}` : "/partners/territories";
}

function TerritoriesListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeRows = useBusinessPartnerTerritoryStore((s) => s.territories);

  const createOpen = searchParams.get("create") === "1";
  const viewId = searchParams.get("view");
  const regionFilter = searchParams.get("region") ?? "all";

  const resolveRow = (id: string | null) => {
    if (!id) return null;
    return storeRows.find((t) => t.id === id) ?? getTerritoryById(id) ?? null;
  };

  const viewRow = useMemo(() => resolveRow(viewId), [viewId, storeRows]);

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  const handleView = (row: PartnerTerritoryAssignment) => {
    pushParams((params) => {
      params.set("view", row.id);
    });
  };

  const openCreate = () => {
    pushParams((params) => {
      params.delete("view");
      params.set("create", "1");
    });
  };

  const closeForm = () => {
    pushParams((params) => {
      params.delete("create");
    });
  };

  const closeView = () => {
    pushParams((params) => {
      params.delete("view");
    });
  };

  useEffect(() => {
    if (viewId && !viewRow) {
      toast.error("Territory not found");
      closeView();
    }
  }, [viewId, viewRow]);

  const count = storeRows.length || partnerTerritoriesSeed.length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{count} territory assignments</p>
        <Button size="sm" className="h-8" onClick={openCreate}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Assign territory
        </Button>
      </div>

      <TerritoryGrid className="min-h-0 flex-1" initialRegion={regionFilter} onView={handleView} />

      <TerritoryViewDialog
        open={!!viewRow && !createOpen}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        territory={viewRow}
      />

      <TerritoryFormDialog
        open={createOpen}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
      />
    </>
  );
}

export default function PartnersTerritoriesPage() {
  return (
    <PartnersListShell
      title="Territories"
      subtitle="Regional coverage and exclusivity by partner role — map stub for future geo views."
    >
      <Suspense
        fallback={
          <p className="flex flex-1 items-center text-sm text-muted-foreground">Loading territories…</p>
        }
      >
        <TerritoriesListContent />
      </Suspense>
    </PartnersListShell>
  );
}

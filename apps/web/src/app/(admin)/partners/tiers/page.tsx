"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { TierFormDialog } from "@/components/partners/tier-form-dialog";
import { TierGrid } from "@/components/partners/tier-grid";
import { TierViewDialog } from "@/components/partners/tier-view-dialog";
import { PartnersListShell } from "@/components/partners/partners-page-shell";
import { Button } from "@/components/ui/button";
import {
  getTierById,
  partnerTiersSeed,
  type PartnerTierDefinition,
} from "@/lib/mock-data/business-partner-tiers";
import { useBusinessPartnerTierStore } from "@/lib/store/business-partner-tier-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/partners/tiers?${query}` : "/partners/tiers";
}

function TiersListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeTiers = useBusinessPartnerTierStore((s) => s.tiers);

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const typeFilter = searchParams.get("type") ?? "all";

  const resolveTier = (id: string | null) => {
    if (!id) return null;
    return storeTiers.find((t) => t.id === id) ?? getTierById(id) ?? null;
  };

  const editTier = useMemo(() => resolveTier(editId), [editId, storeTiers]);
  const viewTier = useMemo(() => resolveTier(viewId), [viewId, storeTiers]);

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  const openCreate = () => {
    pushParams((params) => {
      params.delete("edit");
      params.delete("view");
      params.set("create", "1");
    });
  };

  const handleEdit = (tier: PartnerTierDefinition) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("view");
      params.set("edit", tier.id);
    });
  };

  const handleView = (tier: PartnerTierDefinition) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", tier.id);
    });
  };

  const closeForm = () => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
    });
  };

  const closeView = () => {
    pushParams((params) => {
      params.delete("view");
    });
  };

  const handleSaved = (tier: PartnerTierDefinition) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", tier.id);
    });
  };

  useEffect(() => {
    if (editId && !editTier) {
      toast.error("Tier not found");
      closeForm();
    }
  }, [editId, editTier]);

  useEffect(() => {
    if (viewId && !viewTier && !editId && !createOpen) {
      toast.error("Tier not found");
      closeView();
    }
  }, [viewId, viewTier, editId, createOpen]);

  const count = storeTiers.length || partnerTiersSeed.length;
  const activeCount = storeTiers.filter((t) => t.active).length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {count} tiers · {activeCount} active
        </p>
        <Button size="sm" className="h-8" onClick={openCreate}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> New tier
        </Button>
      </div>

      <TierGrid
        className="min-h-0 flex-1"
        initialType={typeFilter}
        onView={handleView}
        onEdit={handleEdit}
      />

      <TierViewDialog
        open={!!viewTier && !createOpen && !editTier}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        tier={viewTier}
        onEdit={handleEdit}
      />

      <TierFormDialog
        open={createOpen || !!editTier}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
        mode={createOpen ? "create" : "edit"}
        tier={editTier}
        onSaved={handleSaved}
      />
    </>
  );
}

export default function PartnersTiersPage() {
  return (
    <PartnersListShell
      title="Price tiers"
      subtitle="Wholesale, retail, and dealer tiers — assign to partners for channel pricing."
    >
      <Suspense
        fallback={
          <p className="flex flex-1 items-center text-sm text-muted-foreground">Loading tiers…</p>
        }
      >
        <TiersListContent />
      </Suspense>
    </PartnersListShell>
  );
}

"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PartnerGrid } from "@/components/partners/partner-grid";
import { PartnerFormDialog } from "@/components/partners/partner-form-dialog";
import { PartnerViewDialog } from "@/components/partners/partner-view-dialog";
import { PartnersListShell } from "@/components/partners/partners-page-shell";
import { Button } from "@/components/ui/button";
import {
  businessPartnersSeed,
  getPartnerById,
  type BusinessPartner,
} from "@/lib/mock-data/business-partners";
import { useBusinessPartnerStore } from "@/lib/store/business-partner-store";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/partners/directory?${query}` : "/partners/directory";
}

function PartnerDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storePartners = useBusinessPartnerStore((s) => s.partners);

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const roleFilter = searchParams.get("role") ?? "all";
  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam === "territories" ||
    tabParam === "roles" ||
    tabParam === "terms" ||
    tabParam === "tiers" ||
    tabParam === "profile"
      ? tabParam
      : undefined;

  const resolvePartner = (id: string | null) => {
    if (!id) return null;
    return storePartners.find((p) => p.id === id) ?? getPartnerById(id) ?? null;
  };

  const editPartner = useMemo(() => resolvePartner(editId), [editId, storePartners]);
  const viewPartner = useMemo(() => resolvePartner(viewId), [viewId, storePartners]);

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

  const handleEdit = (partner: BusinessPartner) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("view");
      params.set("edit", partner.id);
    });
  };

  const handleView = (partner: BusinessPartner) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", partner.id);
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

  const handleSaved = (partner: BusinessPartner) => {
    pushParams((params) => {
      params.delete("create");
      params.delete("edit");
      params.set("view", partner.id);
    });
  };

  useEffect(() => {
    if (editId && !editPartner) {
      toast.error("Partner not found");
      closeForm();
    }
  }, [editId, editPartner]);

  useEffect(() => {
    if (viewId && !viewPartner && !editId && !createOpen) {
      toast.error("Partner not found");
      closeView();
    }
  }, [viewId, viewPartner, editId, createOpen]);

  const count = storePartners.length || businessPartnersSeed.length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{count} partners</p>
        <Button size="sm" className="h-8" onClick={openCreate}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> New partner
        </Button>
      </div>

      <PartnerGrid
        className="min-h-0 flex-1"
        initialRole={roleFilter}
        onView={handleView}
        onEdit={handleEdit}
      />

      <PartnerViewDialog
        open={!!viewPartner && !createOpen && !editPartner}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        partner={viewPartner}
        initialTab={initialTab}
        onEdit={handleEdit}
      />

      <PartnerFormDialog
        open={createOpen || !!editPartner}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
        mode={createOpen ? "create" : "edit"}
        partner={editPartner}
        onSaved={handleSaved}
      />
    </>
  );
}

export default function PartnerDirectoryPage() {
  return (
    <PartnersListShell
      title="Partner directory"
      subtitle="Vendors, retailers, wholesalers, and channel partners — filter by role and open drawers to view or edit."
    >
      <Suspense
        fallback={
          <p className="flex flex-1 items-center text-sm text-muted-foreground">Loading partners…</p>
        }
      >
        <PartnerDirectoryContent />
      </Suspense>
    </PartnersListShell>
  );
}

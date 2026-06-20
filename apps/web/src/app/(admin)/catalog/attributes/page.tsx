"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAttributeProfileStore } from "@/lib/store/attribute-profile-store";
import { Button } from "@/components/ui/button";
import { AttributeProfileGrid } from "@/components/attributes/attribute-profile-grid";
import { AttributeProfileFormDialog } from "@/components/attributes/attribute-profile-form-dialog";
import { AttributeProfileViewSheet } from "@/components/attributes/attribute-profile-view-sheet";
import type { AttributeProfile } from "@/lib/mock-data/attribute-profiles";

function buildUrl(params: URLSearchParams) {
  const q = params.toString();
  return q ? `/catalog/attributes?${q}` : "/catalog/attributes";
}

function AttributeListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const profiles = useAttributeProfileStore((s) => s.profiles);
  const upsertProfile = useAttributeProfileStore((s) => s.upsertProfile);

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");

  const editProfile = useMemo(
    () => (editId ? profiles.find((p) => p.id === editId) ?? null : null),
    [editId, profiles],
  );
  const viewProfile = useMemo(
    () => (viewId ? profiles.find((p) => p.id === viewId) ?? null : null),
    [viewId, profiles],
  );

  const pushParams = (mutate: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(searchParams.toString());
    mutate(p);
    router.push(buildUrl(p), { scroll: false });
  };

  const openCreate = () =>
    pushParams((p) => {
      p.delete("edit");
      p.delete("view");
      p.set("create", "1");
    });

  const handleEdit = (profile: AttributeProfile) =>
    pushParams((p) => {
      p.delete("create");
      p.delete("view");
      p.set("edit", profile.id);
    });

  const handleView = (profile: AttributeProfile) =>
    pushParams((p) => {
      p.delete("create");
      p.delete("edit");
      p.set("view", profile.id);
    });

  const closeForm = () =>
    pushParams((p) => {
      p.delete("create");
      p.delete("edit");
    });

  const closeView = () =>
    pushParams((p) => p.delete("view"));

  useEffect(() => {
    if (editId && !editProfile && profiles.length > 0) {
      toast.error("Profile not found");
      closeForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, editProfile, profiles.length]);

  useEffect(() => {
    if (viewId && !viewProfile && !editId && !createOpen && profiles.length > 0) {
      toast.error("Profile not found");
      closeView();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewId, viewProfile, editId, createOpen, profiles.length]);

  const handleSave = (data: Partial<AttributeProfile>) => {
    if (createOpen) {
      upsertProfile(data);
    } else if (editProfile) {
      upsertProfile({ id: editProfile.id, ...data });
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Ecommerce › Catalog › Attributes</p>
          <h1 className="page-title">
            Attributes
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({profiles.length.toLocaleString()})
            </span>
          </h1>

        </div>
        <div className="hidden gap-2 sm:flex">
          <Button variant="outline" size="sm" onClick={() => toast.info("Import — prototype")}>
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Export started (mock)")}
          >
            Export
          </Button>
          <Button size="sm" onClick={openCreate}>
            + Add Profile
          </Button>
        </div>
      </div>

      <AttributeProfileGrid
        className="min-h-0 flex-1"
        onView={handleView}
        onEdit={handleEdit}
      />

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="Add attribute profile"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <AttributeProfileViewSheet
        open={!!viewProfile && !createOpen && !editProfile}
        onOpenChange={(open) => {
          if (!open) closeView();
        }}
        profile={viewProfile}
        onEdit={handleEdit}
      />

      <AttributeProfileFormDialog
        open={createOpen || !!editProfile}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
        mode={createOpen ? "create" : "edit"}
        profile={editProfile}
        onSave={handleSave}
      />
    </div>
  );
}

export default function AttributesPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense
        fallback={
          <p className="flex flex-1 items-center text-sm text-muted-foreground">
            Loading attributes…
          </p>
        }
      >
        <AttributeListContent />
      </Suspense>
    </div>
  );
}

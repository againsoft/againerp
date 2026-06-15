"use client";

import { AttributeMegashopList, AttributeMegashopListHeaderActions } from "@/components/attributes/attribute-megashop-list";
import { useAttributeProfileStore } from "@/lib/store/attribute-profile-store";

export default function AttributesPage() {
  const count = useAttributeProfileStore((s) => s.profiles.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Catalog › Attributes</p>
          <h1 className="page-title">
            Attributes
            <span className="ml-2 text-base font-normal text-muted-foreground">({count})</span>
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Step 1: Create profile → Step 2: Add groups → Add attributes under each group
          </p>
        </div>
        <AttributeMegashopListHeaderActions />
      </div>

      <AttributeMegashopList />
    </div>
  );
}

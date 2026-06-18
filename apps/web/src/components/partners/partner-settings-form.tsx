"use client";

import { useState } from "react";
import { useBusinessPartnerSettingsStore } from "@/lib/store/business-partner-settings-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PartnersNav } from "@/components/partners/partners-nav";

export function PartnerSettingsForm() {
  const settings = useBusinessPartnerSettingsStore((s) => s.settings);
  const patchSettings = useBusinessPartnerSettingsStore((s) => s.patchSettings);

  const [prefix, setPrefix] = useState(settings.partnerCodePrefix);
  const [nextSeq, setNextSeq] = useState(String(settings.nextPartnerSequence));
  const [vendorTerms, setVendorTerms] = useState(settings.defaultVendorPaymentTerms);
  const [vendorDays, setVendorDays] = useState(String(settings.defaultVendorPaymentDays));

  const save = () => {
    patchSettings({
      partnerCodePrefix: prefix.trim() || "BP-",
      nextPartnerSequence: Number(nextSeq) || settings.nextPartnerSequence,
      defaultVendorPaymentTerms: vendorTerms,
      defaultVendorPaymentDays: Number(vendorDays) || 30,
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <PartnersNav />

      <div className="mx-auto w-full max-w-2xl space-y-6">
        <section className="space-y-3 rounded-lg border border-input p-4">
          <h2 className="text-sm font-semibold">Numbering</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="bp-prefix">Partner code prefix</Label>
              <Input id="bp-prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bp-seq">Next sequence</Label>
              <Input id="bp-seq" type="number" value={nextSeq} onChange={(e) => setNextSeq(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-lg border border-input p-4">
          <h2 className="text-sm font-semibold">Defaults</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="bp-vendor-terms">Vendor payment terms</Label>
              <Input id="bp-vendor-terms" value={vendorTerms} onChange={(e) => setVendorTerms(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bp-vendor-days">Payment days</Label>
              <Input id="bp-vendor-days" type="number" value={vendorDays} onChange={(e) => setVendorDays(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="space-y-2 rounded-lg border border-input p-4">
          <h2 className="text-sm font-semibold">Workflow</h2>
          <Switch
            label="Onboarding requires approval"
            checked={settings.onboardingRequiresApproval}
            onCheckedChange={(v) => patchSettings({ onboardingRequiresApproval: v })}
          />
          <Switch
            label="Credit check on sales orders"
            checked={settings.creditCheckOnSalesOrder}
            onCheckedChange={(v) => patchSettings({ creditCheckOnSalesOrder: v })}
          />
          <Switch
            label="Auto-assign account manager"
            checked={settings.autoAssignAccountManager}
            onCheckedChange={(v) => patchSettings({ autoAssignAccountManager: v })}
          />
          <Switch
            label="Allow multi-role partners"
            checked={settings.allowMultiRolePartners}
            onCheckedChange={(v) => patchSettings({ allowMultiRolePartners: v })}
          />
          <Switch
            label="Sync vendor catalog on onboarding approve"
            description="Pull supplier feed SKUs when vendor application is approved."
            checked={settings.syncVendorCatalogOnApprove}
            onCheckedChange={(v) => patchSettings({ syncVendorCatalogOnApprove: v })}
          />
        </section>

        <Button size="sm" className="h-8" onClick={save}>
          Save numbering & defaults
        </Button>
      </div>
    </div>
  );
}

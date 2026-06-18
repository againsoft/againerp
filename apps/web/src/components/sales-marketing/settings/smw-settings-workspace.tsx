"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { SmwSettingsNav } from "@/components/sales-marketing/settings/smw-settings-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LEAD_SOURCE_LABELS, SMW_LEAD_TERRITORIES, type LeadSource } from "@/lib/mock-data/smw-leads";
import { OPPORTUNITY_STAGES, STAGE_LABELS, type OpportunityStage } from "@/lib/mock-data/smw-opportunities";
import {
  SMW_FISCAL_MONTHS,
  SMW_QUOTATION_TEMPLATES,
  SMW_SETTINGS_SECTIONS,
  type SmwSettingsSection,
} from "@/lib/mock-data/smw-settings";
import { useSmwSettingsStore } from "@/lib/store/smw-settings-store";

function isSection(value: string | null): SmwSettingsSection {
  if (value === "pipeline" || value === "leads" || value === "quotations") return value;
  return "general";
}

function SmwSettingsContent() {
  const searchParams = useSearchParams();
  const section = isSection(searchParams.get("section"));
  const settings = useSmwSettingsStore((s) => s.settings);
  const patchSettings = useSmwSettingsStore((s) => s.patchSettings);
  const resetSettings = useSmwSettingsStore((s) => s.resetSettings);

  const sectionMeta = SMW_SETTINGS_SECTIONS.find((s) => s.id === section)!;

  const save = () => toast.success("Settings saved");

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <SmwSettingsNav active={section} />

      <div>
        <h2 className="text-sm font-semibold">{sectionMeta.label}</h2>
        <p className="text-xs text-muted-foreground">{sectionMeta.description}</p>
      </div>

      {section === "general" && (
        <GeneralSection settings={settings} patch={patchSettings} />
      )}
      {section === "pipeline" && (
        <PipelineSection settings={settings} patch={patchSettings} />
      )}
      {section === "leads" && (
        <LeadsSection settings={settings} patch={patchSettings} />
      )}
      {section === "quotations" && (
        <QuotationsSection settings={settings} patch={patchSettings} />
      )}

      <div className="flex flex-wrap gap-2 border-t border-input pt-4">
        <Button type="button" size="sm" className="h-8" onClick={save}>Save settings</Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => { resetSettings(); toast.info("Settings reset to defaults"); }}
        >
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}

function GeneralSection({
  settings,
  patch,
}: {
  settings: ReturnType<typeof useSmwSettingsStore.getState>["settings"];
  patch: (p: Partial<typeof settings>) => void;
}) {
  return (
    <>
      <SettingsCard title="Territory & fiscal">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Default territory">
            <Select value={settings.defaultTerritoryId} className="h-9 w-full" onChange={(e) => patch({ defaultTerritoryId: e.target.value })}>
              {SMW_LEAD_TERRITORIES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Fiscal year starts">
            <Select value={String(settings.fiscalYearStartMonth)} className="h-9 w-full" onChange={(e) => patch({ fiscalYearStartMonth: Number(e.target.value) })}>
              {SMW_FISCAL_MONTHS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </Select>
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard title="AI & automation">
        <Switch label="Enable AI Copilot" checked={settings.enableAiCopilot} onCheckedChange={(v) => patch({ enableAiCopilot: v })} />
        <Switch label="AI deal scoring on opportunities" checked={settings.enableAiDealScoring} onCheckedChange={(v) => patch({ enableAiDealScoring: v })} />
        <Switch label="Auto-calculate commission on deal close" checked={settings.enableCommissionAutoCalc} onCheckedChange={(v) => patch({ enableCommissionAutoCalc: v })} />
        <Field label="Default commission rate (%)">
          <Input type="number" min={0} max={100} className="h-9 max-w-[120px]" value={settings.defaultCommissionRate} onChange={(e) => patch({ defaultCommissionRate: Number(e.target.value) || 0 })} />
        </Field>
      </SettingsCard>

      <SettingsCard title="Approvals">
        <Field label="Manager approval required for discount above (%)">
          <Input type="number" min={0} max={100} className="h-9 max-w-[120px]" value={settings.requireManagerApprovalAbove} onChange={(e) => patch({ requireManagerApprovalAbove: Number(e.target.value) || 0 })} />
        </Field>
      </SettingsCard>
    </>
  );
}

function PipelineSection({
  settings,
  patch,
}: {
  settings: ReturnType<typeof useSmwSettingsStore.getState>["settings"];
  patch: (p: Partial<typeof settings>) => void;
}) {
  const updateStageProb = (stage: OpportunityStage, value: number) => {
    patch({ stageProbabilities: { ...settings.stageProbabilities, [stage]: value } });
  };

  return (
    <>
      <SettingsCard title="Opportunity numbering">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Number prefix">
            <Input className="h-9 font-mono" value={settings.opportunityNumberPrefix} onChange={(e) => patch({ opportunityNumberPrefix: e.target.value })} />
          </Field>
          <Field label="Next sequence">
            <Input type="number" className="h-9" value={settings.nextOpportunitySequence} onChange={(e) => patch({ nextOpportunitySequence: Number(e.target.value) || 0 })} />
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard title="Pipeline stages">
        <p className="mb-3 text-xs text-muted-foreground">Default win probability used for weighted pipeline calculations.</p>
        <div className="overflow-auto rounded-md border border-input">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-9 text-xs">Stage</TableHead>
                <TableHead className="h-9 text-xs">Probability (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OPPORTUNITY_STAGES.filter((s) => s.id !== "won" && s.id !== "lost").map((stage) => (
                <TableRow key={stage.id}>
                  <TableCell className="py-2 text-xs">{STAGE_LABELS[stage.id]}</TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      className="h-8 w-20 text-xs"
                      value={settings.stageProbabilities[stage.id]}
                      onChange={(e) => updateStageProb(stage.id, Number(e.target.value) || 0)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SettingsCard>
    </>
  );
}

function LeadsSection({
  settings,
  patch,
}: {
  settings: ReturnType<typeof useSmwSettingsStore.getState>["settings"];
  patch: (p: Partial<typeof settings>) => void;
}) {
  const toggleSource = (source: LeadSource) => {
    const enabled = settings.enabledLeadSources.includes(source)
      ? settings.enabledLeadSources.filter((s) => s !== source)
      : [...settings.enabledLeadSources, source];
    patch({ enabledLeadSources: enabled });
  };

  return (
    <>
      <SettingsCard title="Lead numbering">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Number prefix">
            <Input className="h-9 font-mono" value={settings.leadNumberPrefix} onChange={(e) => patch({ leadNumberPrefix: e.target.value })} />
          </Field>
          <Field label="Next sequence">
            <Input type="number" className="h-9" value={settings.nextLeadSequence} onChange={(e) => patch({ nextLeadSequence: Number(e.target.value) || 0 })} />
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard title="Assignment">
        <Switch label="Auto-assign inbound website leads" checked={settings.autoAssignInboundLeads} onCheckedChange={(v) => patch({ autoAssignInboundLeads: v })} />
      </SettingsCard>

      <SettingsCard title="Lead sources">
        <p className="mb-3 text-xs text-muted-foreground">Enabled sources appear in lead forms and filters.</p>
        <ul className="space-y-2">
          {(Object.keys(LEAD_SOURCE_LABELS) as LeadSource[]).map((source) => (
            <li key={source}>
              <Switch
                label={LEAD_SOURCE_LABELS[source]}
                checked={settings.enabledLeadSources.includes(source)}
                onCheckedChange={() => toggleSource(source)}
              />
            </li>
          ))}
        </ul>
      </SettingsCard>
    </>
  );
}

function QuotationsSection({
  settings,
  patch,
}: {
  settings: ReturnType<typeof useSmwSettingsStore.getState>["settings"];
  patch: (p: Partial<typeof settings>) => void;
}) {
  return (
    <>
      <SettingsCard title="Quotation numbering">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Number prefix">
            <Input className="h-9 font-mono" value={settings.quotationNumberPrefix} onChange={(e) => patch({ quotationNumberPrefix: e.target.value })} />
          </Field>
          <Field label="Next sequence">
            <Input type="number" className="h-9" value={settings.nextQuotationSequence} onChange={(e) => patch({ nextQuotationSequence: Number(e.target.value) || 0 })} />
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard title="Defaults">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Default validity (days)">
            <Input type="number" min={1} className="h-9" value={settings.defaultQuoteValidityDays} onChange={(e) => patch({ defaultQuoteValidityDays: Number(e.target.value) || 30 })} />
          </Field>
          <Field label="Default template">
            <Select value={settings.defaultQuotationTemplate} className="h-9 w-full" onChange={(e) => patch({ defaultQuotationTemplate: e.target.value })}>
              {SMW_QUOTATION_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
          </Field>
        </div>
      </SettingsCard>
    </>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-lg border border-input p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

export function SmwSettingsWorkspace() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading settings…</p>}>
      <SmwSettingsContent />
    </Suspense>
  );
}

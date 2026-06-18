"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Send, ShoppingCart, X } from "lucide-react";
import {
  PARTNER_ROLE_LABELS,
  PARTNER_STATUS_LABELS,
  formatPartnerMoney,
  type BusinessPartner,
  type PartnerRole,
} from "@/lib/mock-data/business-partners";
import { partnerHasVendorCatalog } from "@/lib/mock-data/business-partner-catalog";
import {
  TIER_TYPE_LABELS,
  tierTypesForPartnerRoles,
} from "@/lib/mock-data/business-partner-tiers";
import {
  tierTypeBadgeVariant,
  useBusinessPartnerTierStore,
} from "@/lib/store/business-partner-tier-store";
import {
  partnerRoleBadgeVariant,
  partnerStatusBadgeVariant,
  useBusinessPartnerStore,
} from "@/lib/store/business-partner-store";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  navigateCreatePoFromPartner,
  stubCreateSoFromPartner,
  usePartnerCatalog,
} from "@/lib/store/business-partner-catalog-store";
import { useBusinessPartnerTerritoryStore } from "@/lib/store/business-partner-territory-store";
import { ActivityTriggerButton } from "@/components/activity/activity-trigger-button";
import { PartnerCatalogTab } from "@/components/partners/partner-catalog-tab";

type Tab = "overview" | "roles" | "terms" | "tiers" | "territories" | "catalog" | "profile";

type Props = {
  partner: BusinessPartner;
  inDialog?: boolean;
  initialTab?: Tab;
  onEdit?: (partner: BusinessPartner) => void;
  onClose?: () => void;
};

const ALL_ROLES = Object.keys(PARTNER_ROLE_LABELS) as PartnerRole[];

export function PartnerDetailContent({ partner, inDialog, initialTab, onEdit, onClose }: Props) {
  const router = useRouter();
  const live = useBusinessPartnerStore((s) => s.getById(partner.id)) ?? partner;
  const toggleRole = useBusinessPartnerStore((s) => s.toggleRole);
  const patchPartner = useBusinessPartnerStore((s) => s.patchPartner);
  const allTiers = useBusinessPartnerTierStore((s) => s.tiers);
  const allTerritories = useBusinessPartnerTerritoryStore((s) => s.territories);
  const [tab, setTab] = useState<Tab>(initialTab ?? "overview");

  const vendorTerms = useMemo(
    () => live.terms.find((t) => t.role === "vendor"),
    [live.terms],
  );

  const compatibleTiers = useMemo(() => {
    const types = tierTypesForPartnerRoles(live.roles);
    if (types.length === 0) return allTiers.filter((t) => t.active);
    return allTiers.filter((t) => t.active && types.includes(t.tierType));
  }, [allTiers, live.roles]);

  const assignedTier = useMemo(
    () => allTiers.find((t) => t.code === live.tierCode),
    [allTiers, live.tierCode],
  );

  const showCatalog = partnerHasVendorCatalog(live);
  const { summary: catalogSummary } = usePartnerCatalog(showCatalog ? live : null);

  const partnerTerritories = useMemo(
    () => allTerritories.filter((t) => t.partnerId === live.id),
    [allTerritories, live.id],
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "roles", label: "Roles" },
    { id: "terms", label: "Terms" },
    { id: "tiers", label: "Tiers" },
    { id: "territories", label: "Territories" },
    ...(showCatalog ? [{ id: "catalog" as const, label: "Catalog" }] : []),
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", inDialog && "h-full")}>
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-2 border-b border-input pb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">{live.name}</h2>
            <Badge variant={partnerStatusBadgeVariant(live.status)} className="text-[10px] capitalize">
              {PARTNER_STATUS_LABELS[live.status]}
            </Badge>
            {live.creditHold && (
              <Badge variant="warning" className="text-[10px]">
                Credit hold
              </Badge>
            )}
          </div>
          <p className="font-mono text-[11px] text-muted-foreground">
            {live.partnerCode} · {live.territory} · {live.country}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {live.roles.includes("vendor") && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px]"
              onClick={() => {
                const href = navigateCreatePoFromPartner(live);
                if (href) router.push(href);
              }}
            >
              <Send className="mr-1 h-3 w-3" /> Create PO
            </Button>
          )}
          {(live.roles.includes("wholesaler") || live.roles.includes("retailer")) && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px]"
              onClick={() => stubCreateSoFromPartner(live)}
            >
              <ShoppingCart className="mr-1 h-3 w-3" /> Create SO
            </Button>
          )}
          {onEdit && (
            <Button size="sm" variant="secondary" className="h-7 text-[10px]" onClick={() => onEdit(live)}>
              <Pencil className="mr-1 h-3 w-3" /> Edit
            </Button>
          )}
          <ActivityTriggerButton
            entity={{
              type: "business_partner",
              id: live.id,
              label: live.name,
              subtitle: live.partnerCode,
            }}
            className="h-7 w-7"
          />
          {onClose && (
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-2 flex shrink-0 gap-1 overflow-x-auto border-b border-input pb-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 border-b-2 px-2.5 py-1.5 text-xs font-medium transition-colors",
              tab === t.id
                ? "border-violet-600 text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pt-3">
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1">
              {live.roles.map((role) => (
                <Badge key={role} variant={partnerRoleBadgeVariant(role)} className="text-[10px]">
                  {PARTNER_ROLE_LABELS[role]}
                </Badge>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Rating", value: live.rating ? `★ ${live.rating}` : "—" },
                { label: "Tier", value: live.tierCode ?? "—" },
                ...(showCatalog
                  ? [{ label: "Catalog SKUs", value: String(catalogSummary.mappedCount) }]
                  : []),
                {
                  label: "Spend YTD",
                  value: live.spendYtd > 0 ? formatPartnerMoney(live.spendYtd) : "—",
                },
                {
                  label: "Revenue YTD",
                  value: live.revenueYtd > 0 ? formatPartnerMoney(live.revenueYtd) : "—",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-md border border-input px-2.5 py-2">
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
            {live.supplierId && (
              <p className="text-xs text-muted-foreground">
                Linked supplier record:{" "}
                <Link href={`/suppliers/${live.supplierId}`} className="text-primary hover:underline">
                  {live.supplierId}
                </Link>{" "}
                (legacy full-page — migrates to this drawer)
              </p>
            )}
            {live.notes && (
              <p className="rounded-md border border-amber-200 bg-amber-50/50 px-3 py-2 text-xs dark:border-amber-900 dark:bg-amber-950/20">
                {live.notes}
              </p>
            )}
          </div>
        )}

        {tab === "roles" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Enable commercial roles for this partner. Each role unlocks terms and module integrations.
            </p>
            <ul className="space-y-2">
              {ALL_ROLES.map((role) => {
                const enabled = live.roles.includes(role);
                return (
                  <li
                    key={role}
                    className="flex items-center justify-between rounded-md border border-input px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-medium">{PARTNER_ROLE_LABELS[role]}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{role}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={enabled ? "secondary" : "outline"}
                      className="h-7 text-[10px]"
                      onClick={() => toggleRole(live.id, role, !enabled)}
                    >
                      {enabled ? "Enabled" : "Enable"}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {tab === "terms" && (
          <div className="space-y-3">
            {live.terms.length === 0 ? (
              <p className="text-xs text-muted-foreground">No terms configured.</p>
            ) : (
              live.terms.map((t) => (
                <div key={t.role} className="rounded-lg border border-input p-3 text-xs">
                  <p className="mb-2 font-medium">{PARTNER_ROLE_LABELS[t.role]} terms</p>
                  <dl className="grid gap-1 sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Payment</dt>
                      <dd>{t.paymentTerms}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Currency</dt>
                      <dd>{t.currencyCode}</dd>
                    </div>
                    {t.leadTimeDays != null && (
                      <div>
                        <dt className="text-muted-foreground">Lead time</dt>
                        <dd>{t.leadTimeDays} days</dd>
                      </div>
                    )}
                    {t.minOrderValue != null && (
                      <div>
                        <dt className="text-muted-foreground">Min order</dt>
                        <dd>{formatCurrency(t.minOrderValue)}</dd>
                      </div>
                    )}
                    {t.incoterms && (
                      <div>
                        <dt className="text-muted-foreground">Incoterms</dt>
                        <dd>{t.incoterms}</dd>
                      </div>
                    )}
                    {t.creditLimit != null && (
                      <div>
                        <dt className="text-muted-foreground">Credit limit</dt>
                        <dd>{formatCurrency(t.creditLimit)}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))
            )}
            {vendorTerms && live.roles.includes("vendor") && (
              <p className="text-[10px] text-muted-foreground">
                Purchase PO defaults pull from vendor terms. Open Catalog tab to map SKUs.
              </p>
            )}
          </div>
        )}

        {tab === "tiers" && (
          <div className="space-y-3 text-xs">
            <p className="text-muted-foreground">
              Assign a price tier for channel pricing (wholesale, retail, dealer).
            </p>

            {assignedTier ? (
              <div className="rounded-lg border border-input p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-medium">{assignedTier.code}</span>
                  <Badge variant={tierTypeBadgeVariant(assignedTier.tierType)} className="text-[10px]">
                    {TIER_TYPE_LABELS[assignedTier.tierType]}
                  </Badge>
                </div>
                <p className="mt-1 font-medium">{assignedTier.name}</p>
                <p className="text-muted-foreground">
                  {assignedTier.discountPercent}% off · {assignedTier.priceListName}
                </p>
                <Button variant="ghost" className="mt-2 h-auto p-0 text-xs text-primary" asChild>
                  <Link href={`/partners/tiers?view=${assignedTier.id}`}>View tier definition</Link>
                </Button>
              </div>
            ) : (
              <p className="rounded-md border border-dashed border-input px-3 py-2 text-muted-foreground">
                No tier assigned.
              </p>
            )}

            {compatibleTiers.length > 0 ? (
              <div className="space-y-1">
                <label htmlFor="partner-tier-select" className="text-[11px] font-medium">
                  Assign tier
                </label>
                <Select
                  id="partner-tier-select"
                  value={live.tierCode ?? ""}
                  onChange={(e) => {
                    const code = e.target.value || undefined;
                    patchPartner(live.id, { tierCode: code });
                  }}
                >
                  <option value="">— None —</option>
                  {compatibleTiers.map((t) => (
                    <option key={t.id} value={t.code}>
                      {t.code} · {t.name} ({t.discountPercent}%)
                    </option>
                  ))}
                </Select>
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground">
                Enable wholesaler, retailer, or distributor role to assign tiers.
              </p>
            )}
          </div>
        )}

        {tab === "territories" && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground">Regional coverage for this partner.</p>
              <Button variant="outline" size="sm" className="h-7 text-[10px]" asChild>
                <Link href="/partners/territories?create=1">Assign</Link>
              </Button>
            </div>
            {partnerTerritories.length === 0 ? (
              <p className="rounded-md border border-dashed border-input px-3 py-2 text-muted-foreground">
                No territories assigned.
              </p>
            ) : (
              <ul className="space-y-2">
                {partnerTerritories.map((t) => (
                  <li key={t.id} className="rounded-md border border-input px-3 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{t.region}</span>
                      <Badge variant={partnerRoleBadgeVariant(t.role)} className="text-[9px]">
                        {PARTNER_ROLE_LABELS[t.role]}
                      </Badge>
                      {t.isExclusive && (
                        <Badge variant="warning" className="text-[9px]">
                          Exclusive
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {t.country}
                      {t.district ? ` · ${t.district}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "catalog" && showCatalog && <PartnerCatalogTab partner={live} />}

        {tab === "profile" && (
          <dl className="grid gap-3 text-xs sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd>{live.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{live.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Tax ID</dt>
              <dd>{live.taxId || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Website</dt>
              <dd>
                {live.website ? (
                  <a href={live.website} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                    {live.website}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Assigned to</dt>
              <dd>{live.assignedTo || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Updated</dt>
              <dd>{live.updatedAt}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, FileText, X } from "lucide-react";
import {
  ONBOARDING_STATUS_LABELS,
  type PartnerOnboardingApplication,
} from "@/lib/mock-data/business-partner-onboarding";
import { PARTNER_ROLE_LABELS } from "@/lib/mock-data/business-partners";
import {
  onboardingStatusBadgeVariant,
  useBusinessPartnerOnboardingStore,
} from "@/lib/store/business-partner-onboarding-store";
import { partnerRoleBadgeVariant } from "@/lib/store/business-partner-store";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Tab = "summary" | "documents" | "review" | "history";

type Props = {
  application: PartnerOnboardingApplication;
  inDialog?: boolean;
  onClose?: () => void;
  onApproved?: (partnerId: string) => void;
};

export function OnboardingDetailContent({
  application,
  inDialog,
  onClose,
  onApproved,
}: Props) {
  const live =
    useBusinessPartnerOnboardingStore((s) => s.getById(application.id)) ?? application;
  const startReview = useBusinessPartnerOnboardingStore((s) => s.startReview);
  const approveApplication = useBusinessPartnerOnboardingStore((s) => s.approveApplication);
  const rejectApplication = useBusinessPartnerOnboardingStore((s) => s.rejectApplication);
  const patchNotes = useBusinessPartnerOnboardingStore((s) => s.patchNotes);

  const [tab, setTab] = useState<Tab>("summary");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [notes, setNotes] = useState(live.reviewNotes ?? "");

  const canAct = live.status === "submitted" || live.status === "review";
  const tabs: { id: Tab; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "documents", label: "Documents" },
    { id: "review", label: "Review" },
    { id: "history", label: "History" },
  ];

  const handleApprove = () => {
    if (live.status === "submitted") startReview(live.id);
    const partnerId = approveApplication(live.id);
    if (partnerId) onApproved?.(partnerId);
  };

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", inDialog && "h-full")}>
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-2 border-b border-input pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">{live.applicationNumber}</h2>
            <Badge variant={onboardingStatusBadgeVariant(live.status)} className="text-[10px] capitalize">
              {ONBOARDING_STATUS_LABELS[live.status]}
            </Badge>
          </div>
          <p className="text-sm font-medium">{live.companyName}</p>
          <p className="text-[11px] text-muted-foreground">
            Submitted {new Date(live.submittedAt).toLocaleString()}
          </p>
        </div>
        {onClose && (
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="mt-2 flex shrink-0 gap-1 overflow-x-auto border-b border-input">
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

      <div className="min-h-0 flex-1 overflow-y-auto py-3">
        {tab === "summary" && (
          <div className="space-y-3 text-xs">
            <div className="flex flex-wrap gap-1">
              {live.requestedRoles.map((role) => (
                <Badge key={role} variant={partnerRoleBadgeVariant(role)} className="text-[10px]">
                  {PARTNER_ROLE_LABELS[role]}
                </Badge>
              ))}
            </div>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Contact</dt>
                <dd>{live.contactName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{live.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{live.phone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Territory</dt>
                <dd>
                  {live.territory}, {live.country}
                </dd>
              </div>
              {live.businessType && (
                <div>
                  <dt className="text-muted-foreground">Business type</dt>
                  <dd>{live.businessType}</dd>
                </div>
              )}
              {live.taxId && (
                <div>
                  <dt className="text-muted-foreground">Tax ID</dt>
                  <dd className="font-mono">{live.taxId}</dd>
                </div>
              )}
              {live.creditRequested != null && (
                <div>
                  <dt className="text-muted-foreground">Credit requested</dt>
                  <dd>{formatCurrency(live.creditRequested)}</dd>
                </div>
              )}
              {live.reviewerName && (
                <div>
                  <dt className="text-muted-foreground">Reviewer</dt>
                  <dd>{live.reviewerName}</dd>
                </div>
              )}
            </dl>
            {live.partnerId && (
              <p className="rounded-md border border-emerald-200 bg-emerald-50/50 px-3 py-2 dark:border-emerald-900 dark:bg-emerald-950/20">
                Linked partner:{" "}
                <Link
                  href={`/partners/directory?view=${live.partnerId}`}
                  className="font-medium text-primary hover:underline"
                >
                  View in directory
                </Link>
              </p>
            )}
            {live.rejectionReason && (
              <p className="rounded-md border border-input bg-muted/40 px-3 py-2 text-muted-foreground">
                Rejection: {live.rejectionReason}
              </p>
            )}
          </div>
        )}

        {tab === "documents" && (
          <div className="space-y-2">
            {live.documents.length === 0 ? (
              <p className="text-xs text-muted-foreground">No documents uploaded.</p>
            ) : (
              live.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-2 rounded-md border border-input px-3 py-2 text-xs"
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {doc.type} · {doc.uploadedAt}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "review" && (
          <div className="space-y-3 text-xs">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => patchNotes(live.id, notes)}
              rows={4}
              placeholder="Internal review notes…"
              disabled={!canAct}
            />
            {showReject && (
              <div className="space-y-2 rounded-md border border-input p-3">
                <p className="font-medium">Rejection reason *</p>
                <Input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Required before reject"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px]"
                    onClick={() => setShowReject(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px]"
                    onClick={() => {
                      rejectApplication(live.id, rejectReason);
                      setShowReject(false);
                    }}
                  >
                    Confirm reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <ul className="space-y-2">
            {[...live.history].reverse().map((entry) => (
              <li key={entry.id} className="rounded-md border border-input px-3 py-2 text-xs">
                <div className="flex justify-between gap-2">
                  <Badge variant={onboardingStatusBadgeVariant(entry.status)} className="text-[9px]">
                    {ONBOARDING_STATUS_LABELS[entry.status]}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(entry.at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1">{entry.message}</p>
                {entry.by && (
                  <p className="text-[10px] text-muted-foreground">by {entry.by}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {canAct && (
        <div className="flex shrink-0 flex-wrap gap-2 border-t border-input pt-3 sm:sticky sm:bottom-0 sm:bg-background">
          {live.status === "submitted" && (
            <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => startReview(live.id)}>
              Start review
            </Button>
          )}
          <Button size="sm" className="h-8 text-xs" onClick={handleApprove}>
            <Check className="mr-1 h-3.5 w-3.5" /> Approve
          </Button>
          {!showReject && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => setShowReject(true)}
            >
              Reject
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

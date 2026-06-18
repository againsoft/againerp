import { create } from "zustand";
import { toast } from "sonner";
import { buildPartnerDraft } from "@/lib/mock-data/business-partners";
import {
  onboardingApplicationsSeed,
  type OnboardingHistoryEntry,
  type OnboardingStatus,
  type PartnerOnboardingApplication,
} from "@/lib/mock-data/business-partner-onboarding";
import { useBusinessPartnerStore } from "@/lib/store/business-partner-store";

type BusinessPartnerOnboardingStore = {
  applications: PartnerOnboardingApplication[];
  getById: (id: string) => PartnerOnboardingApplication | undefined;
  startReview: (id: string, reviewerName?: string) => void;
  approveApplication: (id: string) => string | null;
  rejectApplication: (id: string, reason: string) => void;
  patchNotes: (id: string, notes: string) => void;
};

function appendHistory(
  app: PartnerOnboardingApplication,
  entry: Omit<OnboardingHistoryEntry, "id">,
): OnboardingHistoryEntry[] {
  return [
    ...app.history,
    { ...entry, id: `oh_${Date.now()}_${Math.random().toString(36).slice(2, 5)}` },
  ];
}

export const useBusinessPartnerOnboardingStore = create<BusinessPartnerOnboardingStore>()(
  (set, get) => ({
    applications: onboardingApplicationsSeed.map((a) => ({ ...a, history: [...a.history] })),
    getById: (id) => get().applications.find((a) => a.id === id),
    startReview: (id, reviewerName = "Current user") => {
      const app = get().getById(id);
      if (!app || app.status !== "submitted") return;
      set((s) => ({
        applications: s.applications.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "review" as OnboardingStatus,
                reviewerName,
                history: appendHistory(a, {
                  at: new Date().toISOString(),
                  status: "review",
                  message: `Assigned to ${reviewerName}`,
                  by: reviewerName,
                }),
              }
            : a,
        ),
      }));
      toast.success("Application moved to review");
    },
    approveApplication: (id) => {
      const app = get().getById(id);
      if (!app) return null;
      if (!["submitted", "review"].includes(app.status)) {
        toast.error("Application cannot be approved");
        return null;
      }
      if (app.partnerId) {
        toast.info("Already linked to partner");
        return app.partnerId;
      }

      const primaryRole = app.requestedRoles[0] ?? "vendor";
      const partner = buildPartnerDraft({
        name: app.companyName,
        email: app.email,
        phone: app.phone,
        country: app.country,
        territory: app.territory,
        roles: [...app.requestedRoles],
        primaryRole,
        status: "active",
        creditLimit: app.creditRequested,
        taxId: app.taxId,
        assignedTo: app.reviewerName,
        notes: `Created from ${app.applicationNumber}`,
        terms: app.requestedRoles.map((role) => ({
          role,
          paymentTerms: role === "vendor" ? "Net 30" : "Net 15",
          paymentTermsDays: role === "vendor" ? 30 : 15,
          currencyCode: "BDT",
          creditLimit: app.creditRequested,
        })),
      });

      useBusinessPartnerStore.getState().addPartner(partner);

      set((s) => ({
        applications: s.applications.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "approved" as OnboardingStatus,
                partnerId: partner.id,
                history: appendHistory(a, {
                  at: new Date().toISOString(),
                  status: "approved",
                  message: `Partner ${partner.partnerCode} created`,
                  by: app.reviewerName ?? "Current user",
                }),
              }
            : a,
        ),
      }));

      toast.success(`Approved — partner ${partner.partnerCode} created`);
      return partner.id;
    },
    rejectApplication: (id, reason) => {
      const app = get().getById(id);
      if (!app) return;
      if (!["submitted", "review"].includes(app.status)) {
        toast.error("Application cannot be rejected");
        return;
      }
      if (!reason.trim()) {
        toast.error("Rejection reason is required");
        return;
      }
      set((s) => ({
        applications: s.applications.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "rejected" as OnboardingStatus,
                rejectionReason: reason.trim(),
                history: appendHistory(a, {
                  at: new Date().toISOString(),
                  status: "rejected",
                  message: reason.trim(),
                  by: a.reviewerName ?? "Current user",
                }),
              }
            : a,
        ),
      }));
      toast.success("Application rejected");
    },
    patchNotes: (id, notes) =>
      set((s) => ({
        applications: s.applications.map((a) => (a.id === id ? { ...a, reviewNotes: notes } : a)),
      })),
  }),
);

export function onboardingStatusBadgeVariant(
  status: OnboardingStatus,
): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (status) {
    case "submitted":
      return "muted";
    case "review":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "outline";
    case "withdrawn":
      return "secondary";
    default:
      return "muted";
  }
}

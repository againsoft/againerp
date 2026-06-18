import type { PartnerRole } from "./business-partners";

export type OnboardingStatus =
  | "submitted"
  | "review"
  | "approved"
  | "rejected"
  | "withdrawn";

export type OnboardingDocument = {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
};

export type OnboardingHistoryEntry = {
  id: string;
  at: string;
  status: OnboardingStatus;
  message: string;
  by?: string;
};

export type PartnerOnboardingApplication = {
  id: string;
  applicationNumber: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  territory: string;
  requestedRoles: PartnerRole[];
  status: OnboardingStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewerName?: string;
  partnerId?: string;
  rejectionReason?: string;
  creditRequested?: number;
  businessType?: string;
  taxId?: string;
  documents: OnboardingDocument[];
  reviewNotes?: string;
  history: OnboardingHistoryEntry[];
};

export const ONBOARDING_STATUS_LABELS: Record<OnboardingStatus, string> = {
  submitted: "Submitted",
  review: "In review",
  approved: "Approved",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const onboardingApplicationsSeed: PartnerOnboardingApplication[] = [
  {
    id: "onb_001",
    applicationNumber: "ONB-2026-0042",
    companyName: "Delta Electronics BD",
    contactName: "Karim Hassan",
    email: "vendor@deltaelectronics.bd",
    phone: "+880 1711-100042",
    country: "Bangladesh",
    territory: "Dhaka",
    requestedRoles: ["vendor"],
    status: "review",
    submittedAt: "2026-06-14T09:30:00Z",
    reviewerName: "Rahim Uddin",
    creditRequested: 1500000,
    businessType: "Electronics distributor",
    taxId: "BIN-998877665",
    documents: [
      { id: "doc_1", name: "Trade License.pdf", type: "trade_license", uploadedAt: "2026-06-14" },
      { id: "doc_2", name: "TIN Certificate.pdf", type: "tin", uploadedAt: "2026-06-14" },
    ],
    reviewNotes: "Verify BIN with NBR portal before approval.",
    history: [
      { id: "h1", at: "2026-06-14T09:30:00Z", status: "submitted", message: "Application submitted" },
      { id: "h2", at: "2026-06-15T10:00:00Z", status: "review", message: "Assigned to Rahim Uddin", by: "System" },
    ],
  },
  {
    id: "onb_002",
    applicationNumber: "ONB-2026-0041",
    companyName: "GreenMart Retail Chain",
    contactName: "Sadia Rahman",
    email: "partnerships@greenmart.bd",
    phone: "+880 1711-100041",
    country: "Bangladesh",
    territory: "Chittagong",
    requestedRoles: ["retailer", "customer"],
    status: "submitted",
    submittedAt: "2026-06-15T14:20:00Z",
    creditRequested: 800000,
    businessType: "Retail chain",
    documents: [
      { id: "doc_3", name: "Company Profile.pdf", type: "profile", uploadedAt: "2026-06-15" },
    ],
    history: [
      { id: "h3", at: "2026-06-15T14:20:00Z", status: "submitted", message: "Application submitted" },
    ],
  },
  {
    id: "onb_003",
    applicationNumber: "ONB-2026-0040",
    companyName: "Prime Wholesale Ltd",
    contactName: "Anwar Hossain",
    email: "trade@primewholesale.bd",
    phone: "+880 1711-100040",
    country: "Bangladesh",
    territory: "National",
    requestedRoles: ["wholesaler", "distributor"],
    status: "review",
    submittedAt: "2026-06-13T11:00:00Z",
    reviewerName: "Karim Ahmed",
    creditRequested: 5000000,
    businessType: "Wholesale distribution",
    taxId: "BIN-112233445",
    documents: [
      { id: "doc_4", name: "Trade License.pdf", type: "trade_license", uploadedAt: "2026-06-13" },
      { id: "doc_5", name: "Bank Solvency.pdf", type: "bank", uploadedAt: "2026-06-13" },
    ],
    history: [
      { id: "h4", at: "2026-06-13T11:00:00Z", status: "submitted", message: "Application submitted" },
      { id: "h5", at: "2026-06-14T09:00:00Z", status: "review", message: "Credit team review started", by: "Karim Ahmed" },
    ],
  },
  {
    id: "onb_004",
    applicationNumber: "ONB-2026-0039",
    companyName: "QuickShip Logistics",
    contactName: "Mehdi Alam",
    email: "ops@quickship.bd",
    phone: "+880 1711-100039",
    country: "Bangladesh",
    territory: "Dhaka",
    requestedRoles: ["dropship", "vendor"],
    status: "submitted",
    submittedAt: "2026-06-16T08:45:00Z",
    creditRequested: 500000,
    documents: [],
    history: [
      { id: "h6", at: "2026-06-16T08:45:00Z", status: "submitted", message: "Application submitted" },
    ],
  },
  {
    id: "onb_005",
    applicationNumber: "ONB-2026-0038",
    companyName: "StyleHub Franchise",
    contactName: "Nusrat Jahan",
    email: "franchise@stylehub.bd",
    phone: "+880 1711-100038",
    country: "Bangladesh",
    territory: "Sylhet",
    requestedRoles: ["franchisee", "retailer"],
    status: "approved",
    submittedAt: "2026-06-08T10:00:00Z",
    reviewerName: "Sadia Khan",
    partnerId: "bp_010",
    creditRequested: 1200000,
    documents: [
      { id: "doc_6", name: "Franchise Agreement.pdf", type: "contract", uploadedAt: "2026-06-08" },
    ],
    history: [
      { id: "h7", at: "2026-06-08T10:00:00Z", status: "submitted", message: "Application submitted" },
      { id: "h8", at: "2026-06-09T11:00:00Z", status: "review", message: "Legal review", by: "Sadia Khan" },
      { id: "h9", at: "2026-06-10T15:00:00Z", status: "approved", message: "Partner BP-FRN-01 created", by: "Sadia Khan" },
    ],
  },
  {
    id: "onb_006",
    applicationNumber: "ONB-2026-0037",
    companyName: "Budget Imports Co.",
    contactName: "Rafiq Islam",
    email: "info@budgetimports.bd",
    phone: "+880 1711-100037",
    country: "Bangladesh",
    territory: "Dhaka",
    requestedRoles: ["vendor"],
    status: "rejected",
    submittedAt: "2026-06-05T16:00:00Z",
    reviewerName: "Rahim Uddin",
    rejectionReason: "Incomplete trade license — document expired.",
    documents: [
      { id: "doc_7", name: "Expired License.pdf", type: "trade_license", uploadedAt: "2026-06-05" },
    ],
    history: [
      { id: "h10", at: "2026-06-05T16:00:00Z", status: "submitted", message: "Application submitted" },
      { id: "h11", at: "2026-06-06T10:00:00Z", status: "review", message: "Document check", by: "Rahim Uddin" },
      { id: "h12", at: "2026-06-07T09:00:00Z", status: "rejected", message: "Rejected — expired license", by: "Rahim Uddin" },
    ],
  },
  {
    id: "onb_007",
    applicationNumber: "ONB-2026-0036",
    companyName: "ChannelBoost Agency",
    contactName: "Tahmina Sultana",
    email: "partner@channelboost.bd",
    phone: "+880 1711-100036",
    country: "Bangladesh",
    territory: "Dhaka",
    requestedRoles: ["channel_partner"],
    status: "submitted",
    submittedAt: "2026-06-16T11:30:00Z",
    documents: [
      { id: "doc_8", name: "Agency Registration.pdf", type: "registration", uploadedAt: "2026-06-16" },
    ],
    history: [
      { id: "h13", at: "2026-06-16T11:30:00Z", status: "submitted", message: "Application submitted" },
    ],
  },
  {
    id: "onb_008",
    applicationNumber: "ONB-2026-0035",
    companyName: "Metro Supplies Inc.",
    contactName: "James Chen",
    email: "export@metrosupplies.hk",
    phone: "+852 2000-0035",
    country: "Hong Kong",
    territory: "International",
    requestedRoles: ["vendor", "wholesaler"],
    status: "approved",
    submittedAt: "2026-06-01T08:00:00Z",
    reviewerName: "Karim Ahmed",
    partnerId: "bp_004",
    creditRequested: 3000000,
    documents: [
      { id: "doc_9", name: "Export License.pdf", type: "export", uploadedAt: "2026-06-01" },
    ],
    history: [
      { id: "h14", at: "2026-06-01T08:00:00Z", status: "submitted", message: "Application submitted" },
      { id: "h15", at: "2026-06-03T14:00:00Z", status: "approved", message: "Linked to existing vendor record", by: "Karim Ahmed" },
    ],
  },
];

export function getOnboardingById(id: string): PartnerOnboardingApplication | undefined {
  return onboardingApplicationsSeed.find((a) => a.id === id);
}

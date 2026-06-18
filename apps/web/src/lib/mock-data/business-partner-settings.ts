export type BusinessPartnerSettings = {
  partnerCodePrefix: string;
  nextPartnerSequence: number;
  onboardingRequiresApproval: boolean;
  defaultVendorPaymentTerms: string;
  defaultVendorPaymentDays: number;
  creditCheckOnSalesOrder: boolean;
  autoAssignAccountManager: boolean;
  allowMultiRolePartners: boolean;
  syncVendorCatalogOnApprove: boolean;
};

export const businessPartnerSettingsSeed: BusinessPartnerSettings = {
  partnerCodePrefix: "BP-",
  nextPartnerSequence: 28,
  onboardingRequiresApproval: true,
  defaultVendorPaymentTerms: "Net 30",
  defaultVendorPaymentDays: 30,
  creditCheckOnSalesOrder: true,
  autoAssignAccountManager: true,
  allowMultiRolePartners: true,
  syncVendorCatalogOnApprove: false,
};

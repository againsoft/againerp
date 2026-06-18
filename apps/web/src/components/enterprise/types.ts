/**
 * Enterprise component library types — CMP-* · DS-*
 * @see docs/design-system/HR_DESIGN_SYSTEM_SPECIFICATION.md
 */

export type EnterpriseCardSize = "sm" | "md" | "lg";

export type EnterpriseTrendDirection = "up" | "down" | "neutral";

export type EnterpriseKpiStatus = "good" | "warning" | "critical" | "neutral";

/** Universal status — docs/ui-ux/status-system.md */
export type EnterpriseStatus =
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "rejected"
  | "archived"
  | "draft"
  | "locked";

export type EnterpriseApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "escalated"
  | "delegated"
  | "cancelled";

export type EnterpriseRiskLevel = "critical" | "high" | "medium" | "low" | "none";

export type AiConfidence = "high" | "medium" | "low";

export type AiInsightSeverity = "info" | "warning" | "critical";

export type EnterpriseKpiCardData = {
  id?: string;
  label: string;
  value: string;
  trend?: string;
  trendDirection?: EnterpriseTrendDirection;
  hint?: string;
  href?: string;
  status?: EnterpriseKpiStatus;
};

export type EnterpriseAnalyticsCardData = {
  id?: string;
  title: string;
  subtitle?: string;
  metric?: string;
  metricLabel?: string;
  footer?: string;
  href?: string;
};

export type EnterpriseApprovalCardData = {
  id: string;
  requestId: string;
  module: string;
  requestType: string;
  requester: string;
  department?: string;
  priority: "critical" | "high" | "medium" | "low";
  status: EnterpriseApprovalStatus;
  submittedAt: string;
  href: string;
};

export type EnterpriseTimelineCardData = {
  id: string;
  title: string;
  description?: string;
  user: string;
  department?: string;
  module?: string;
  timestamp: string;
  relativeTime?: string;
  priority?: "critical" | "high" | "medium" | "low";
  unread?: boolean;
  href?: string;
};

export type EnterpriseEmployeeCardData = {
  id: string;
  name: string;
  employeeNumber: string;
  designation: string;
  department: string;
  branch?: string;
  status: EnterpriseStatus;
  href: string;
  meta?: string;
};

export type EnterpriseAiInsightCardData = {
  id: string;
  title: string;
  summary: string;
  severity?: AiInsightSeverity;
  confidence?: AiConfidence;
  href?: string;
  actions?: { id: string; label: string; href?: string }[];
};

export type EnterpriseAiRecommendationCardData = {
  id: string;
  title: string;
  summary: string;
  type?: "promotion" | "training" | "policy" | "general";
  priority?: "high" | "medium" | "low";
  subject?: string;
  href?: string;
};

export type EnterpriseNotificationCardData = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  href?: string;
  category?: string;
};

export type EnterpriseQuickActionCardData = {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon?: "calendar" | "clock" | "wallet" | "file" | "users" | "sparkles";
};

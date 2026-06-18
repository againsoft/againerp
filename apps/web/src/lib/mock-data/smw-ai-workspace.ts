/**
 * Sales & Marketing AI Workspace mock data · SCR-SMW-AI-001
 */

export type SmwAiMode = "chat" | "insights" | "recommendations" | "predictions" | "actions" | "history";

export type SmwAiContext = {
  module: string;
  territory: string;
  viewAs: string;
  pipeline: string;
  scope: "company" | "territory" | "team" | "rep";
  period: string;
};

export type SmwAiChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: { id: string; label: string; href: string }[];
  suggestedActions?: { id: string; label: string; href?: string }[];
  structured?: { type: "metric"; items: { label: string; value: string }[] };
};

export type SmwAiInsight = {
  id: string;
  category: "pipeline" | "leads" | "campaigns" | "quotations";
  title: string;
  summary: string;
  severity: "info" | "warning" | "critical";
  confidence: "high" | "medium" | "low";
  href: string;
};

export type SmwAiRecommendation = {
  id: string;
  type: "deal" | "lead" | "campaign" | "pricing";
  title: string;
  summary: string;
  priority: "high" | "medium" | "low";
  href: string;
};

export type SmwAiPrediction = {
  id: string;
  title: string;
  summary: string;
  horizon: string;
  trend: "up" | "down" | "stable";
  confidence: "high" | "medium" | "low";
  metric?: string;
};

export type SmwAiAction = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export type SmwAiHistoryItem = {
  id: string;
  type: "query" | "report" | "recommendation";
  title: string;
  meta: string;
  timestamp: string;
  status?: "applied" | "dismissed" | "completed";
};

export const SMW_AI_CONTEXT: SmwAiContext = {
  module: "Sales & Marketing",
  territory: "All territories",
  viewAs: "Sales Manager",
  pipeline: "Q2 2026",
  scope: "company",
  period: "Jun 2026",
};

export const SMW_AI_MODES: { id: SmwAiMode; label: string }[] = [
  { id: "chat", label: "AI Chat" },
  { id: "insights", label: "AI Insights" },
  { id: "recommendations", label: "Recommendations" },
  { id: "predictions", label: "Predictions" },
  { id: "actions", label: "Quick actions" },
  { id: "history", label: "History" },
];

export const SMW_AI_CHAT: SmwAiChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Which deals are at risk of slipping this month?",
    timestamp: "10:12 AM",
  },
  {
    id: "msg-2",
    role: "assistant",
    content:
      "Three opportunities show slip risk: Acme Retail (৳280K weighted, no activity 14d), Nova Foods (৳420K, demo pending), and GreenTech (৳180K, quotation expiring). Combined weighted value ৳680K.",
    timestamp: "10:12 AM",
    citations: [
      { id: "c1", label: "Pipeline report", href: "/sales-marketing/reports?report=pipeline" },
      { id: "c2", label: "At-risk filter", href: "/sales-marketing/opportunities" },
    ],
    suggestedActions: [
      { id: "a1", label: "Log follow-up tasks", href: "/sales-marketing/activities?create=1" },
      { id: "a2", label: "Review opportunities", href: "/sales-marketing/opportunities" },
    ],
    structured: {
      type: "metric",
      items: [
        { label: "At-risk deals", value: "3" },
        { label: "Weighted value", value: "৳680K" },
        { label: "Confidence", value: "High" },
      ],
    },
  },
  {
    id: "msg-3",
    role: "user",
    content: "Summarize Q2 quota attainment for my team.",
    timestamp: "10:18 AM",
  },
  {
    id: "msg-4",
    role: "assistant",
    content:
      "Enterprise team is at 81% of Q2 quota (৳5.45M / ৳6.75M). Karim leads at 93%; Nadia is furthest behind at 72%. Revenue gap to target: ৳860K with 12 days left in the quarter.",
    timestamp: "10:18 AM",
    citations: [
      { id: "c3", label: "Targets", href: "/sales-marketing/targets" },
      { id: "c4", label: "Teams", href: "/sales-marketing/teams" },
    ],
    suggestedActions: [
      { id: "a3", label: "View performance report", href: "/sales-marketing/reports?report=performance" },
      { id: "a4", label: "Adjust targets", href: "/sales-marketing/targets" },
    ],
  },
];

export const SMW_AI_PROMPTS = [
  "Deals at risk this month",
  "Hot leads without follow-up",
  "Top campaign ROI",
  "Forecast vs target",
  "Draft follow-up email",
];

export const SMW_AI_INSIGHTS: SmwAiInsight[] = [
  {
    id: "ins-pipe-1",
    category: "pipeline",
    title: "3 deals at risk of slipping",
    summary: "Acme Retail, Nova Foods, GreenTech — no activity 14+ days. Combined ৳680K weighted.",
    severity: "warning",
    confidence: "high",
    href: "/sales-marketing/opportunities",
  },
  {
    id: "ins-lead-1",
    category: "leads",
    title: "7 hot leads without follow-up",
    summary: "MQLs scored 80+ with no logged call or email in 48 hours.",
    severity: "critical",
    confidence: "high",
    href: "/sales-marketing/leads?status=hot",
  },
  {
    id: "ins-camp-1",
    category: "campaigns",
    title: "LinkedIn ABM outperforming email",
    summary: "ABM cohort shows 3.2× conversion vs email nurture. Consider +15% budget shift.",
    severity: "info",
    confidence: "medium",
    href: "/sales-marketing/campaigns?channel=linkedin_abm",
  },
  {
    id: "ins-qt-1",
    category: "quotations",
    title: "Quote win rate improving",
    summary: "Quote-to-close rose from 22% to 29% after template refresh on 1 Jun.",
    severity: "info",
    confidence: "medium",
    href: "/sales-marketing/reports?report=quotations",
  },
];

export const SMW_AI_INSIGHT_LABELS: Record<SmwAiInsight["category"], string> = {
  pipeline: "Pipeline",
  leads: "Leads",
  campaigns: "Campaigns",
  quotations: "Quotations",
};

export const SMW_AI_RECOMMENDATIONS: SmwAiRecommendation[] = [
  {
    id: "rec-deal-1",
    type: "deal",
    title: "Schedule exec call — Nova Foods",
    summary: "CFO engagement increases win probability 34% at proposal stage. Suggest demo follow-up this week.",
    priority: "high",
    href: "/sales-marketing/opportunities/opp-nova",
  },
  {
    id: "rec-lead-1",
    type: "lead",
    title: "Assign SDR blitz — hot MQLs",
    summary: "7 leads scored 80+ uncontacted. Route to Sadia for inside sales outreach today.",
    priority: "high",
    href: "/sales-marketing/leads?status=hot",
  },
  {
    id: "rec-camp-1",
    type: "campaign",
    title: "Reallocate ৳50K to LinkedIn ABM",
    summary: "Email nurture underperforming ABM by 3.2× on SQL conversion.",
    priority: "medium",
    href: "/sales-marketing/campaigns?view=camp-abm-q2",
  },
  {
    id: "rec-price-1",
    type: "pricing",
    title: "Offer volume discount — Delta Construction",
    summary: "Competitor match likely needed. 8% bundle discount within approved margin band.",
    priority: "medium",
    href: "/sales-marketing/quotations?view=qt-delta",
  },
];

export const SMW_AI_PREDICTIONS: SmwAiPrediction[] = [
  {
    id: "pred-1",
    title: "June revenue forecast",
    summary: "Projected to close at ৳2.05M — 2.5% above target if Nova Foods closes.",
    horizon: "30 days",
    trend: "up",
    confidence: "high",
    metric: "৳2.05M",
  },
  {
    id: "pred-2",
    title: "Q2 win rate",
    summary: "Trending to 32% vs 28% target based on current pipeline velocity.",
    horizon: "Q2 end",
    trend: "up",
    confidence: "medium",
    metric: "32%",
  },
  {
    id: "pred-3",
    title: "Lead volume (Jul)",
    summary: "Trade show carry-over may lift inbound leads 18% vs June baseline.",
    horizon: "Next month",
    trend: "up",
    confidence: "low",
    metric: "+18%",
  },
];

export const SMW_AI_ACTIONS: SmwAiAction[] = [
  { id: "act-1", label: "Generate pipeline brief", description: "PDF summary for leadership stand-up", href: "/sales-marketing/reports?report=pipeline" },
  { id: "act-2", label: "Create follow-up tasks", description: "Bulk tasks for at-risk deals", href: "/sales-marketing/activities?create=1" },
  { id: "act-3", label: "Draft win-loss summary", description: "Q2 closed deals analysis", href: "/sales-marketing/reports?report=performance" },
  { id: "act-4", label: "Suggest quotation pricing", description: "AI-assisted line pricing for open quotes", href: "/sales-marketing/quotations" },
];

export const SMW_AI_HISTORY: SmwAiHistoryItem[] = [
  { id: "h1", type: "query", title: "Deals at risk this month", meta: "3 results · revenue_agent", timestamp: "18 Jun, 10:12", status: "completed" },
  { id: "h2", type: "recommendation", title: "LinkedIn ABM budget shift", meta: "Applied to campaign plan", timestamp: "17 Jun, 16:40", status: "applied" },
  { id: "h3", type: "report", title: "Pipeline brief generated", meta: "Shared with exec team", timestamp: "16 Jun, 09:00", status: "completed" },
  { id: "h4", type: "query", title: "Hot leads without follow-up", meta: "7 leads flagged", timestamp: "15 Jun, 14:22", status: "completed" },
];

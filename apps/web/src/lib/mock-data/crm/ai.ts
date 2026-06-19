export const crmAiInsights = {
  leadScores: [
    { leadId: "lead-001", name: "Rahim Ahmed", company: "Metro Retail Ltd", score: 86, trend: "+4" },
    { leadId: "lead-008", name: "Farzana Akter", company: "MediCare Supplies", score: 83, trend: "+2" },
    { leadId: "lead-002", name: "Sadia Khan", company: "GreenMart Superstores", score: 72, trend: "−1" },
  ],
  leadSummary:
    "Metro Retail shows highest close probability this week. 3 leads have stale activity — recommend follow-up tasks.",
  suggestedActions: [
    { id: "sa1", label: "Schedule executive call with Metro Retail", href: "/crm/activities?create=1" },
    { id: "sa2", label: "Send follow-up to 3 stale quotations", href: "/crm/leads?savedView=stale" },
    { id: "sa3", label: "Assign unowned leads to team", href: "/crm/leads?owner=unassigned" },
  ],
  opportunityInsights: [
    {
      id: "oi1",
      title: "Metro Retail — 78% win probability",
      body: "Deal in negotiation stage. Executive sponsor engaged — accelerate contract review.",
    },
    {
      id: "oi2",
      title: "GreenMart — at-risk",
      body: "No activity in 5 days. Competitor mention in last call notes.",
    },
    {
      id: "oi3",
      title: "Pipeline coverage",
      body: "Q2 pipeline at 1.4× quota — focus on proposal-stage deals to close gap.",
    },
  ],
};

export const crmDashboardAiBriefing = {
  id: "crm-ai",
  title: "AI Insights",
  bullets: [
    "Metro Retail deal has 78% close probability — schedule executive call this week.",
    "3 leads with no activity in 7+ days — automated follow-up drafts ready.",
    "Conversion rate dipped 1.2pp — top drop-off at Contacted → Qualified stage.",
  ],
  ctaLabel: "Open AI CRM",
};

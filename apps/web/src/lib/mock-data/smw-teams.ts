/**
 * Sales & Marketing — Teams mock data · SCR-SMW-TEM-001
 */

import type { EnterpriseStatus } from "@/components/enterprise/types";
import { SMW_LEAD_OWNERS, SMW_LEAD_TERRITORIES } from "@/lib/mock-data/smw-leads";

export type TeamStatus = "active" | "inactive" | "archived";
export type TeamMemberRole = "manager" | "senior_rep" | "rep" | "sdr";

export type SmwTeam = {
  id: string;
  teamNumber: string;
  name: string;
  description?: string;
  managerId: string;
  managerName: string;
  status: TeamStatus;
  territoryIds: string[];
  territoryNames: string[];
  memberIds: string[];
  quotaTarget: number;
  quotaAchieved: number;
  notes?: string;
};

export type SmwTeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: TeamMemberRole;
  teamId: string;
  teamName: string;
  territoryId: string;
  territoryName: string;
  quotaTarget: number;
  quotaAchieved: number;
  activeLeads: number;
  openOpportunities: number;
  status: "active" | "on_leave" | "inactive";
};

export const TEAM_STATUS_LABELS: Record<TeamStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};

export const TEAM_MEMBER_ROLE_LABELS: Record<TeamMemberRole, string> = {
  manager: "Sales manager",
  senior_rep: "Senior rep",
  rep: "Sales rep",
  sdr: "SDR",
};

export const MEMBER_STATUS_LABELS: Record<SmwTeamMember["status"], string> = {
  active: "Active",
  on_leave: "On leave",
  inactive: "Inactive",
};

export const smwTeamsSeed: SmwTeam[] = [
  {
    id: "enterprise",
    teamNumber: "TEAM-2026-001",
    name: "Enterprise sales",
    description: "Large accounts and complex ERP deals — Dhaka & export.",
    managerId: "karim",
    managerName: "Karim Hassan",
    status: "active",
    territoryIds: ["dhk", "export"],
    territoryNames: ["Dhaka Metro", "Export / APAC"],
    memberIds: ["karim", "farhana", "nadia"],
    quotaTarget: 6750000,
    quotaAchieved: 5454000,
    notes: "Focus on manufacturing and retail verticals.",
  },
  {
    id: "midmarket",
    teamNumber: "TEAM-2026-002",
    name: "Mid-market",
    description: "Growth segment — 50–500 employee companies.",
    managerId: "rafiq",
    managerName: "Rafiq Islam",
    status: "active",
    territoryIds: ["dhk", "ctg"],
    territoryNames: ["Dhaka Metro", "Chittagong"],
    memberIds: ["rafiq", "nadia"],
    quotaTarget: 3600000,
    quotaAchieved: 2772000,
  },
  {
    id: "smb",
    teamNumber: "TEAM-2026-003",
    name: "SMB / Inside sales",
    description: "High-velocity inside sales and inbound leads.",
    managerId: "sadia",
    managerName: "Sadia Akter",
    status: "active",
    territoryIds: ["dhk", "syl"],
    territoryNames: ["Dhaka Metro", "Sylhet"],
    memberIds: ["sadia"],
    quotaTarget: 1800000,
    quotaAchieved: 1080000,
  },
];

export const smwTeamMembersSeed: SmwTeamMember[] = [
  {
    id: "farhana",
    name: "Farhana Rahman",
    email: "farhana.rahman@againerp.demo",
    phone: "+880 1711 223344",
    role: "senior_rep",
    teamId: "enterprise",
    teamName: "Enterprise sales",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    quotaTarget: 2400000,
    quotaAchieved: 1848000,
    activeLeads: 14,
    openOpportunities: 6,
    status: "active",
  },
  {
    id: "karim",
    name: "Karim Hassan",
    email: "karim.hassan@againerp.demo",
    phone: "+880 1812 334455",
    role: "manager",
    teamId: "enterprise",
    teamName: "Enterprise sales",
    territoryId: "dhk",
    territoryName: "Dhaka Metro",
    quotaTarget: 2250000,
    quotaAchieved: 2094000,
    activeLeads: 11,
    openOpportunities: 8,
    status: "active",
  },
  {
    id: "nadia",
    name: "Nadia Chowdhury",
    email: "nadia.chowdhury@againerp.demo",
    phone: "+880 1913 445566",
    role: "rep",
    teamId: "enterprise",
    teamName: "Enterprise sales",
    territoryId: "export",
    territoryName: "Export / APAC",
    quotaTarget: 2100000,
    quotaAchieved: 1512000,
    activeLeads: 9,
    openOpportunities: 5,
    status: "active",
  },
  {
    id: "rafiq",
    name: "Rafiq Islam",
    email: "rafiq.islam@againerp.demo",
    phone: "+880 1614 556677",
    role: "manager",
    teamId: "midmarket",
    teamName: "Mid-market",
    territoryId: "ctg",
    territoryName: "Chittagong",
    quotaTarget: 1950000,
    quotaAchieved: 1560000,
    activeLeads: 12,
    openOpportunities: 4,
    status: "active",
  },
  {
    id: "sadia",
    name: "Sadia Akter",
    email: "sadia.akter@againerp.demo",
    phone: "+880 1515 667788",
    role: "manager",
    teamId: "smb",
    teamName: "SMB / Inside sales",
    territoryId: "syl",
    territoryName: "Sylhet",
    quotaTarget: 1800000,
    quotaAchieved: 1080000,
    activeLeads: 22,
    openOpportunities: 3,
    status: "active",
  },
];

export function getTeamById(id: string): SmwTeam | undefined {
  return smwTeamsSeed.find((t) => t.id === id);
}

export function getTeamMemberById(id: string): SmwTeamMember | undefined {
  return smwTeamMembersSeed.find((m) => m.id === id);
}

export function getMembersByTeam(teamId: string): SmwTeamMember[] {
  return smwTeamMembersSeed.filter((m) => m.teamId === teamId);
}

export function formatTeamCurrency(value: number): string {
  if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `৳${Math.round(value / 1_000)}K`;
  return `৳${value.toLocaleString()}`;
}

export function teamQuotaPct(team: SmwTeam | SmwTeamMember): number {
  if (team.quotaTarget <= 0) return 0;
  return Math.min(100, Math.round((team.quotaAchieved / team.quotaTarget) * 100));
}

export function teamStatusToEnterprise(status: TeamStatus): EnterpriseStatus {
  const map: Record<TeamStatus, EnterpriseStatus> = {
    active: "active",
    inactive: "inactive",
    archived: "archived",
  };
  return map[status];
}

export function computeTeamMetrics(teams: SmwTeam[], members: SmwTeamMember[]) {
  const activeTeams = teams.filter((t) => t.status === "active");
  const activeMembers = members.filter((m) => m.status === "active");
  const totalQuota = activeTeams.reduce((s, t) => s + t.quotaTarget, 0);
  const totalAchieved = activeTeams.reduce((s, t) => s + t.quotaAchieved, 0);
  const avgPct = activeTeams.length > 0
    ? Math.round(activeTeams.reduce((s, t) => s + teamQuotaPct(t), 0) / activeTeams.length)
    : 0;
  return {
    teamCount: activeTeams.length,
    memberCount: activeMembers.length,
    avgAchievementPct: avgPct,
    totalQuota,
    totalAchieved,
  };
}

export function emptyTeam(): SmwTeam {
  const manager = SMW_LEAD_OWNERS[1]!;
  const territory = SMW_LEAD_TERRITORIES[0]!;
  return {
    id: `team-${Date.now()}`,
    teamNumber: `TEAM-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
    name: "",
    managerId: manager.id,
    managerName: manager.name,
    status: "active",
    territoryIds: [territory.id],
    territoryNames: [territory.name],
    memberIds: [manager.id],
    quotaTarget: 0,
    quotaAchieved: 0,
  };
}

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Users, UsersRound, X } from "lucide-react";
import { toast } from "sonner";
import { TeamFormSheet } from "@/components/sales-marketing/teams/team-form-sheet";
import { TeamKpiStrip } from "@/components/sales-marketing/teams/team-kpi-strip";
import { TeamMemberTable } from "@/components/sales-marketing/teams/team-member-table";
import { TeamMemberViewSheet } from "@/components/sales-marketing/teams/team-member-view-sheet";
import { TeamTable } from "@/components/sales-marketing/teams/team-table";
import { TeamViewSheet } from "@/components/sales-marketing/teams/team-view-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SMW_LEAD_TERRITORIES } from "@/lib/mock-data/smw-leads";
import {
  TEAM_STATUS_LABELS,
  getTeamById,
  getTeamMemberById,
  smwTeamMembersSeed,
  smwTeamsSeed,
  type SmwTeam,
  type SmwTeamMember,
  type TeamStatus,
} from "@/lib/mock-data/smw-teams";
import { useSmwTeamStore } from "@/lib/store/smw-team-store";
import { cn } from "@/lib/utils";

type LayoutMode = "members" | "teams";

function buildUrl(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/sales-marketing/teams?${query}` : "/sales-marketing/teams";
}

function TeamWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeTeams = useSmwTeamStore((s) => s.teams);
  const teams = storeTeams.length > 0 ? storeTeams : smwTeamsSeed;
  const members = smwTeamMembersSeed;

  const createOpen = searchParams.get("create") === "1";
  const editId = searchParams.get("edit");
  const viewId = searchParams.get("view");
  const repParam = searchParams.get("rep");
  const layout = (searchParams.get("layout") as LayoutMode) || (repParam ? "members" : "members");

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [teamFilter, setTeamFilter] = useState(searchParams.get("team") ?? "all");
  const [territoryFilter, setTerritoryFilter] = useState(searchParams.get("territory") ?? "all");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "all");

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildUrl(params), { scroll: false });
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (repParam && !viewId) {
      pushParams((p) => p.set("view", repParam));
    }
  }, [repParam]);

  const resolveTeam = (id: string | null) => {
    if (!id) return null;
    return teams.find((t) => t.id === id) ?? getTeamById(id) ?? null;
  };

  const resolveMember = (id: string | null) => {
    if (!id) return null;
    return members.find((m) => m.id === id) ?? getTeamMemberById(id) ?? null;
  };

  const editTeam = useMemo(() => resolveTeam(editId), [editId, teams]);
  const viewTeam = useMemo(() => (layout === "teams" ? resolveTeam(viewId) : null), [viewId, teams, layout]);
  const viewMember = useMemo(() => (layout === "members" ? resolveMember(viewId) : null), [viewId, layout]);

  const filteredTeams = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return teams.filter((t) => {
      if (t.status === "archived" && statusFilter !== "archived") return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (teamFilter !== "all" && t.id !== teamFilter) return false;
      if (territoryFilter !== "all" && !t.territoryIds.includes(territoryFilter)) return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.managerName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [teams, debouncedSearch, teamFilter, territoryFilter, statusFilter]);

  const filteredMembers = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return members.filter((m) => {
      if (teamFilter !== "all" && m.teamId !== teamFilter) return false;
      if (territoryFilter !== "all" && m.territoryId !== territoryFilter) return false;
      if (q && !m.name.toLowerCase().includes(q) && !m.teamName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [members, debouncedSearch, teamFilter, territoryFilter]);

  const openCreate = () => pushParams((p) => { p.delete("edit"); p.delete("view"); p.set("create", "1"); p.set("layout", "teams"); });
  const handleEditTeam = (t: SmwTeam) => pushParams((p) => { p.delete("create"); p.delete("view"); p.set("edit", t.id); p.set("layout", "teams"); });
  const handleViewTeam = (t: SmwTeam) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", t.id); p.set("layout", "teams"); });
  const handleViewMember = (m: SmwTeamMember) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", m.id); p.set("layout", "members"); });
  const closeForm = () => pushParams((p) => { p.delete("create"); p.delete("edit"); });
  const closeView = () => pushParams((p) => p.delete("view"));
  const handleSaved = (t: SmwTeam) => pushParams((p) => { p.delete("create"); p.delete("edit"); p.set("view", t.id); p.set("layout", "teams"); });

  const setLayout = (mode: LayoutMode) => pushParams((p) => { p.set("layout", mode); p.delete("view"); });

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setTeamFilter("all");
    setTerritoryFilter("all");
    setStatusFilter("all");
    pushParams((p) => { ["q", "team", "territory", "status", "rep"].forEach((k) => p.delete(k)); });
  };

  const activeFilters = [debouncedSearch, teamFilter !== "all", territoryFilter !== "all", statusFilter !== "all"].filter(Boolean).length;
  const displayCount = layout === "teams" ? filteredTeams.length : filteredMembers.length;

  useEffect(() => {
    if (editId && !editTeam) { toast.error("Team not found"); closeForm(); }
  }, [editId, editTeam]);

  useEffect(() => {
    if (viewId && layout === "teams" && !viewTeam && !createOpen && !editId) { toast.error("Team not found"); closeView(); }
    if (viewId && layout === "members" && !viewMember && !createOpen && !editId) { toast.error("Team member not found"); closeView(); }
  }, [viewId, viewTeam, viewMember, layout, createOpen, editId]);

  return (
    <>
      <TeamKpiStrip teams={teams} members={members} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input
          placeholder={layout === "teams" ? "Search teams…" : "Search reps…"}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-8 max-w-[220px] text-xs"
          aria-label="Search"
        />
        <Select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="h-8 w-[150px] text-xs" aria-label="Team">
          <option value="all">All teams</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </Select>
        <Select value={territoryFilter} onChange={(e) => setTerritoryFilter(e.target.value)} className="h-8 w-[140px] text-xs" aria-label="Territory">
          <option value="all">All territories</option>
          {SMW_LEAD_TERRITORIES.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </Select>
        {layout === "teams" && (
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 w-[130px] text-xs" aria-label="Status">
            <option value="all">All statuses</option>
            {(Object.keys(TEAM_STATUS_LABELS) as TeamStatus[]).map((s) => (
              <option key={s} value={s}>{TEAM_STATUS_LABELS[s]}</option>
            ))}
          </Select>
        )}
        {activeFilters > 0 && (
          <Button type="button" variant="ghost" size="sm" className="h-8" onClick={resetFilters}>
            <X className="mr-1 h-3.5 w-3.5" aria-hidden /> Clear
          </Button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-md border border-input p-0.5">
            <Button type="button" variant="ghost" size="sm" className={cn("h-7 gap-1 px-2 text-xs", layout === "members" && "bg-muted")} onClick={() => setLayout("members")}>
              <Users className="h-3.5 w-3.5" aria-hidden /> Members
            </Button>
            <Button type="button" variant="ghost" size="sm" className={cn("h-7 gap-1 px-2 text-xs", layout === "teams" && "bg-muted")} onClick={() => setLayout("teams")}>
              <UsersRound className="h-3.5 w-3.5" aria-hidden /> Teams
            </Button>
          </div>
          {layout === "teams" && (
            <Button type="button" size="sm" className="h-8" onClick={openCreate}>
              <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden /> New team
            </Button>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {displayCount} {layout === "teams" ? (displayCount === 1 ? "team" : "teams") : (displayCount === 1 ? "member" : "members")}
        {activeFilters > 0 ? " · filtered" : ""}
      </p>

      {displayCount === 0 ? (
        <div className="mt-4 flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm font-medium">Nothing found</p>
          {layout === "teams" && (
            <Button type="button" size="sm" className="mt-4" onClick={openCreate}>Create team</Button>
          )}
        </div>
      ) : layout === "teams" ? (
        <div className="mt-3">
          <TeamTable data={filteredTeams} onView={handleViewTeam} onEdit={handleEditTeam} />
        </div>
      ) : (
        <div className="mt-3">
          <TeamMemberTable data={filteredMembers} onView={handleViewMember} />
        </div>
      )}

      <TeamViewSheet
        open={!!viewTeam && !createOpen && !editTeam}
        onOpenChange={(o) => { if (!o) closeView(); }}
        team={viewTeam}
        onEdit={handleEditTeam}
        onViewMembers={(teamId) => { setLayout("members"); pushParams((p) => { p.set("team", teamId); p.delete("view"); }); }}
      />
      <TeamMemberViewSheet
        open={!!viewMember && !createOpen && !editTeam}
        onOpenChange={(o) => { if (!o) closeView(); }}
        member={viewMember}
      />
      <TeamFormSheet
        open={createOpen || !!editTeam}
        onOpenChange={(o) => { if (!o) closeForm(); }}
        mode={createOpen ? "create" : "edit"}
        team={editTeam}
        onSaved={handleSaved}
      />
    </>
  );
}

export function TeamWorkspace() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading teams…</p>}>
      <TeamWorkspaceContent />
    </Suspense>
  );
}

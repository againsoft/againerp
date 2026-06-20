"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Plus, Wrench } from "lucide-react";
import { toast } from "sonner";
import {
  daysInRepairStage,
  formatBdt,
  SERVICE_PRIORITY_LABELS,
  SERVICE_REPAIR_STAGE_LABELS,
  SERVICE_REPAIR_STAGES,
  serviceRepairsSeed,
  type ServiceRepairStage,
  type ServiceRepairTicket,
} from "@/lib/mock-data/service";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ServiceNav } from "./service-nav";
import { ServiceRepairFormSheet } from "./service-repair-form-sheet";
import { ServiceRepairViewSheet } from "./service-repair-view-sheet";

function priorityVariant(p: ServiceRepairTicket["priority"]): "warning" | "secondary" | "muted" {
  if (p === "critical" || p === "high") return "warning";
  if (p === "medium") return "secondary";
  return "muted";
}

function nextTicketNumber(tickets: ServiceRepairTicket[]): string {
  const nums = tickets
    .map((t) => {
      const m = t.ticketNumber.match(/REP\/2026\/(\d+)/);
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `REP/2026/${String(next).padStart(4, "0")}`;
}

export function ServiceRepairs() {
  const router = useRouter();
  const params = useSearchParams();

  const [tickets, setTickets] = useState<ServiceRepairTicket[]>(() => [...serviceRepairsSeed]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<ServiceRepairStage | "all">("all");

  const createOpen = params.get("create") === "1";
  const viewId = params.get("view");

  const viewTicket = useMemo(
    () => (viewId ? tickets.find((t) => t.id === viewId) ?? null : null),
    [viewId, tickets]
  );

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(params.toString());
      updater(p);
      router.push(`/service/repairs?${p.toString()}`, { scroll: false });
    },
    [router, params]
  );

  const openView = useCallback(
    (ticket: ServiceRepairTicket) => pushParams((p) => { p.delete("create"); p.set("view", ticket.id); }),
    [pushParams]
  );
  const openCreate = useCallback(
    () => pushParams((p) => { p.delete("view"); p.set("create", "1"); }),
    [pushParams]
  );
  const closeForm = useCallback(
    () => pushParams((p) => p.delete("create")),
    [pushParams]
  );
  const closeView = useCallback(
    () => pushParams((p) => p.delete("view")),
    [pushParams]
  );

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (stageFilter !== "all" && t.stage !== stageFilter) return false;
      if (!q) return true;
      return (
        t.ticketNumber.toLowerCase().includes(q) ||
        t.assetName.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.problem.toLowerCase().includes(q)
      );
    });
  }, [tickets, search, stageFilter]);

  const handleDrop = (stage: ServiceRepairStage) => {
    if (!draggingId) return;
    const ticket = tickets.find((t) => t.id === draggingId);
    if (!ticket || ticket.stage === stage || ticket.stage === "delivered") return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === draggingId
          ? { ...t, stage, stageEnteredAt: new Date().toISOString().slice(0, 10) }
          : t
      )
    );
    toast.success(`Moved to ${SERVICE_REPAIR_STAGE_LABELS[stage]}`);
    setDraggingId(null);
  };

  const handleSave = useCallback(
    (ticket: ServiceRepairTicket) => {
      setTickets((prev) => [ticket, ...prev]);
      closeForm();
      openView(ticket);
    },
    [closeForm, openView]
  );

  const handleStageChange = useCallback((ticketId: string, stage: ServiceRepairStage) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, stage, stageEnteredAt: new Date().toISOString().slice(0, 10) }
          : t
      )
    );
  }, []);

  const awaitingApproval = tickets.filter((t) => t.stage === "awaiting_approval").length;
  const staleCount = tickets.filter((t) => daysInRepairStage(t.stageEnteredAt) >= 5 && t.stage !== "delivered").length;
  const suggestedNumber = useMemo(() => nextTicketNumber(tickets), [tickets]);

  const columns = SERVICE_REPAIR_STAGES.map((stage) => ({
    stage,
    label: SERVICE_REPAIR_STAGE_LABELS[stage],
    items: filteredTickets.filter((t) => t.stage === stage),
  }));

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <ServiceNav compact />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Service › Repairs</p>
          <h1 className="page-title">
            Repair Queue
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({tickets.filter((t) => t.stage !== "delivered").length} active)
            </span>
          </h1>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button size="sm" onClick={openCreate} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Receive Asset
          </Button>
        </div>
      </div>

      {(awaitingApproval > 0 || staleCount > 0) && (
        <div className="space-y-2">
          {awaitingApproval > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              {awaitingApproval} repair{awaitingApproval > 1 ? "s" : ""} awaiting customer approval — follow up on quotes.
            </div>
          )}
          {staleCount > 0 && (
            <div className="rounded-lg border border-input bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-amber-600" />
              {staleCount} ticket{staleCount > 1 ? "s" : ""} in stage 5+ days — review bottlenecks.
            </div>
          )}
        </div>
      )}

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ticket, asset, customer, problem…"
          className="h-8 w-full max-w-xs text-xs"
        />
        <Select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as ServiceRepairStage | "all")}
          className="h-8 w-40 text-xs"
        >
          <option value="all">All stages</option>
          {SERVICE_REPAIR_STAGES.map((s) => (
            <option key={s} value={s}>{SERVICE_REPAIR_STAGE_LABELS[s]}</option>
          ))}
        </Select>
      </div>

      <div
        data-component="DS-KANBAN-BOARD"
        className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2"
      >
        {columns.map((col) => (
          <div
            key={col.stage}
            className="flex w-56 shrink-0 flex-col rounded-lg border border-input bg-muted/20"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.stage)}
          >
            <header className="border-b border-border px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold">{col.label}</h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                  {col.items.length}
                </span>
              </div>
            </header>
            <ul className="flex max-h-[calc(100vh-18rem)] flex-1 flex-col gap-2 overflow-y-auto p-2">
              {col.items.map((ticket) => {
                const days = daysInRepairStage(ticket.stageEnteredAt);
                return (
                  <li
                    key={ticket.id}
                    draggable={ticket.stage !== "delivered"}
                    onDragStart={() => setDraggingId(ticket.id)}
                    onDragEnd={() => setDraggingId(null)}
                    className={cn(
                      "cursor-grab rounded-md border border-input bg-card p-2.5 shadow-sm active:cursor-grabbing",
                      draggingId === ticket.id && "opacity-50",
                      ticket.stage === "delivered" && "cursor-default opacity-90",
                      days >= 5 && ticket.stage !== "delivered" && "border-amber-500/40"
                    )}
                  >
                    <button type="button" className="w-full text-left" onClick={() => openView(ticket)}>
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-mono text-[10px] text-muted-foreground">{ticket.ticketNumber}</p>
                        <Badge variant={priorityVariant(ticket.priority)} className="shrink-0 text-[9px]">
                          {SERVICE_PRIORITY_LABELS[ticket.priority]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs font-medium leading-snug">{ticket.assetName}</p>
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{ticket.customer}</p>
                      <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">{ticket.problem}</p>
                      <div className="mt-2 flex items-center justify-between gap-1 text-[10px]">
                        <span className={cn(days >= 5 && "font-medium text-amber-700 dark:text-amber-400")}>
                          {days}d in stage
                        </span>
                        {ticket.quoteAmount != null && (
                          <span className="tabular-nums font-medium">{formatBdt(ticket.quoteAmount)}</span>
                        )}
                      </div>
                      {ticket.technician && (
                        <p className="mt-1 text-[10px] text-muted-foreground">{ticket.technician}</p>
                      )}
                    </button>
                  </li>
                );
              })}
              {col.items.length === 0 && (
                <li className="rounded-md border border-dashed border-input p-4 text-center text-[10px] text-muted-foreground">
                  Drop here
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <Button
        size="sm"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg sm:hidden"
        onClick={openCreate}
        aria-label="Receive asset"
      >
        <Wrench className="h-5 w-5" />
      </Button>

      <ServiceRepairViewSheet
        open={!!viewTicket && !createOpen}
        ticket={viewTicket}
        onClose={closeView}
        onStageChange={handleStageChange}
      />

      <ServiceRepairFormSheet
        open={createOpen}
        onClose={closeForm}
        onSave={handleSave}
        nextNumber={suggestedNumber}
      />
    </div>
  );
}

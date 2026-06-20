"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Columns3,
  GanttChart,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  getScheduleSlotsForDate,
  getUnassignedOrdersCount,
  SERVICE_PRIORITY_LABELS,
  SERVICE_SCHEDULE_TODAY,
  SERVICE_TECHNICIANS,
  serviceScheduleSlotsSeed,
  type ServiceScheduleSlot,
  type ServiceScheduleSlotStatus,
} from "@/lib/mock-data/service";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServiceNav } from "./service-nav";
import { ServiceScheduleSlotSheet } from "./service-schedule-slot-sheet";

const VIEW_TABS = [
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "timeline", label: "Timeline", icon: GanttChart },
  { id: "board", label: "Board", icon: Columns3 },
] as const;

type ViewTab = (typeof VIEW_TABS)[number]["id"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

function parseDate(iso: string) {
  return new Date(iso + "T12:00:00");
}

function toIso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function slotStatusVariant(s: ServiceScheduleSlotStatus): "success" | "warning" | "secondary" | "muted" {
  if (s === "done") return "success";
  if (s === "in_progress") return "warning";
  if (s === "cancelled") return "muted";
  return "secondary";
}

function priorityBorder(p: ServiceScheduleSlot["priority"]) {
  if (p === "critical") return "border-l-destructive";
  if (p === "high") return "border-l-amber-500";
  if (p === "medium") return "border-l-indigo-500";
  return "border-l-muted-foreground/40";
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function ScheduleChip({
  slot,
  compact,
  onClick,
}: {
  slot: ServiceScheduleSlot;
  compact?: boolean;
  onClick: (slot: ServiceScheduleSlot) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(slot)}
      className={cn(
        "w-full rounded border border-input bg-card text-left hover:bg-muted/50",
        "border-l-4",
        priorityBorder(slot.priority),
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
      )}
    >
      <span className="font-mono text-[9px] text-muted-foreground">{slot.startTime}</span>
      {!compact && <span className="mx-1 text-muted-foreground">·</span>}
      <span className={cn(compact ? "block truncate" : "")}>{slot.serviceName}</span>
      {!compact && (
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{slot.customer}</p>
      )}
    </button>
  );
}

function CalendarView({
  slots,
  selectedDate,
  onSelectDate,
  onSelectSlot,
}: {
  slots: ServiceScheduleSlot[];
  selectedDate: string;
  onSelectDate: (iso: string) => void;
  onSelectSlot: (slot: ServiceScheduleSlot) => void;
}) {
  const selected = parseDate(selectedDate);
  const [viewMonth, setViewMonth] = useState(selected.getMonth());
  const [viewYear, setViewYear] = useState(selected.getFullYear());

  const slotsByDate = useMemo(() => {
    const map = new Map<string, ServiceScheduleSlot[]>();
    slots.forEach((s) => {
      const list = map.get(s.date) ?? [];
      list.push(s);
      map.set(s.date, list);
    });
    return map;
  }, [slots]);

  const grid = buildMonthGrid(viewYear, viewMonth);
  const daySlots = getScheduleSlotsForDate(selectedDate, slots);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
      <div className="min-w-0 flex-1 rounded-lg border border-input bg-card p-3">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{MONTH_NAMES[viewMonth]} {viewYear}</h2>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={prevMonth} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={nextMonth} aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px text-center text-[10px] font-medium text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {grid.map((cell, i) => {
            if (!cell) return <div key={`empty-${i}`} className="min-h-[72px]" />;
            const iso = toIso(cell);
            const dayItems = slotsByDate.get(iso) ?? [];
            const isSelected = iso === selectedDate;
            const isToday = iso === SERVICE_SCHEDULE_TODAY;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onSelectDate(iso)}
                className={cn(
                  "min-h-[72px] rounded-md border p-1 text-left text-xs transition-colors",
                  isSelected ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30" : "border-transparent hover:bg-muted/40",
                  isToday && !isSelected && "ring-1 ring-indigo-500/30"
                )}
              >
                <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px]", isToday && "bg-indigo-600 text-white")}>
                  {cell.getDate()}
                </span>
                {dayItems.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {dayItems.slice(0, 2).map((s) => (
                      <div key={s.id} className="truncate rounded bg-muted/60 px-1 text-[9px]">{s.startTime} {s.serviceName}</div>
                    ))}
                    {dayItems.length > 2 && (
                      <p className="text-[9px] text-muted-foreground">+{dayItems.length - 2} more</p>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full shrink-0 space-y-2 lg:w-80">
        <h3 className="text-sm font-semibold">
          {selectedDate}
          <span className="ml-2 font-normal text-muted-foreground">({daySlots.length} visits)</span>
        </h3>
        {daySlots.length === 0 ? (
          <p className="rounded-lg border border-dashed border-input p-6 text-center text-xs text-muted-foreground">
            No visits scheduled for this day.
          </p>
        ) : (
          daySlots.map((slot) => (
            <ScheduleChip key={slot.id} slot={slot} onClick={onSelectSlot} />
          ))
        )}
      </div>
    </div>
  );
}

function TimelineView({
  slots,
  selectedDate,
  onSelectSlot,
}: {
  slots: ServiceScheduleSlot[];
  selectedDate: string;
  onSelectSlot: (slot: ServiceScheduleSlot) => void;
}) {
  const daySlots = getScheduleSlotsForDate(selectedDate, slots);
  const dayStart = 8 * 60;
  const dayEnd = 19 * 60;
  const span = dayEnd - dayStart;

  return (
    <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-input bg-card">
      <div className="sticky top-0 z-10 flex border-b border-border bg-muted/50 text-[10px] font-medium text-muted-foreground">
        <div className="w-28 shrink-0 border-r border-border px-2 py-2">Technician</div>
        <div className="flex flex-1">
          {HOURS.map((h) => (
            <div key={h} className="flex-1 border-r border-border px-1 py-2 text-center last:border-r-0">
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>
      </div>
      {SERVICE_TECHNICIANS.map((tech) => {
        const techSlots = daySlots.filter((s) => s.technician === tech);
        return (
          <div key={tech} className="flex border-b border-border last:border-b-0">
            <div className="flex w-28 shrink-0 items-center border-r border-border px-2 py-3 text-xs font-medium">
              {tech.split(" ")[0]}
            </div>
            <div className="relative min-h-[56px] flex-1">
              {HOURS.slice(1).map((h) => (
                <div
                  key={h}
                  className="absolute top-0 bottom-0 border-l border-border/50"
                  style={{ left: `${((h - 8) / (HOURS.length - 1)) * 100}%` }}
                />
              ))}
              {techSlots.map((slot) => {
                const start = Math.max(timeToMinutes(slot.startTime), dayStart);
                const end = Math.min(timeToMinutes(slot.endTime), dayEnd);
                const left = ((start - dayStart) / span) * 100;
                const width = Math.max(((end - start) / span) * 100, 8);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSelectSlot(slot)}
                    className={cn(
                      "absolute top-1 bottom-1 overflow-hidden rounded px-1.5 py-0.5 text-left text-[10px]",
                      "border border-input bg-indigo-100 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200",
                      slot.status === "in_progress" && "bg-amber-100 dark:bg-amber-950/40",
                      slot.status === "done" && "bg-emerald-100 dark:bg-emerald-950/40"
                    )}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    title={`${slot.serviceName} · ${slot.customer}`}
                  >
                    <span className="block truncate font-medium">{slot.serviceName}</span>
                    <span className="truncate text-[9px] opacity-80">{slot.startTime}–{slot.endTime}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BoardView({
  slots,
  selectedDate,
  onSelectSlot,
}: {
  slots: ServiceScheduleSlot[];
  selectedDate: string;
  onSelectSlot: (slot: ServiceScheduleSlot) => void;
}) {
  const daySlots = getScheduleSlotsForDate(selectedDate, slots);

  return (
    <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2">
      {SERVICE_TECHNICIANS.map((tech) => {
        const techSlots = daySlots.filter((s) => s.technician === tech);
        const load = techSlots.length;
        return (
          <div key={tech} className="flex w-64 shrink-0 flex-col rounded-lg border border-input bg-muted/20">
            <div className="border-b border-border px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold">{tech}</p>
                <Badge variant="secondary" className="text-[9px]">{load} jobs</Badge>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-2">
              {techSlots.length === 0 ? (
                <p className="rounded-md border border-dashed border-input p-4 text-center text-[10px] text-muted-foreground">
                  No assignments
                </p>
              ) : (
                techSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSelectSlot(slot)}
                    className={cn(
                      "rounded-lg border border-input bg-card p-2.5 text-left text-xs hover:bg-muted/50",
                      "border-l-4",
                      priorityBorder(slot.priority)
                    )}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-mono text-[10px] text-muted-foreground">{slot.startTime}</span>
                      <Badge variant={slotStatusVariant(slot.status)} className="text-[9px] capitalize">
                        {slot.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="mt-1 font-medium leading-snug">{slot.serviceName}</p>
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{slot.customer}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{SERVICE_PRIORITY_LABELS[slot.priority]}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ServiceSchedule() {
  const router = useRouter();
  const params = useSearchParams();

  const tabParam = params.get("tab");
  const activeTab: ViewTab = VIEW_TABS.some((t) => t.id === tabParam) ? (tabParam as ViewTab) : "calendar";
  const dateParam = params.get("date") ?? SERVICE_SCHEDULE_TODAY;
  const slotId = params.get("slot");

  const [slots] = useState<ServiceScheduleSlot[]>(() => [...serviceScheduleSlotsSeed]);

  const selectedSlot = useMemo(
    () => (slotId ? slots.find((s) => s.id === slotId) ?? null : null),
    [slotId, slots]
  );

  const unassigned = getUnassignedOrdersCount();
  const todayCount = getScheduleSlotsForDate(SERVICE_SCHEDULE_TODAY, slots).length;

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(params.toString());
      updater(p);
      router.push(`/service/schedule?${p.toString()}`, { scroll: false });
    },
    [router, params]
  );

  const setTab = (tab: ViewTab) => pushParams((p) => { p.set("tab", tab); });
  const setDate = (date: string) => pushParams((p) => { p.set("date", date); });
  const openSlot = (slot: ServiceScheduleSlot) => pushParams((p) => p.set("slot", slot.id));
  const closeSlot = () => pushParams((p) => p.delete("slot"));

  const shiftDate = (days: number) => {
    const d = parseDate(dateParam);
    d.setDate(d.getDate() + days);
    setDate(toIso(d));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <ServiceNav compact />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Service › Schedule</p>
          <h1 className="page-title">
            Dispatch Schedule
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({todayCount} today)
            </span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/service/orders?create=1">+ New Order</Link>
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => toast.success("Auto-assign ran — 3 orders matched (prototype)")}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Auto-assign
          </Button>
        </div>
      </div>

      {unassigned > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          {unassigned} service order{unassigned > 1 ? "s" : ""} awaiting technician assignment —{" "}
          <Link href="/service/orders" className="font-medium underline">view queue</Link>
        </div>
      )}

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 rounded-lg border border-input bg-muted/30 p-1">
          {VIEW_TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTab === t.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => shiftDate(-1)} aria-label="Previous day">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-medium"
            onClick={() => setDate(SERVICE_SCHEDULE_TODAY)}
          >
            Today
          </Button>
          <span className="min-w-[7rem] text-center text-xs font-medium tabular-nums">{dateParam}</span>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => shiftDate(1)} aria-label="Next day">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="hidden shrink-0 grid-cols-3 gap-2 sm:grid">
        <div className="rounded-lg border border-input bg-card px-3 py-2 text-xs">
          <p className="text-muted-foreground">Visits on {dateParam}</p>
          <p className="text-lg font-semibold tabular-nums">{getScheduleSlotsForDate(dateParam, slots).length}</p>
        </div>
        <div className="rounded-lg border border-input bg-card px-3 py-2 text-xs">
          <p className="text-muted-foreground">Technicians active</p>
          <p className="flex items-center gap-1 text-lg font-semibold">
            <Users className="h-4 w-4 text-muted-foreground" />
            {new Set(getScheduleSlotsForDate(dateParam, slots).map((s) => s.technician)).size}
          </p>
        </div>
        <div className="rounded-lg border border-input bg-card px-3 py-2 text-xs">
          <p className="text-muted-foreground">In progress</p>
          <p className="text-lg font-semibold tabular-nums">
            {getScheduleSlotsForDate(dateParam, slots).filter((s) => s.status === "in_progress").length}
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {activeTab === "calendar" && (
          <CalendarView
            slots={slots}
            selectedDate={dateParam}
            onSelectDate={setDate}
            onSelectSlot={openSlot}
          />
        )}
        {activeTab === "timeline" && (
          <TimelineView slots={slots} selectedDate={dateParam} onSelectSlot={openSlot} />
        )}
        {activeTab === "board" && (
          <BoardView slots={slots} selectedDate={dateParam} onSelectSlot={openSlot} />
        )}
      </div>

      <ServiceScheduleSlotSheet
        open={!!selectedSlot}
        slot={selectedSlot}
        onClose={closeSlot}
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  CHEQUE_DIRECTION_LABELS,
  CHEQUE_STATUS_LABELS,
  formatBdt,
  type ChequeDirection,
  type ChequeInstrument,
} from "@/lib/mock-data/finance";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PROTOTYPE_TODAY = new Date("2026-06-19");
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ACTIVE_STATUSES = new Set(["issued", "deposited", "bounced"]);

function parseDate(iso: string) {
  return new Date(iso + "T12:00:00");
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
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

type DaySummary = {
  received: ChequeInstrument[];
  issued: ChequeInstrument[];
  receivedTotal: number;
  issuedTotal: number;
};

function groupByMaturity(cheques: ChequeInstrument[], directionFilter: string) {
  const filtered = cheques.filter((c) => {
    if (!ACTIVE_STATUSES.has(c.status)) return false;
    if (directionFilter !== "all" && c.direction !== directionFilter) return false;
    return true;
  });

  const byDate = new Map<string, DaySummary>();
  for (const c of filtered) {
    const key = c.maturityDate;
    const entry = byDate.get(key) ?? {
      received: [],
      issued: [],
      receivedTotal: 0,
      issuedTotal: 0,
    };
    if (c.direction === "received") {
      entry.received.push(c);
      entry.receivedTotal += c.amount;
    } else {
      entry.issued.push(c);
      entry.issuedTotal += c.amount;
    }
    byDate.set(key, entry);
  }
  return { filtered, byDate };
}

function ChequeRow({
  cheque,
  onView,
}: {
  cheque: ChequeInstrument;
  onView: (c: ChequeInstrument) => void;
}) {
  const isReceived = cheque.direction === "received";
  return (
    <button
      type="button"
      onClick={() => onView(cheque)}
      className="flex w-full items-center gap-2 rounded-md border border-input bg-card px-2 py-1.5 text-left text-xs hover:bg-muted/50"
    >
      {isReceived ? (
        <ArrowDownLeft className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
      )}
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[10px] text-muted-foreground">#{cheque.chequeNumber}</span>
        <span className="mx-1 text-muted-foreground">·</span>
        <span className="truncate">{cheque.party}</span>
      </div>
      <span className="shrink-0 tabular-nums font-medium">{formatBdt(cheque.amount)}</span>
      <Badge variant="secondary" className="shrink-0 text-[9px]">
        {CHEQUE_STATUS_LABELS[cheque.status]}
      </Badge>
    </button>
  );
}

export function ChequePdcCalendar({
  cheques,
  directionFilter,
  onView,
}: {
  cheques: ChequeInstrument[];
  directionFilter: string;
  onView: (c: ChequeInstrument) => void;
}) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-06-20");

  const { filtered, byDate } = useMemo(
    () => groupByMaturity(cheques, directionFilter),
    [cheques, directionFilter]
  );

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const overdue = useMemo(() => {
    return filtered
      .filter((c) => parseDate(c.maturityDate) < PROTOTYPE_TODAY)
      .sort((a, b) => a.maturityDate.localeCompare(b.maturityDate));
  }, [filtered]);

  const upcomingDates = useMemo(() => {
    return [...byDate.keys()]
      .filter((d) => parseDate(d) >= PROTOTYPE_TODAY)
      .sort()
      .slice(0, 14);
  }, [byDate]);

  const selectedCheques = selectedDate ? byDate.get(selectedDate) : null;

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* Month navigator */}
      <div className="flex shrink-0 items-center justify-between rounded-xl border border-input bg-card px-3 py-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 text-sm font-medium">
          <CalendarDays className="h-4 w-4 text-indigo-600" />
          {MONTH_NAMES[month]} {year}
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-5">
        {/* Calendar grid */}
        <div className="lg:col-span-3 flex flex-col rounded-xl border border-input bg-card p-3">
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`pad-${i}`} className="min-h-[72px]" />;
              const iso = toIso(day);
              const summary = byDate.get(iso);
              const isToday = sameDay(day, PROTOTYPE_TODAY);
              const isSelected = selectedDate === iso;
              const isPast = day < PROTOTYPE_TODAY && summary;
              const hasItems = summary && (summary.received.length + summary.issued.length > 0);

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate(iso)}
                  className={cn(
                    "min-h-[72px] rounded-lg border p-1 text-left transition-colors",
                    isSelected
                      ? "border-indigo-400 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40"
                      : "border-transparent hover:border-input hover:bg-muted/40",
                    isToday && !isSelected && "ring-1 ring-indigo-300 dark:ring-indigo-700"
                  )}
                >
                  <span
                    className={cn(
                      "text-[11px] font-medium",
                      isToday && "text-indigo-600 dark:text-indigo-400"
                    )}
                  >
                    {day.getDate()}
                  </span>
                  {hasItems && (
                    <div className="mt-1 space-y-0.5">
                      {summary.received.length > 0 && (
                        <div className="truncate rounded bg-emerald-100 px-1 text-[9px] text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                          ↓ {summary.received.length} · {formatBdt(summary.receivedTotal)}
                        </div>
                      )}
                      {summary.issued.length > 0 && (
                        <div className="truncate rounded bg-amber-100 px-1 text-[9px] text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                          ↑ {summary.issued.length} · {formatBdt(summary.issuedTotal)}
                        </div>
                      )}
                      {isPast && (
                        <div className="text-[8px] text-amber-600 dark:text-amber-400">overdue</div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded bg-emerald-500" /> Collect (received)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded bg-amber-500" /> Pay (issued)
            </span>
          </div>
        </div>

        {/* Side panel: selected day + overdue */}
        <div className="lg:col-span-2 flex min-h-0 flex-col gap-3 overflow-y-auto">
          {overdue.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
              <h3 className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Overdue ({overdue.length})
              </h3>
              <div className="mt-2 space-y-1">
                {overdue.slice(0, 4).map((c) => (
                  <ChequeRow key={c.id} cheque={c} onView={onView} />
                ))}
                {overdue.length > 4 && (
                  <p className="text-[10px] text-muted-foreground">+{overdue.length - 4} more</p>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-input bg-card p-3">
            <h3 className="text-xs font-semibold">
              {selectedDate
                ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                : "Select a date"}
            </h3>
            {selectedCheques ? (
              <div className="mt-3 space-y-3">
                {selectedCheques.received.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                      Collect — {CHEQUE_DIRECTION_LABELS.received} ({formatBdt(selectedCheques.receivedTotal)})
                    </p>
                    <div className="space-y-1">
                      {selectedCheques.received.map((c) => (
                        <ChequeRow key={c.id} cheque={c} onView={onView} />
                      ))}
                    </div>
                  </div>
                )}
                {selectedCheques.issued.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                      Pay — {CHEQUE_DIRECTION_LABELS.issued} ({formatBdt(selectedCheques.issuedTotal)})
                    </p>
                    <div className="space-y-1">
                      {selectedCheques.issued.map((c) => (
                        <ChequeRow key={c.id} cheque={c} onView={onView} />
                      ))}
                    </div>
                  </div>
                )}
                {selectedCheques.received.length === 0 && selectedCheques.issued.length === 0 && (
                  <p className="text-xs text-muted-foreground">No cheques due on this date.</p>
                )}
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">Click a calendar day to see due cheques.</p>
            )}
          </div>

          <div className="rounded-xl border border-input bg-card p-3">
            <h3 className="text-xs font-semibold">Upcoming 14 days</h3>
            <div className="mt-2 space-y-2">
              {upcomingDates.length === 0 ? (
                <p className="text-xs text-muted-foreground">No upcoming PDC in schedule.</p>
              ) : (
                upcomingDates.map((date) => {
                  const s = byDate.get(date)!;
                  const total = s.receivedTotal + s.issuedTotal;
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-muted/50",
                        selectedDate === date && "bg-muted/50"
                      )}
                    >
                      <span>{new Date(date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                      <span className="text-muted-foreground">
                        {s.received.length + s.issued.length} chq · {formatBdt(total)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

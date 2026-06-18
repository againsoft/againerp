import { EssPage } from "@/components/ess/ess-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ESS_ATTENDANCE_DAYS, getEssEmployeeContext } from "@/lib/mock-data/ess-portal";

export default function EssAttendancePage() {
  const { profile } = getEssEmployeeContext();

  return (
    <EssPage>
        <div className="rounded-xl border border-input bg-card p-4">
          <p className="text-[11px] text-muted-foreground">This month</p>
          <p className="text-2xl font-semibold tabular-nums">{profile.stats.attendanceRate}</p>
          <p className="text-xs text-muted-foreground">Attendance rate</p>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="h-9" disabled>
            Request correction
          </Button>
        </div>

        <div className="space-y-2 md:hidden">
          {ESS_ATTENDANCE_DAYS.map((day) => (
            <div key={day.date} className="rounded-lg border border-input p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{day.date}</p>
                  <p className="text-[11px] text-muted-foreground">{day.day}</p>
                </div>
                <StatusBadge status={day.status} />
              </div>
              <dl className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <dt className="text-muted-foreground">In</dt>
                  <dd className="font-medium tabular-nums">{day.checkIn}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Out</dt>
                  <dd className="font-medium tabular-nums">{day.checkOut}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Hours</dt>
                  <dd className="font-medium tabular-nums">{day.hours}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-lg border border-input md:block">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Check in</th>
                <th className="px-3 py-2 font-medium">Check out</th>
                <th className="px-3 py-2 font-medium">Hours</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {ESS_ATTENDANCE_DAYS.map((day) => (
                <tr key={day.date} className="border-b border-border/40">
                  <td className="px-3 py-2">{day.date}</td>
                  <td className="px-3 py-2 tabular-nums">{day.checkIn}</td>
                  <td className="px-3 py-2 tabular-nums">{day.checkOut}</td>
                  <td className="px-3 py-2 tabular-nums">{day.hours}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={day.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EssPage>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "present" ? "success" : status === "late" ? "warning" : status === "weekend" ? "muted" : "secondary";
  return (
    <Badge variant={variant} className="text-[10px] capitalize">
      {status}
    </Badge>
  );
}

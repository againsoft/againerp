import { EssPage } from "@/components/ess/ess-page";
import { Badge } from "@/components/ui/badge";
import { ESS_TRAINING } from "@/lib/mock-data/ess-portal";
import { cn } from "@/lib/utils";

export default function EssTrainingPage() {
  return (
    <EssPage>
        <ul className="space-y-3">
          {ESS_TRAINING.map((course) => (
            <li key={course.id} className="rounded-xl border border-input p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{course.title}</p>
                {course.mandatory ? (
                  <Badge variant="outline" className="text-[9px]">
                    Mandatory
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Due {course.due}</p>
              <div className="mt-3">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium tabular-nums">{course.progress}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      course.progress === 100 ? "bg-emerald-500" : "bg-primary",
                    )}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
    </EssPage>
  );
}

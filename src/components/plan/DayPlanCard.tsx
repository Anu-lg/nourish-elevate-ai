import { cn } from "@/lib/utils";
import { DietDayCard } from "@/components/plan/DietDayCard";
import { WorkoutDayCard } from "@/components/plan/WorkoutDayCard";
import type { DietDay } from "@/lib/diet-generation.server";
import type { WorkoutDay } from "@/lib/workout-types";

const DAY_COLORS: Record<string, string> = {
  Monday:    "from-primary/10 to-primary/5",
  Tuesday:   "from-sky-500/10 to-sky-500/5",
  Wednesday: "from-violet-500/10 to-violet-500/5",
  Thursday:  "from-amber-500/10 to-amber-500/5",
  Friday:    "from-rose-500/10 to-rose-500/5",
  Saturday:  "from-emerald-500/10 to-emerald-500/5",
  Sunday:    "from-orange-500/10 to-orange-500/5",
};

const DAY_BADGES: Record<string, string> = {
  Monday:    "bg-primary/15 text-primary",
  Tuesday:   "bg-sky-100 text-sky-700",
  Wednesday: "bg-violet-100 text-violet-700",
  Thursday:  "bg-amber-100 text-amber-700",
  Friday:    "bg-rose-100 text-rose-700",
  Saturday:  "bg-emerald-100 text-emerald-700",
  Sunday:    "bg-orange-100 text-orange-700",
};

interface DayPlanCardProps {
  day: string;
  diet: DietDay;
  workout: WorkoutDay;
}

export function DayPlanCard({ day, diet, workout }: DayPlanCardProps) {
  const gradient = DAY_COLORS[day] ?? "from-muted/30 to-muted/10";
  const badge    = DAY_BADGES[day] ?? "bg-muted text-muted-foreground";

  return (
    <div className={cn(
      "rounded-3xl border border-border bg-gradient-to-b p-5 shadow-soft sm:p-6",
      gradient,
    )}>
      {/* Day header */}
      <div className="mb-4 flex items-center gap-3">
        <span className={cn("rounded-full px-3.5 py-1 text-sm font-semibold", badge)}>
          {day}
        </span>
        {workout.type === "rest" && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs text-slate-500">
            Rest Day
          </span>
        )}
      </div>

      <div className="space-y-3">
        <DietDayCard diet={diet} />
        <WorkoutDayCard workout={workout} />
      </div>
    </div>
  );
}

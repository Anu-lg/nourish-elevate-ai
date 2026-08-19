import { cn } from "@/lib/utils";
import type { DietDay } from "@/lib/diet-generation.server";
import type { WorkoutDay } from "@/lib/workout-types";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DAY_ACCENT: Record<string, { active: string; dot: string; ring: string }> = {
  Monday:    { active: "bg-primary text-primary-foreground",        dot: "bg-primary",        ring: "ring-primary/30" },
  Tuesday:   { active: "bg-sky-500 text-white",                     dot: "bg-sky-500",         ring: "ring-sky-300/40" },
  Wednesday: { active: "bg-violet-500 text-white",                  dot: "bg-violet-500",      ring: "ring-violet-300/40" },
  Thursday:  { active: "bg-amber-500 text-white",                   dot: "bg-amber-500",       ring: "ring-amber-300/40" },
  Friday:    { active: "bg-rose-500 text-white",                    dot: "bg-rose-500",        ring: "ring-rose-300/40" },
  Saturday:  { active: "bg-emerald-500 text-white",                 dot: "bg-emerald-500",     ring: "ring-emerald-300/40" },
  Sunday:    { active: "bg-orange-500 text-white",                  dot: "bg-orange-500",      ring: "ring-orange-300/40" },
};

// Compute avg calories across the week for the progress bar scale
function getMaxCalories(dietDays: DietDay[]): number {
  return Math.max(...dietDays.map(d => d.calories), 1);
}

interface WeeklyOverviewProps {
  selectedDay: string;
  onSelectDay: (day: string) => void;
  dietDays: DietDay[];
  workoutDays: WorkoutDay[];
}

export function WeeklyOverview({ selectedDay, onSelectDay, dietDays, workoutDays }: WeeklyOverviewProps) {
  const maxCal = getMaxCalories(dietDays);

  return (
    <div className="rounded-3xl border border-border bg-card/95 p-5 shadow-soft backdrop-blur-sm">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Weekly Overview
      </p>

      {/* Day selector */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((day, i) => {
          const isActive  = day === selectedDay;
          const workout   = workoutDays.find(w => w.day === day);
          const isRest    = workout?.type === "rest" || !workout;
          const diet      = dietDays.find(d => d.day === day);
          const cal       = diet?.calories ?? 0;
          const calPct    = Math.round((cal / maxCal) * 100);
          const accent    = DAY_ACCENT[day] ?? DAY_ACCENT["Monday"]!;

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              aria-pressed={isActive}
              aria-label={day}
              className={cn(
                "group flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition-all duration-200",
                isActive
                  ? `border-transparent shadow-soft ring-2 ${accent.ring} ${accent.active}`
                  : "border-border bg-background hover:border-primary/30 hover:bg-secondary/50",
              )}
            >
              {/* Short day label */}
              <span className={cn(
                "text-[10px] font-semibold",
                isActive ? "text-current opacity-90" : "text-muted-foreground",
              )}>
                {SHORT[i]}
              </span>

              {/* Workout / rest indicator */}
              <span className={cn(
                "grid size-5 place-items-center rounded-full text-[9px]",
                isActive ? "bg-white/20" : isRest ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
              )}>
                {isRest ? "💤" : "🏋"}
              </span>

              {/* Calorie mini-bar */}
              <div className={cn(
                "h-1 w-full overflow-hidden rounded-full",
                isActive ? "bg-white/25" : "bg-muted",
              )}>
                <div
                  className={cn("h-full rounded-full transition-all duration-500", isActive ? "bg-white/60" : accent.dot)}
                  style={{ width: `${calPct}%` }}
                />
              </div>

              {/* Calorie label */}
              {cal > 0 && (
                <span className={cn(
                  "text-[9px] font-medium",
                  isActive ? "opacity-80" : "text-muted-foreground",
                )}>
                  {(cal / 1000).toFixed(1)}k
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

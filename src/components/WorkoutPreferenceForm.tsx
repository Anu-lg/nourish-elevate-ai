import { useState } from "react";
import { Home, Dumbbell, PersonStanding, Wrench, ArrowRight, Settings2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { WorkoutPreference } from "@/lib/workout-types";

const preferences: {
  value: WorkoutPreference;
  label: string;
  desc: string;
  icon: React.ElementType;
  bg: string;
  color: string;
}[] = [
  { value: "home",             label: "Home",             desc: "Minimal space, no special equipment needed.",        icon: Home,          bg: "bg-sky-50",     color: "text-sky-600" },
  { value: "gym",              label: "Full Gym",         desc: "Barbells, machines, cables — the full setup.",       icon: Dumbbell,      bg: "bg-violet-50",  color: "text-violet-600" },
  { value: "bodyweight",       label: "Bodyweight",       desc: "Zero equipment — just your own body.",                icon: PersonStanding, bg: "bg-emerald-50", color: "text-emerald-600" },
  { value: "equipment-based",  label: "Equipment-Based",  desc: "Dumbbells, bands, kettlebells and similar tools.",   icon: Wrench,        bg: "bg-orange-50",  color: "text-orange-500" },
];

export interface WorkoutPreferenceValues {
  workoutPreference: WorkoutPreference;
  workoutsPerWeek: number;
}

interface WorkoutPreferenceFormProps {
  onComplete?: (values: WorkoutPreferenceValues) => void;
}

export function WorkoutPreferenceForm({ onComplete }: WorkoutPreferenceFormProps) {
  const [selected, setSelected]       = useState<WorkoutPreference | null>(null);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [touched, setTouched]         = useState(false);

  function handleContinue() {
    setTouched(true);
    if (!selected) return;
    onComplete?.({ workoutPreference: selected, workoutsPerWeek: daysPerWeek });
  }

  return (
    <div className="space-y-7">
      {/* ── Workout preference ─────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
            <Settings2 className="size-3.5" />
          </span>
          <span className="text-sm font-medium text-foreground">
            Workout Preference <span className="text-destructive">*</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {preferences.map(({ value, label, desc, icon: Icon, bg, color }) => {
            const isActive = selected === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={isActive}
                onClick={() => { setSelected(value); setTouched(false); }}
                className={cn(
                  "relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5",
                  isActive
                    ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary/30"
                    : "border-border bg-background hover:border-primary/30 hover:bg-secondary/50",
                )}
              >
                {isActive && (
                  <span className="absolute right-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  </span>
                )}
                <span className={cn(
                  "mb-2.5 grid size-9 place-items-center rounded-xl transition-colors",
                  isActive ? "gradient-primary text-primary-foreground shadow-soft" : cn(bg, color),
                )}>
                  <Icon className="size-4.5" />
                </span>
                <p className={cn("text-sm font-semibold", isActive ? "text-primary" : "text-foreground")}>{label}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{desc}</p>
              </button>
            );
          })}
        </div>

        {touched && !selected && (
          <p className="mt-2 text-xs text-destructive">Please select a workout preference.</p>
        )}
      </div>

      {/* ── Days per week stepper ───────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
            <Dumbbell className="size-3.5" />
          </span>
          <span className="text-sm font-medium text-foreground">Workout Days Per Week</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setDaysPerWeek(d => Math.max(2, d - 1))}
            className="grid size-10 place-items-center rounded-xl border border-border bg-background transition-colors hover:bg-secondary disabled:opacity-40"
            disabled={daysPerWeek <= 2}
            aria-label="Decrease days"
          >
            <Minus className="size-4" />
          </button>

          <div className="flex min-w-[4rem] flex-col items-center">
            <span className="font-display text-3xl font-semibold text-primary">{daysPerWeek}</span>
            <span className="text-xs text-muted-foreground">days / week</span>
          </div>

          <button
            type="button"
            onClick={() => setDaysPerWeek(d => Math.min(6, d + 1))}
            className="grid size-10 place-items-center rounded-xl border border-border bg-background transition-colors hover:bg-secondary disabled:opacity-40"
            disabled={daysPerWeek >= 6}
            aria-label="Increase days"
          >
            <Plus className="size-4" />
          </button>

          <p className="ml-2 text-xs text-muted-foreground">
            {7 - daysPerWeek} rest day{7 - daysPerWeek !== 1 ? "s" : ""} per week
          </p>
        </div>
      </div>

      <Button type="button" variant="hero" size="lg" className="w-full" onClick={handleContinue}>
        Generate My Plan <ArrowRight />
      </Button>
    </div>
  );
}

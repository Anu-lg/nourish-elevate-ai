import { Timer, RotateCcw, Target, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkoutDay, Exercise } from "@/lib/workout-types";

const DIFFICULTY_STYLES: Record<Exercise["difficulty"], string> = {
  easy:     "bg-emerald-100 text-emerald-700",
  moderate: "bg-amber-100 text-amber-700",
  hard:     "bg-red-100 text-red-700",
};

function ExerciseRow({ ex }: { ex: Exercise }) {
  const volume = ex.reps != null
    ? `${ex.sets} × ${ex.reps} reps`
    : `${ex.sets} × ${ex.duration_seconds}s`;

  return (
    <li className="flex items-start gap-3 rounded-xl border border-violet-100 bg-white/70 p-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">{ex.name}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", DIFFICULTY_STYLES[ex.difficulty])}>
            {ex.difficulty}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <RotateCcw className="size-3" /> {volume}
          </span>
          <span className="flex items-center gap-1">
            <Timer className="size-3" /> {ex.rest_seconds}s rest
          </span>
          <span className="flex items-center gap-1">
            <Target className="size-3" /> {ex.target_muscle}
          </span>
        </div>

        {ex.notes && (
          <p className="mt-1.5 text-xs italic text-muted-foreground">{ex.notes}</p>
        )}
      </div>
    </li>
  );
}

interface WorkoutDayCardProps {
  workout: WorkoutDay;
}

export function WorkoutDayCard({ workout }: WorkoutDayCardProps) {
  if (workout.type === "rest") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
        <span className="grid size-8 place-items-center rounded-xl bg-slate-100 text-slate-400">
          <Moon className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-600">🏋️ Rest Day</p>
          <p className="text-xs text-muted-foreground">Recovery — let your body rebuild.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-base">🏋️</span>
        <span className="text-sm font-semibold text-violet-800">Workout</span>
        {workout.focus && (
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
            {workout.focus}
          </span>
        )}
        {workout.duration_minutes && (
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Timer className="size-3" /> ~{workout.duration_minutes} min
          </span>
        )}
      </div>

      <ul className="space-y-2">
        {workout.exercises.map((ex, i) => (
          <ExerciseRow key={i} ex={ex} />
        ))}
      </ul>
    </div>
  );
}

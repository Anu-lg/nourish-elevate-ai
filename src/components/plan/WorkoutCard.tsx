import { useState } from "react";
import { Timer, RotateCcw, Target, Moon, ChevronDown, Dumbbell, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkoutDay, Exercise } from "@/lib/workout-types";
import { ExerciseImage } from "./ExerciseImage";

const DIFFICULTY_CONFIG: Record<Exercise["difficulty"], { label: string; cls: string; bar: string }> = {
  easy:     { label: "Easy",     cls: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-400" },
  moderate: { label: "Moderate", cls: "bg-amber-100  text-amber-700",   bar: "bg-amber-400" },
  hard:     { label: "Hard",     cls: "bg-red-100    text-red-700",     bar: "bg-red-400" },
};

function DifficultyBar({ difficulty }: { difficulty: Exercise["difficulty"] }) {
  const levels = ["easy", "moderate", "hard"] as const;
  const active = levels.indexOf(difficulty);
  return (
    <div className="flex gap-0.5">
      {levels.map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-4 rounded-full",
            i <= active ? DIFFICULTY_CONFIG[difficulty].bar : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

function ExerciseRow({ ex, index }: { ex: Exercise; index: number }) {
  const [open, setOpen] = useState(false);
  const volume = ex.reps != null
    ? `${ex.sets} × ${ex.reps} reps`
    : `${ex.sets} × ${ex.duration_seconds}s`;
  const diff = DIFFICULTY_CONFIG[ex.difficulty];

  return (
    <li className="overflow-hidden rounded-2xl border border-violet-100 bg-white/80">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-3 p-3.5 text-left transition-colors hover:bg-violet-50/50"
      >
        {/* Exercise image */}
        <ExerciseImage exerciseName={ex.name} />

        {/* Index bubble */}
        <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-violet-100 text-[11px] font-bold text-violet-600">
          {index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">{ex.name}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", diff.cls)}>
              {diff.label}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><RotateCcw className="size-3" />{volume}</span>
            <span className="flex items-center gap-1"><Timer className="size-3" />{ex.rest_seconds}s rest</span>
            <span className="flex items-center gap-1"><Target className="size-3" />{ex.target_muscle}</span>
          </div>
        </div>

        <DifficultyBar difficulty={ex.difficulty} />
        <ChevronDown className={cn("ml-1 size-4 shrink-0 text-violet-400 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {/* Expanded detail */}
      <div className={cn("overflow-hidden transition-all duration-200", open ? "max-h-40" : "max-h-0")}>
        <div className="grid grid-cols-3 gap-2 border-t border-violet-100 bg-violet-50/40 px-4 py-3 text-center text-xs">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Sets</p>
            <p className="mt-0.5 text-base font-bold text-violet-700">{ex.sets}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {ex.reps != null ? "Reps" : "Duration"}
            </p>
            <p className="mt-0.5 text-base font-bold text-violet-700">
              {ex.reps != null ? ex.reps : `${ex.duration_seconds}s`}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Rest</p>
            <p className="mt-0.5 text-base font-bold text-violet-700">{ex.rest_seconds}s</p>
          </div>
        </div>
        {ex.notes && (
          <p className="border-t border-violet-100 px-4 py-2 text-xs italic text-muted-foreground">
            💡 {ex.notes}
          </p>
        )}
      </div>
    </li>
  );
}

interface WorkoutCardProps {
  workout: WorkoutDay;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const [expanded, setExpanded] = useState(true);

  if (workout.type === "rest") {
    return (
      <section className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50/60 px-5 py-5 shadow-soft">
        <span className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-2xl">💤</span>
        <div>
          <p className="text-sm font-semibold text-slate-700">Rest &amp; Recovery Day</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Let your muscles recover and rebuild. Stay hydrated and prioritise sleep.
          </p>
        </div>
      </section>
    );
  }

  const easyCount    = workout.exercises.filter(e => e.difficulty === "easy").length;
  const moderateCount = workout.exercises.filter(e => e.difficulty === "moderate").length;
  const hardCount    = workout.exercises.filter(e => e.difficulty === "hard").length;

  return (
    <section className="overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white shadow-soft">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-violet-50/50"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-violet-100 text-violet-600">
          🏋️
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-violet-800">Workout Plan</p>
          <p className="text-xs text-violet-600/70">
            {workout.focus && <span className="mr-2">{workout.focus}</span>}
            {workout.exercises.length} exercises
            {workout.duration_minutes && ` · ~${workout.duration_minutes} min`}
          </p>
        </div>

        {/* Difficulty summary */}
        <div className="hidden items-center gap-1.5 sm:flex">
          {easyCount > 0     && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{easyCount} easy</span>}
          {moderateCount > 0 && <span className="rounded-full bg-amber-100  px-2 py-0.5 text-[10px] font-semibold text-amber-700">{moderateCount} mod</span>}
          {hardCount > 0     && <span className="rounded-full bg-red-100    px-2 py-0.5 text-[10px] font-semibold text-red-700">{hardCount} hard</span>}
        </div>

        {/* Intensity bar */}
        <div className="hidden w-16 sm:block">
          <div className="flex h-1.5 overflow-hidden rounded-full bg-violet-100">
            {workout.exercises.map((ex, i) => (
              <div
                key={i}
                className={cn("flex-1", DIFFICULTY_CONFIG[ex.difficulty].bar)}
                style={{ marginRight: i < workout.exercises.length - 1 ? 1 : 0 }}
              />
            ))}
          </div>
          <p className="mt-0.5 text-center text-[10px] text-violet-400">intensity</p>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Zap className="size-3.5 text-violet-400" />
        </div>
        <ChevronDown className={cn("size-4 text-violet-400 transition-transform duration-300", expanded && "rotate-180")} />
      </button>

      {/* Focus + stats strip */}
      {workout.focus && (
        <div className="flex items-center gap-2 border-t border-violet-100 bg-violet-50/40 px-5 py-2">
          <Dumbbell className="size-3.5 text-violet-500" />
          <span className="text-xs font-medium text-violet-600">{workout.focus}</span>
          {workout.duration_minutes && (
            <>
              <span className="text-violet-200">·</span>
              <Timer className="size-3 text-violet-400" />
              <span className="text-xs text-violet-500">~{workout.duration_minutes} min session</span>
            </>
          )}
        </div>
      )}

      {/* Exercise list */}
      <div className={cn("overflow-hidden transition-all duration-300", expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0")}>
        <ul className="space-y-2 px-5 pb-5 pt-3">
          {workout.exercises.map((ex, i) => (
            <ExerciseRow key={i} ex={ex} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

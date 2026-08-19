import { useState } from "react";
import {
  TrendingUp, TrendingDown, Flame, Dumbbell, Zap, Heart,
  Leaf, Beef, Activity, Home, Wrench, PersonStanding,
  Minus, Plus, SlidersHorizontal, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose,
} from "@/components/ui/sheet";
import type { FitnessGoal, FoodPreference, ActivityLevel } from "@/context/UserProfileContext";
import type { WorkoutPreference } from "@/lib/workout-types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActivePrefs {
  fitnessGoal: FitnessGoal;
  foodPreference: FoodPreference;
  activityLevel: ActivityLevel;
  workoutPreference: WorkoutPreference;
  workoutsPerWeek: number;
}

// ─── Option data ──────────────────────────────────────────────────────────────

const GOALS: { value: FitnessGoal; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { value: "weight-gain",     label: "Weight Gain",     icon: TrendingUp,   color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "weight-loss",     label: "Weight Loss",     icon: TrendingDown, color: "text-sky-600",     bg: "bg-sky-50" },
  { value: "fat-loss",        label: "Fat Loss",        icon: Flame,        color: "text-orange-500",  bg: "bg-orange-50" },
  { value: "muscle-building", label: "Muscle Building", icon: Dumbbell,     color: "text-violet-600",  bg: "bg-violet-50" },
  { value: "strength",        label: "Strength",        icon: Zap,          color: "text-yellow-600",  bg: "bg-yellow-50" },
  { value: "general-fitness", label: "General Fitness", icon: Heart,        color: "text-rose-500",    bg: "bg-rose-50" },
];

const FOOD_PREFS: { value: FoodPreference; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { value: "vegetarian",     label: "Vegetarian",     icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "non-vegetarian", label: "Non-Vegetarian", icon: Beef, color: "text-orange-600",  bg: "bg-orange-50" },
];

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: "sedentary",         label: "Sedentary",         desc: "Little or no exercise" },
  { value: "lightly-active",    label: "Lightly Active",    desc: "1–3 days/week" },
  { value: "moderately-active", label: "Moderately Active", desc: "3–5 days/week" },
  { value: "very-active",       label: "Very Active",       desc: "6–7 days/week" },
];

const WORKOUT_PREFS: { value: WorkoutPreference; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { value: "home",             label: "Home",         icon: Home,          color: "text-sky-600",    bg: "bg-sky-50" },
  { value: "gym",              label: "Full Gym",     icon: Dumbbell,      color: "text-violet-600", bg: "bg-violet-50" },
  { value: "bodyweight",       label: "Bodyweight",   icon: PersonStanding, color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "equipment-based",  label: "Equipment",   icon: Wrench,        color: "text-orange-500", bg: "bg-orange-50" },
];

// ─── Tiny reusable pill selector ──────────────────────────────────────────────

function PillGrid<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: React.ElementType; color?: string; bg?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(opt => {
        const isActive = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-150",
              isActive
                ? "border-primary bg-primary/8 font-semibold text-primary shadow-soft"
                : "border-border bg-background text-foreground hover:border-primary/30 hover:bg-secondary/50",
            )}
          >
            {Icon && (
              <span className={cn(
                "grid size-6 shrink-0 place-items-center rounded-md transition-colors",
                isActive ? "bg-primary/15 text-primary" : cn(opt.bg, opt.color),
              )}>
                <Icon className="size-3.5" />
              </span>
            )}
            <span className="truncate">{opt.label}</span>
            {isActive && <Check className="ml-auto size-3.5 shrink-0 text-primary" />}
          </button>
        );
      })}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
      {label}
    </p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface CustomizeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current: ActivePrefs;
  onApply: (prefs: ActivePrefs) => void;
}

export function CustomizeSheet({ open, onOpenChange, current, onApply }: CustomizeSheetProps) {
  // Local draft — only committed on Apply
  const [draft, setDraft] = useState<ActivePrefs>(current);

  // Reset draft to current whenever sheet opens
  function handleOpenChange(v: boolean) {
    if (v) setDraft(current);
    onOpenChange(v);
  }

  function set<K extends keyof ActivePrefs>(key: K, value: ActivePrefs[K]) {
    setDraft(d => ({ ...d, [key]: value }));
  }

  function handleApply() {
    onApply(draft);
    onOpenChange(false);
  }

  const changedCount = (Object.keys(draft) as (keyof ActivePrefs)[]).filter(
    k => draft[k] !== current[k],
  ).length;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-md">
        {/* ── Header ── */}
        <SheetHeader className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
              <SlidersHorizontal className="size-4" />
            </span>
            <div>
              <SheetTitle className="text-base">Customize Your Plan</SheetTitle>
              <SheetDescription className="text-xs">
                Changes apply to both diet and workout generation.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* ── Body ── */}
        <div className="flex-1 space-y-6 px-6 py-5">

          {/* Fitness Goal */}
          <div>
            <SectionLabel label="Fitness Goal" />
            <PillGrid options={GOALS} value={draft.fitnessGoal} onChange={v => set("fitnessGoal", v)} />
          </div>

          {/* Food Preference */}
          <div>
            <SectionLabel label="Food Preference" />
            <PillGrid options={FOOD_PREFS} value={draft.foodPreference} onChange={v => set("foodPreference", v)} />
            {draft.foodPreference === "vegetarian" && (
              <p className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                🌿 Strict vegetarian mode — all meals will be 100% plant-based. No meat, fish, or eggs.
              </p>
            )}
            {draft.foodPreference === "non-vegetarian" && current.foodPreference === "vegetarian" && (
              <p className="mt-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700">
                🍗 Non-vegetarian mode — AI may include meat, fish, and eggs in your meals.
              </p>
            )}
            {draft.foodPreference !== current.foodPreference && (
              <p className="mt-1.5 text-xs text-amber-600">
                ⚠️ Diet generation rules will change — your entire meal plan will be regenerated.
              </p>
            )}
          </div>

          {/* Activity Level */}
          <div>
            <SectionLabel label="Activity Level" />
            <div className="grid grid-cols-1 gap-2">
              {ACTIVITY_LEVELS.map(opt => {
                const isActive = opt.value === draft.activityLevel;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("activityLevel", opt.value)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-150",
                      isActive
                        ? "border-primary bg-primary/8 shadow-soft"
                        : "border-border bg-background hover:border-primary/30 hover:bg-secondary/50",
                    )}
                  >
                    <span className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-md",
                      isActive ? "bg-primary/15 text-primary" : "bg-sky-50 text-sky-600",
                    )}>
                      <Activity className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className={cn("text-sm font-medium", isActive && "text-primary")}>{opt.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{opt.desc}</span>
                    </div>
                    {isActive && <Check className="size-3.5 shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workout Preference */}
          <div>
            <SectionLabel label="Workout Preference" />
            <PillGrid options={WORKOUT_PREFS} value={draft.workoutPreference} onChange={v => set("workoutPreference", v)} />
          </div>

          {/* Days per week */}
          <div>
            <SectionLabel label="Workout Days / Week" />
            <div className="flex items-center gap-4 rounded-xl border border-border bg-background px-4 py-3">
              <button
                type="button"
                onClick={() => set("workoutsPerWeek", Math.max(2, draft.workoutsPerWeek - 1))}
                disabled={draft.workoutsPerWeek <= 2}
                className="grid size-8 place-items-center rounded-lg border border-border bg-background transition-colors hover:bg-secondary disabled:opacity-40"
                aria-label="Decrease"
              >
                <Minus className="size-3.5" />
              </button>
              <div className="flex min-w-0 flex-1 flex-col items-center">
                <span className="font-display text-2xl font-bold text-primary">{draft.workoutsPerWeek}</span>
                <span className="text-xs text-muted-foreground">
                  days · {7 - draft.workoutsPerWeek} rest
                </span>
              </div>
              <button
                type="button"
                onClick={() => set("workoutsPerWeek", Math.min(6, draft.workoutsPerWeek + 1))}
                disabled={draft.workoutsPerWeek >= 6}
                className="grid size-8 place-items-center rounded-lg border border-border bg-background transition-colors hover:bg-secondary disabled:opacity-40"
                aria-label="Increase"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Goal / food impact notices */}
          {draft.fitnessGoal !== current.fitnessGoal && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs text-primary">
              🎯 Goal changed to <span className="font-semibold">{GOALS.find(g => g.value === draft.fitnessGoal)?.label}</span> — both your diet calories/macros and your workout structure will be regenerated to match the new goal.
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <SheetFooter className="border-t border-border px-6 py-4">
          <div className="flex w-full gap-2">
            <SheetClose asChild>
              <Button variant="outline" size="lg" className="flex-1">
                Cancel
              </Button>
            </SheetClose>
            <Button
              variant="hero"
              size="lg"
              className="flex-1 gap-2"
              onClick={handleApply}
            >
              {changedCount > 0
                ? `Apply & Regenerate (${changedCount} change${changedCount > 1 ? "s" : ""})`
                : "Apply"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Dumbbell,
  Zap,
  Heart,
  ArrowRight,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserProfile, type FitnessGoal } from "@/context/UserProfileContext";

// ─── Goal definitions ────────────────────────────────────────────────────────
const goals: {
  value: FitnessGoal;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  {
    value: "weight-gain",
    label: "Weight Gain",
    desc: "Build a healthy calorie surplus and support gradual weight gain.",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    value: "weight-loss",
    label: "Weight Loss",
    desc: "Reduce overall body weight through a sustainable calorie deficit.",
    icon: TrendingDown,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    value: "fat-loss",
    label: "Fat Loss",
    desc: "Support fat reduction while maintaining healthy nutrition and activity.",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    value: "muscle-building",
    label: "Muscle Building",
    desc: "Maximise muscle hypertrophy with optimised protein and training.",
    icon: Dumbbell,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    value: "strength",
    label: "Strength",
    desc: "Develop raw strength and power through progressive overload.",
    icon: Zap,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    value: "general-fitness",
    label: "General Fitness",
    desc: "Improve overall health, endurance, and wellbeing.",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
interface FitnessGoalFormProps {
  onComplete?: (goal: FitnessGoal) => void;
}

export function FitnessGoalForm({ onComplete }: FitnessGoalFormProps) {
  const { setFitnessGoal } = useUserProfile();
  const [selected, setSelected] = useState<FitnessGoal | null>(null);
  const [touched, setTouched] = useState(false);

  function handleContinue() {
    setTouched(true);
    if (!selected) return;
    setFitnessGoal(selected);
    onComplete?.(selected);
  }

  return (
    <div className="space-y-6">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
          <Target className="size-3.5" />
        </span>
        <span className="text-sm font-medium text-foreground">
          Primary Goal <span className="text-destructive">*</span>
        </span>
      </div>

      {/* Goal cards grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {goals.map(({ value, label, desc, icon: Icon, color, bg }) => {
          const isActive = selected === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => {
                setSelected(value);
                setTouched(false);
              }}
              aria-pressed={isActive}
              className={cn(
                "group relative flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5",
                isActive
                  ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary/30"
                  : "border-border bg-background hover:border-primary/30 hover:bg-secondary/50",
              )}
            >
              {/* Icon bubble */}
              <span
                className={cn(
                  "mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
                  isActive ? "gradient-primary text-primary-foreground shadow-soft" : cn(bg, color),
                )}
              >
                <Icon className="size-5" />
              </span>

              {/* Text */}
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold leading-snug",
                    isActive ? "text-primary" : "text-foreground",
                  )}
                >
                  {label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
              </div>

              {/* Selected tick */}
              {isActive && (
                <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                  <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Validation message */}
      {touched && !selected && (
        <p className="text-xs text-destructive">Please select a fitness goal to continue.</p>
      )}

      {/* Continue */}
      <Button type="button" variant="hero" size="lg" className="w-full" onClick={handleContinue}>
        Continue <ArrowRight />
      </Button>
    </div>
  );
}

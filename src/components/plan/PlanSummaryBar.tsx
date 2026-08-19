import { Target, Leaf, Beef, Dumbbell, Calendar } from "lucide-react";
import type { FitnessGoal, FoodPreference } from "@/context/UserProfileContext";
import type { WorkoutPreference } from "@/lib/workout-types";

const GOAL_LABELS: Record<FitnessGoal, string> = {
  "weight-gain":     "Weight Gain",
  "weight-loss":     "Weight Loss",
  "fat-loss":        "Fat Loss",
  "muscle-building": "Muscle Building",
  "strength":        "Strength",
  "general-fitness": "General Fitness",
};

const PREF_LABELS: Record<WorkoutPreference, string> = {
  "home":             "Home",
  "gym":              "Full Gym",
  "bodyweight":       "Bodyweight",
  "equipment-based":  "Equipment-Based",
};

interface PlanSummaryBarProps {
  fitnessGoal: FitnessGoal;
  foodPreference: FoodPreference;
  workoutPreference: WorkoutPreference;
  workoutsPerWeek: number;
}

export function PlanSummaryBar({
  fitnessGoal,
  foodPreference,
  workoutPreference,
  workoutsPerWeek,
}: PlanSummaryBarProps) {
  const isVeg = foodPreference === "vegetarian";

  return (
    <div className="flex flex-wrap gap-2">
      <Chip icon={Target} label={GOAL_LABELS[fitnessGoal]} />
      <Chip
        icon={isVeg ? Leaf : Beef}
        label={isVeg ? "Vegetarian" : "Non-Vegetarian"}
        color={isVeg ? "emerald" : "orange"}
      />
      <Chip icon={Dumbbell} label={PREF_LABELS[workoutPreference]} color="violet" />
      <Chip icon={Calendar} label={`${workoutsPerWeek}×/week`} color="sky" />
    </div>
  );
}

type ChipColor = "default" | "emerald" | "orange" | "violet" | "sky";

const COLOR_MAP: Record<ChipColor, string> = {
  default: "bg-primary/10 text-primary",
  emerald: "bg-emerald-100 text-emerald-700",
  orange:  "bg-orange-100 text-orange-700",
  violet:  "bg-violet-100 text-violet-700",
  sky:     "bg-sky-100 text-sky-700",
};

function Chip({ icon: Icon, label, color = "default" }: { icon: React.ElementType; label: string; color?: ChipColor }) {
  return (
    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${COLOR_MAP[color]}`}>
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}

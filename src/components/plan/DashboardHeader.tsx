import { Target, Leaf, Beef, Activity, Dumbbell, RefreshCw, ArrowLeft, SlidersHorizontal, LogOut } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FitnessGoal, FoodPreference, ActivityLevel, FitnessExperience } from "@/context/UserProfileContext";
import type { WorkoutPreference } from "@/lib/workout-types";
import { useAuth } from "@/context/AuthContext";

// ─── Label maps ───────────────────────────────────────────────────────────────

const GOAL_LABELS: Record<FitnessGoal, string> = {
  "weight-gain":     "Weight Gain",
  "weight-loss":     "Weight Loss",
  "fat-loss":        "Fat Loss",
  "muscle-building": "Muscle Building",
  "strength":        "Strength",
  "general-fitness": "General Fitness",
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  "sedentary":         "Sedentary",
  "lightly-active":    "Lightly Active",
  "moderately-active": "Moderately Active",
  "very-active":       "Very Active",
};

const EXPERIENCE_LABELS: Record<FitnessExperience, string> = {
  beginner:     "Beginner",
  intermediate: "Intermediate",
  advanced:     "Advanced",
};

const WORKOUT_PREF_LABELS: Record<WorkoutPreference, string> = {
  home:              "Home",
  gym:               "Full Gym",
  bodyweight:        "Bodyweight",
  "equipment-based": "Equipment",
};

// ─── Stat pill ────────────────────────────────────────────────────────────────

interface StatPillProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  iconBg: string;
}

function StatPill({ icon: Icon, label, value, color, iconBg }: StatPillProps) {
  return (
    <div className={cn("flex items-center gap-2.5 rounded-2xl border px-3.5 py-2.5", color)}>
      <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg", iconBg)}>
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide opacity-60">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface DashboardHeaderProps {
  fitnessGoal: FitnessGoal;
  foodPreference: FoodPreference;
  activityLevel: ActivityLevel;
  fitnessExperience: FitnessExperience;
  workoutPreference: WorkoutPreference;
  workoutsPerWeek: number;
  onRegenerate: () => void;
  onCustomize: () => void;
  isLoading: boolean;
}

export function DashboardHeader({
  fitnessGoal,
  foodPreference,
  activityLevel,
  fitnessExperience,
  workoutPreference,
  workoutsPerWeek,
  onRegenerate,
  onCustomize,
  isLoading,
}: DashboardHeaderProps) {
  const isVeg = foodPreference === "vegetarian";
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    void navigate({ to: "/login" });
  }

  return (
    <div className="rounded-3xl border border-border bg-card/95 p-6 shadow-card backdrop-blur-sm sm:p-7">
      {/* ── Top row ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Link
            to="/create-plan"
            className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Back to setup"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
                <Leaf className="size-4" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                NutriFlex AI
              </span>
            </div>
            <h1 className="mt-2 font-display text-xl font-semibold leading-tight sm:text-2xl">
              Your Personalized Plan
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {user ? `Hi, ${user.name.split(" ")[0]!} · ` : ""}AI-generated 7-day diet &amp; workout plan.
            </p>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-muted-foreground"
            title="Logout"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
          <Button
            variant="heroOutline"
            size="sm"
            onClick={onCustomize}
            disabled={isLoading}
            className="gap-1.5"
          >
            <SlidersHorizontal className="size-3.5" />
            Change Preferences
          </Button>

          <Button
            variant="hero"
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
            className="gap-1.5"
          >
            <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
            Regenerate Plan
          </Button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatPill
          icon={Target}
          label="Goal"
          value={GOAL_LABELS[fitnessGoal]}
          color="border-primary/20 text-primary"
          iconBg="bg-primary/10"
        />
        <StatPill
          icon={isVeg ? Leaf : Beef}
          label="Diet"
          value={isVeg ? "Vegetarian" : "Non-Veg"}
          color={isVeg ? "border-emerald-200 text-emerald-700" : "border-orange-200 text-orange-700"}
          iconBg={isVeg ? "bg-emerald-100" : "bg-orange-100"}
        />
        <StatPill
          icon={Activity}
          label="Activity"
          value={ACTIVITY_LABELS[activityLevel]}
          color="border-sky-200 text-sky-700"
          iconBg="bg-sky-100"
        />
        <StatPill
          icon={Dumbbell}
          label={`${WORKOUT_PREF_LABELS[workoutPreference]} · ${workoutsPerWeek}×/wk`}
          value={EXPERIENCE_LABELS[fitnessExperience]}
          color="border-violet-200 text-violet-700"
          iconBg="bg-violet-100"
        />
      </div>
    </div>
  );
}

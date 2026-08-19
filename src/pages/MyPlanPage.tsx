import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { useUserProfile } from "@/context/UserProfileContext";
import { generateDietPlanFn } from "@/server-functions/generateDietPlan";
import { generateWorkoutPlanFn } from "@/server-functions/generateWorkoutPlan";
import { DashboardHeader } from "@/components/plan/DashboardHeader";
import { WeeklyOverview } from "@/components/plan/WeeklyOverview";
import { NutritionCard } from "@/components/plan/NutritionCard";
import { WorkoutCard } from "@/components/plan/WorkoutCard";
import { PlanLoadingState } from "@/components/plan/PlanLoadingState";
import { PlanErrorState } from "@/components/plan/PlanErrorState";
import { CustomizeSheet, type ActivePrefs } from "@/components/plan/CustomizeSheet";
import { StreakCard } from "@/components/plan/StreakCard";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { DietDay, DietPlan } from "@/lib/diet-generation.server";
import type { WorkoutPlan, WorkoutDay, WorkoutPreference } from "@/lib/workout-types";
import type { ActivityLevel } from "@/context/UserProfileContext";
import { useAuth } from "@/context/AuthContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function makeFallbackDiet(day: string): DietDay {
  return { day, breakfast: "—", morning_snack: "—", lunch: "—", evening_snack: "—", dinner: "—", calories: 0 };
}
function makeFallbackWorkout(day: string): WorkoutDay {
  return { day, type: "rest", focus: null, exercises: [], duration_minutes: null };
}

// ─── SessionStorage helpers ───────────────────────────────────────────────────

function readWorkoutPrefs(): { workoutPreference: WorkoutPreference; workoutsPerWeek: number } | null {
  try {
    const raw = sessionStorage.getItem("nutriflex_workout_prefs");
    return raw ? (JSON.parse(raw) as { workoutPreference: WorkoutPreference; workoutsPerWeek: number }) : null;
  } catch { return null; }
}

function writeWorkoutPrefs(prefs: { workoutPreference: WorkoutPreference; workoutsPerWeek: number }) {
  try { sessionStorage.setItem("nutriflex_workout_prefs", JSON.stringify(prefs)); } catch { /* noop */ }
}

// ─── Plan state types ─────────────────────────────────────────────────────────

type GenState = "idle" | "loading" | "done" | "error";

interface PlanState {
  diet: DietPlan | null;
  workout: WorkoutPlan | null;
  dietState: GenState;
  workoutState: GenState;
  dietError: string;
  workoutError: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MyPlanPage() {
  const { profile, fitnessGoal: ctxGoal, foodPreference: ctxFood, setFitnessGoal, setFoodPreference, allowedNonVegFoods, avoidFoods } = useUserProfile();
  const { user } = useAuth();
  const initialWorkoutPrefs = readWorkoutPrefs();

  // ── Active prefs (can diverge from wizard context after customization) ──────
  const [activePrefs, setActivePrefs] = useState<ActivePrefs | null>(() => {
    if (!ctxGoal || !ctxFood || !initialWorkoutPrefs) return null;
    return {
      fitnessGoal:       ctxGoal,
      foodPreference:    ctxFood,
      activityLevel:     profile?.activityLevel ?? "moderately-active",
      workoutPreference: initialWorkoutPrefs.workoutPreference,
      workoutsPerWeek:   initialWorkoutPrefs.workoutsPerWeek,
    };
  });

  const [planState, setPlanState] = useState<PlanState>({
    diet: null, workout: null,
    dietState: "idle", workoutState: "idle",
    dietError: "", workoutError: "",
  });

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isCustomizeRegen, setIsCustomizeRegen] = useState(false);

  // ── Core generation function — accepts explicit prefs so it works for both
  //    "Regenerate" (same prefs) and "Customize → Apply" (new prefs) ──────────
  const generate = useCallback(async (prefs: ActivePrefs) => {
    if (!profile) return;

    setPlanState(s => ({
      ...s,
      dietState: "loading", workoutState: "loading",
      dietError: "", workoutError: "",
    }));

    // Merge the customized activity level back into the profile for this call
    const effectiveProfile = { ...profile, activityLevel: prefs.activityLevel as ActivityLevel };

    const [dietResult, workoutResult] = await Promise.allSettled([
      generateDietPlanFn({
        data: {
          profile:             effectiveProfile,
          fitnessGoal:         prefs.fitnessGoal,
          foodPreference:      prefs.foodPreference,
          allowedNonVegFoods:  allowedNonVegFoods,
          avoidFoods:          avoidFoods,
        },
      }),
      generateWorkoutPlanFn({
        data: {
          profile:           effectiveProfile,
          fitnessGoal:       prefs.fitnessGoal,
          workoutPreference: prefs.workoutPreference,
          workoutsPerWeek:   prefs.workoutsPerWeek,
        },
      }),
    ]);

    setPlanState(s => ({
      ...s,
      diet:         dietResult.status    === "fulfilled" ? dietResult.value    : null,
      dietState:    dietResult.status    === "fulfilled" ? "done"  : "error",
      dietError:    dietResult.status    === "rejected"  ? String((dietResult.reason as Error).message    ?? "Diet generation failed.")    : "",
      workout:      workoutResult.status === "fulfilled" ? workoutResult.value : null,
      workoutState: workoutResult.status === "fulfilled" ? "done"  : "error",
      workoutError: workoutResult.status === "rejected"  ? String((workoutResult.reason as Error).message ?? "Workout generation failed.") : "",
    }));
  }, [profile]);

  // ── Initial load ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (activePrefs) void generate(activePrefs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleRegenerate() {
    if (!activePrefs) return;
    setIsCustomizeRegen(false);
    void generate(activePrefs);
  }

  function handleApplyPrefs(newPrefs: ActivePrefs) {
    setActivePrefs(newPrefs);
    setIsCustomizeRegen(true);
    setFitnessGoal(newPrefs.fitnessGoal);
    setFoodPreference(newPrefs.foodPreference);
    writeWorkoutPrefs({
      workoutPreference: newPrefs.workoutPreference,
      workoutsPerWeek:   newPrefs.workoutsPerWeek,
    });
    void generate(newPrefs);
  }

  async function handleDownloadPDF() {
    if (!planState.diet || !planState.workout || !activePrefs) return;
    const { exportPlanToPDF } = await import("@/lib/pdf-export");
    exportPlanToPDF(
      planState.diet,
      planState.workout,
      activePrefs,
      allowedNonVegFoods,
      avoidFoods,
      user?.name,
    );
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const isLoading     = planState.dietState === "loading" || planState.workoutState === "loading";
  const hasData       = planState.diet && planState.workout;
  const hasBothErrors = planState.dietState === "error" && planState.workoutState === "error";

  // ── Missing context guard ─────────────────────────────────────────────────
  if (!profile || !activePrefs) {
    return (
      <main className="flex min-h-screen items-center justify-center gradient-soft px-5 py-20">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card/90 p-8 text-center shadow-card">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl gradient-primary text-2xl text-primary-foreground shadow-soft">
            🌿
          </div>
          <p className="font-display text-lg font-semibold">No profile data found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete the setup flow first to generate your personalised plan.
          </p>
          <Button variant="hero" size="lg" className="mt-6" asChild>
            <Link to="/create-plan">Start Setup</Link>
          </Button>
        </div>
      </main>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading && !hasData) {
    return (
      <main className="min-h-screen gradient-soft px-4 py-20 sm:px-6">
        <div aria-hidden className="pointer-events-none fixed -left-24 top-10 size-72 rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none fixed -right-16 top-40 size-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative mx-auto w-full max-w-3xl">
          <PlanLoadingState />
        </div>
      </main>
    );
  }

  // ── Full-page error ───────────────────────────────────────────────────────
  if (hasBothErrors && !hasData) {
    return (
      <main className="flex min-h-screen items-center justify-center gradient-soft px-5 py-20">
        <div className="w-full max-w-lg">
          <PlanErrorState
            message={planState.dietError || planState.workoutError}
            onRetry={handleRegenerate}
          />
        </div>
      </main>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const dietDays    = DAYS.map(d => planState.diet?.days.find(x => x.day === d)    ?? makeFallbackDiet(d));
  const workoutDays = DAYS.map(d => planState.workout?.days.find(x => x.day === d) ?? makeFallbackWorkout(d));
  const selectedDietDay    = dietDays.find(d => d.day === selectedDay)    ?? makeFallbackDiet(selectedDay);
  const selectedWorkoutDay = workoutDays.find(d => d.day === selectedDay) ?? makeFallbackWorkout(selectedDay);
  const dayIndex = DAYS.indexOf(selectedDay);

  return (
    <>
      <main className="min-h-screen gradient-soft pb-20 pt-8">
        <div aria-hidden className="pointer-events-none fixed -left-24 top-10 size-72 rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none fixed -right-16 top-40 size-80 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative mx-auto w-full max-w-3xl space-y-4 px-4 sm:px-6">

          {/* ── Dashboard Header ── */}
          <DashboardHeader
            fitnessGoal={activePrefs.fitnessGoal}
            foodPreference={activePrefs.foodPreference}
            activityLevel={activePrefs.activityLevel}
            fitnessExperience={profile.fitnessExperience}
            workoutPreference={activePrefs.workoutPreference}
            workoutsPerWeek={activePrefs.workoutsPerWeek}
            onRegenerate={handleRegenerate}
            onCustomize={() => setSheetOpen(true)}
            isLoading={isLoading}
          />

          {/* ── Regenerating overlay banner ── */}
          {isLoading && hasData && (
            <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
              {isCustomizeRegen
                ? "Applying new preferences and generating your updated plan… existing plan shown below."
                : "Regenerating your plan with the same preferences… existing plan shown below."}
            </div>
          )}

          {/* ── Partial-error banners ── */}
          {!isLoading && planState.dietState === "error" && (
            <PlanErrorState message={planState.dietError} onRetry={handleRegenerate} />
          )}
          {!isLoading && planState.workoutState === "error" && (
            <PlanErrorState message={planState.workoutError} onRetry={handleRegenerate} />
          )}

          {/* ── Streak Card + PDF Export ── */}
          {hasData && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex-1">
                <StreakCard />
              </div>
              <Button
                variant="heroOutline"
                size="sm"
                onClick={() => void handleDownloadPDF()}
                disabled={isLoading}
                className="gap-1.5 self-start sm:mt-1"
              >
                <Download className="size-3.5" />
                Download Plan as PDF
              </Button>
            </div>
          )}

          {/* ── Weekly Overview ── */}
          {hasData && (
            <WeeklyOverview
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              dietDays={dietDays}
              workoutDays={workoutDays}
            />
          )}

          {/* ── Day Detail ── */}
          {hasData && (
            <div className="rounded-3xl border border-border bg-card/95 px-5 py-5 shadow-card backdrop-blur-sm sm:px-7 sm:py-6">
              {/* Day header row */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold">{selectedDay}</h2>
                  <p className="text-xs text-muted-foreground">
                    Day {dayIndex + 1} of 7 ·{" "}
                    {selectedWorkoutDay.type === "rest"
                      ? "Rest & Recovery"
                      : selectedWorkoutDay.focus ?? "Workout Day"}
                  </p>
                </div>

                {/* Prev / Next */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedDay(DAYS[Math.max(0, dayIndex - 1)] ?? DAYS[0]!)}
                    disabled={dayIndex === 0}
                    className="grid size-8 place-items-center rounded-xl border border-border bg-background text-lg text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                    aria-label="Previous day"
                  >‹</button>
                  <button
                    type="button"
                    onClick={() => setSelectedDay(DAYS[Math.min(6, dayIndex + 1)] ?? DAYS[6]!)}
                    disabled={dayIndex === 6}
                    className="grid size-8 place-items-center rounded-xl border border-border bg-background text-lg text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                    aria-label="Next day"
                  >›</button>
                </div>
              </div>

              {/* Day progress bar */}
              <div className="mb-5 flex gap-1">
                {DAYS.map((d, i) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    aria-label={d}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i < dayIndex ? "bg-primary/40" : i === dayIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Cards */}
              <div className="space-y-4">
                <NutritionCard diet={selectedDietDay} />
                <WorkoutCard workout={selectedWorkoutDay} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Customize sheet ── */}
      <CustomizeSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        current={activePrefs}
        onApply={handleApplyPrefs}
      />
    </>
  );
}

import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Leaf } from "lucide-react";
import { UserProfileForm } from "@/components/UserProfileForm";
import { FitnessGoalForm } from "@/components/FitnessGoalForm";
import { FoodPreferenceForm } from "@/components/FoodPreferenceForm";
import { WorkoutPreferenceForm, type WorkoutPreferenceValues } from "@/components/WorkoutPreferenceForm";
import type { UserProfile, FitnessGoal, FoodPreference } from "@/context/UserProfileContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create-plan")({
  head: () => ({
    meta: [
      { title: "Create Your Plan | NutriFlex AI" },
      { name: "description", content: "Share your details to generate a personalised 7-day NutriFlex AI plan." },
      { property: "og:title", content: "Create Your Plan | NutriFlex AI" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <ProtectedRoute><CreatePlanPage /></ProtectedRoute>,
});

// ─── Step config ──────────────────────────────────────────────────────────────
const steps = [
  { label: "Personal Details" },
  { label: "Fitness Goal" },
  { label: "Food Preference" },
  { label: "Workout Prefs" },
];

const headings = [
  { title: "Tell us about yourself",       sub: "Your profile helps NutriFlex AI personalise your 7-day plan." },
  { title: "What's your primary goal?",    sub: "Choose the goal that best describes what you want to achieve." },
  { title: "What do you eat?",             sub: "Your food preference controls every meal in your generated plan." },
  { title: "How do you like to train?",    sub: "Set your workout environment and how many days per week." },
];

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-7 flex items-center gap-1.5">
      {steps.map((step, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={step.label} className="flex min-w-0 items-center gap-1.5">
            <span className={cn(
              "grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors",
              done   ? "bg-primary/20 text-primary"
              : active ? "bg-primary text-primary-foreground"
                       : "border border-border text-muted-foreground",
            )}>
              {done ? (
                <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              ) : i + 1}
            </span>
            {active && <span className="truncate text-xs font-medium text-primary">{step.label}</span>}
            {i < steps.length - 1 && <div className="h-px flex-1 bg-border" style={{ minWidth: "1rem" }} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function CreatePlanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  function advance() {
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleProfileComplete(_p: UserProfile)    { advance(); }
  function handleGoalComplete(_g: FitnessGoal)       { advance(); }
  function handleFoodPrefComplete(_f: FoodPreference){ advance(); }

  function handleWorkoutPrefComplete(values: WorkoutPreferenceValues) {
    // Persist to sessionStorage so MyPlanPage can read it
    sessionStorage.setItem("nutriflex_workout_prefs", JSON.stringify(values));
    void navigate({ to: "/my-plan" });
  }

  const heading = headings[step] ?? headings[0];

  return (
    <main className="min-h-screen gradient-soft px-5 py-20">
      <div aria-hidden className="pointer-events-none fixed -left-24 top-10 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none fixed -right-16 top-40 size-80 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-2xl">
        {/* Back nav */}
        {step === 0 ? (
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        ) : (
          <button type="button" onClick={() => setStep(s => s - 1)} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" /> Back
          </button>
        )}

        {/* Card */}
        <div className="rounded-3xl border border-border bg-card/90 p-7 shadow-card backdrop-blur-sm sm:p-9">
          <div className="mb-7 flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-soft">
              <Leaf className="size-5" />
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold sm:text-2xl">{heading.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{heading.sub}</p>
            </div>
          </div>

          <StepIndicator current={step} />

          {step === 0 && <UserProfileForm       onComplete={handleProfileComplete} />}
          {step === 1 && <FitnessGoalForm       onComplete={handleGoalComplete} />}
          {step === 2 && <FoodPreferenceForm    onComplete={handleFoodPrefComplete} />}
          {step === 3 && <WorkoutPreferenceForm onComplete={handleWorkoutPrefComplete} />}
        </div>
      </div>
    </main>
  );
}

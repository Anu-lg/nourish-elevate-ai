import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/create-plan")({
  head: () => ({
    meta: [
      { title: "Create Your Plan | NutriFlex AI" },
      {
        name: "description",
        content:
          "Share your age, body metrics, activity level, food preference and fitness goal to generate a personalized 7-day NutriFlex AI plan.",
      },
      { property: "og:title", content: "Create Your Plan | NutriFlex AI" },
      {
        property: "og:description",
        content:
          "Tell NutriFlex AI about yourself and get a personalized 7-day diet and workout plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreatePlanPage,
});

function CreatePlanPage() {
  return (
    <main className="flex min-h-screen items-center justify-center gradient-soft px-5 py-24">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card/90 p-8 text-center shadow-card backdrop-blur-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-soft">
          <Sparkles className="size-5" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold sm:text-3xl">Your profile form lands here</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Next up: age, height, weight, activity level, workout preference, days per week, food
          preference and fitness goal — then NutriFlex AI builds your 7-day plan.
        </p>
        <Button variant="heroOutline" size="lg" className="mt-7" asChild>
          <Link to="/">
            <ArrowLeft /> Back to home
          </Link>
        </Button>
      </div>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/pages/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NutriFlex AI — Personalized 7-Day Diet & Workout Plans" },
      {
        name: "description",
        content:
          "NutriFlex AI builds a personalized 7-day nutrition and workout plan around your body, fitness goal, activity level and vegetarian or non-vegetarian food preference.",
      },
      { property: "og:title", content: "NutriFlex AI — Personalized 7-Day Diet & Workout Plans" },
      {
        property: "og:description",
        content:
          "Get an AI-generated 7-day diet and workout plan tailored to your goals and food preferences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

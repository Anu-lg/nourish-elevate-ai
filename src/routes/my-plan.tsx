import { createFileRoute } from "@tanstack/react-router";
import { MyPlanPage } from "@/pages/MyPlanPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/my-plan")({
  head: () => ({
    meta: [
      { title: "Your 7-Day Plan | NutriFlex AI" },
      { name: "description", content: "Your personalised 7-day NutriFlex AI diet and workout plan." },
      { property: "og:title", content: "Your 7-Day Plan | NutriFlex AI" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <ProtectedRoute><MyPlanPage /></ProtectedRoute>,
});

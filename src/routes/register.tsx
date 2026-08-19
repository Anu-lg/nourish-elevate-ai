import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/pages/RegisterPage";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account | NutriFlex AI" },
      { name: "description", content: "Create your NutriFlex AI account." },
    ],
  }),
  component: RegisterPage,
});

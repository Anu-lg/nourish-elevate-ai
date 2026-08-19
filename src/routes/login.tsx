import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/LoginPage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In | NutriFlex AI" },
      { name: "description", content: "Sign in to your NutriFlex AI account." },
    ],
  }),
  component: LoginPage,
});

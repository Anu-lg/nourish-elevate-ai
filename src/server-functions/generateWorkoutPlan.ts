import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateWorkoutPlan } from "@/lib/workout-generation.server";

// ─── Input schema ─────────────────────────────────────────────────────────────

const GenerateWorkoutPlanSchema = z.object({
  profile: z.object({
    age:               z.number().int().min(10).max(120),
    gender:            z.enum(["male", "female", "other", "prefer-not-to-say"]),
    heightCm:          z.number().min(50).max(280),
    weightKg:          z.number().min(20).max(500),
    activityLevel:     z.enum(["sedentary", "lightly-active", "moderately-active", "very-active"]),
    fitnessExperience: z.enum(["beginner", "intermediate", "advanced"]),
  }),
  fitnessGoal: z.enum([
    "weight-gain",
    "weight-loss",
    "fat-loss",
    "muscle-building",
    "strength",
    "general-fitness",
  ]),
  workoutPreference: z.enum(["home", "gym", "bodyweight", "equipment-based"]),
  workoutsPerWeek:   z.number().int().min(2).max(6),
});

export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanSchema>;

/**
 * Server function — runs exclusively on the server.
 * The OpenAI API key is never exposed to the client bundle.
 */
export const generateWorkoutPlanFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => GenerateWorkoutPlanSchema.parse(data))
  .handler(async ({ data }) => {
    return generateWorkoutPlan(data);
  });

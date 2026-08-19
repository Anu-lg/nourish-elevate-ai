import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateDietPlan } from "@/lib/diet-generation.server";

const GenerateDietPlanSchema = z.object({
  profile: z.object({
    age: z.number().int().min(10).max(120),
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
    heightCm: z.number().min(50).max(280),
    weightKg: z.number().min(20).max(500),
    activityLevel: z.enum(["sedentary", "lightly-active", "moderately-active", "very-active"]),
    fitnessExperience: z.enum(["beginner", "intermediate", "advanced"]),
  }),
  fitnessGoal: z.enum([
    "weight-gain", "weight-loss", "fat-loss",
    "muscle-building", "strength", "general-fitness",
  ]),
  foodPreference: z.enum(["vegetarian", "non-vegetarian"]),
  // New: specific non-veg foods allowed (empty = all allowed)
  allowedNonVegFoods: z.array(z.string()).optional().default([]),
  // New: foods the user wants to avoid
  avoidFoods: z.array(z.string()).optional().default([]),
});

export type GenerateDietPlanInput = z.infer<typeof GenerateDietPlanSchema>;

export const generateDietPlanFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => GenerateDietPlanSchema.parse(data))
  .handler(async ({ data }) => {
    return generateDietPlan(data);
  });

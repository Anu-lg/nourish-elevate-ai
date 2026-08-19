/**
 * Shared workout types — safe to import from both server and client code.
 */

export type WorkoutPreference = "home" | "gym" | "bodyweight" | "equipment-based";

export interface Exercise {
  name: string;
  sets: number;
  reps: number | null;        // null for duration-based exercises
  duration_seconds: number | null; // null for rep-based exercises
  rest_seconds: number;
  target_muscle: string;
  difficulty: "easy" | "moderate" | "hard";
  notes: string | null;
}

export interface WorkoutDay {
  day: string;                // e.g. "Monday"
  type: "workout" | "rest";
  focus: string | null;       // e.g. "Upper Body", null on rest days
  exercises: Exercise[];      // empty array on rest days
  duration_minutes: number | null;
}

export interface WorkoutPlan {
  days: WorkoutDay[];
  workoutPreference: WorkoutPreference;
  workoutsPerWeek: number;
  generatedAt: string;
}

export interface GenerateWorkoutPlanInput {
  profile: {
    age: number;
    gender: string;
    heightCm: number;
    weightKg: number;
    activityLevel: string;
    fitnessExperience: string;
  };
  fitnessGoal: string;
  workoutPreference: WorkoutPreference;
  workoutsPerWeek: number; // 2–6
}

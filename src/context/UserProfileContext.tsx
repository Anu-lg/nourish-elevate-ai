import { createContext, useContext, useState, type ReactNode } from "react";

export type Gender = "male" | "female" | "other" | "prefer-not-to-say";
export type ActivityLevel = "sedentary" | "lightly-active" | "moderately-active" | "very-active";
export type FitnessExperience = "beginner" | "intermediate" | "advanced";
export type FitnessGoal =
  | "weight-gain"
  | "weight-loss"
  | "fat-loss"
  | "muscle-building"
  | "strength"
  | "general-fitness";

/**
 * "vegetarian"     → diet must contain ONLY plant-based foods.
 *                    Strictly NO chicken, fish, meat, eggs, or any other
 *                    non-vegetarian ingredient. Enforced in prompt constraints
 *                    and must also be validated server-side before generation.
 * "non-vegetarian" → AI may include suitable non-vegetarian foods.
 */
export type FoodPreference = "vegetarian" | "non-vegetarian";

/** Allowed non-veg food categories the user can select */
export type NonVegFood = "chicken" | "fish" | "eggs" | "mutton" | "turkey" | "beef" | "pork" | "seafood";

export const NON_VEG_FOOD_OPTIONS: { value: NonVegFood; label: string; emoji: string }[] = [
  { value: "chicken",  label: "Chicken",       emoji: "🍗" },
  { value: "fish",     label: "Fish",          emoji: "🐟" },
  { value: "eggs",     label: "Eggs",          emoji: "🥚" },
  { value: "mutton",   label: "Mutton / Lamb", emoji: "🥩" },
  { value: "turkey",   label: "Turkey",        emoji: "🦃" },
  { value: "beef",     label: "Beef",          emoji: "🥩" },
  { value: "pork",     label: "Pork",          emoji: "🐷" },
  { value: "seafood",  label: "Seafood",       emoji: "🦐" },
];

/** Explicit list of ingredients the backend must reject when preference = "vegetarian". */
export const VEGETARIAN_EXCLUDED_INGREDIENTS = [
  "chicken",
  "fish",
  "beef",
  "pork",
  "lamb",
  "mutton",
  "turkey",
  "duck",
  "shrimp",
  "prawn",
  "crab",
  "lobster",
  "tuna",
  "salmon",
  "egg",
  "eggs",
  "meat",
  "seafood",
  "gelatin",
  "lard",
] as const;

export interface UserProfile {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  fitnessExperience: FitnessExperience;
}

interface UserProfileContextValue {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  fitnessGoal: FitnessGoal | null;
  setFitnessGoal: (g: FitnessGoal) => void;
  foodPreference: FoodPreference | null;
  setFoodPreference: (p: FoodPreference) => void;
  allowedNonVegFoods: NonVegFood[];
  setAllowedNonVegFoods: (foods: NonVegFood[]) => void;
  avoidFoods: string[];
  setAvoidFoods: (foods: string[]) => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal | null>(null);
  const [foodPreference, setFoodPreference] = useState<FoodPreference | null>(null);
  const [allowedNonVegFoods, setAllowedNonVegFoods] = useState<NonVegFood[]>([]);
  const [avoidFoods, setAvoidFoods] = useState<string[]>([]);
  return (
    <UserProfileContext.Provider
      value={{ profile, setProfile, fitnessGoal, setFitnessGoal, foodPreference, setFoodPreference, allowedNonVegFoods, setAllowedNonVegFoods, avoidFoods, setAvoidFoods }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}

// ─── Diet generation payload helper ─────────────────────────────────────────
/**
 * Assembles the full payload that must be forwarded to the diet / workout
 * generation API. The `dietConstraints` object is what the backend should
 * consume to enforce dietary rules — never rely only on frontend filtering.
 */
export function buildDietPromptConstraints(
  profile: UserProfile,
  fitnessGoal: FitnessGoal,
  foodPreference: FoodPreference,
) {
  const isVegetarian = foodPreference === "vegetarian";
  return {
    userProfile: profile,
    fitnessGoal,
    foodPreference,
    dietConstraints: {
      vegetarianOnly: isVegetarian,
      /**
       * When vegetarianOnly is true the generation service MUST treat every
       * item in this list as a hard exclusion. Any meal plan containing these
       * ingredients must be regenerated before returning to the client.
       */
      excludedIngredients: isVegetarian ? VEGETARIAN_EXCLUDED_INGREDIENTS : [],
      allowedProteinSources: isVegetarian
        ? ["lentils", "beans", "chickpeas", "tofu", "tempeh", "paneer", "greek yogurt", "cottage cheese", "nuts", "seeds", "quinoa"]
        : null, // null = no restriction; backend uses its default protein list
    },
  };
}

export type DietPromptConstraints = ReturnType<typeof buildDietPromptConstraints>;

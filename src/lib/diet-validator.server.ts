/**
 * Diet Food Preference Validator — server-only, reusable service.
 *
 * Validates a generated diet plan against the user's food preference.
 * This is a backend business-rule layer; do not rely only on LLM prompting.
 *
 * Contract
 * ─────────
 * Pass  → { valid: true }
 * Fail  → { valid: false, reason: string, violations: ViolationDetail[] }
 */

import type { FoodPreference } from "@/context/UserProfileContext";
import type { DietDay } from "@/lib/diet-generation.server";

// ─── Prohibited ingredient list ───────────────────────────────────────────────
// Covers the required items plus common aliases and compound words.
// Each entry is matched as a whole word (case-insensitive) so "eggplant" is safe.

export const PROHIBITED_VEGETARIAN_INGREDIENTS: readonly string[] = [
  // Poultry
  "chicken", "turkey", "duck", "hen", "poultry",
  // Red meat
  "beef", "pork", "lamb", "mutton", "veal", "goat",
  "bacon", "ham", "salami", "pepperoni", "prosciutto", "sausage",
  // Generic
  "meat", "mince", "minced",
  // Fish & seafood
  "fish", "tuna", "salmon", "cod", "tilapia", "sardine", "sardines",
  "mackerel", "trout", "halibut", "anchovy", "anchovies",
  "shrimp", "prawn", "prawns", "crab", "lobster", "crayfish",
  "squid", "octopus", "clam", "clams", "oyster", "oysters",
  "mussel", "mussels", "scallop", "scallops", "seafood",
  // Egg
  "egg", "eggs",
  // Hidden animal products
  "gelatin", "gelatine", "lard", "suet", "rennet",
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ViolationDetail {
  day: string;
  meal: string;       // field name, e.g. "breakfast"
  text: string;       // the meal description that triggered the violation
  ingredient: string; // the specific word matched
}

export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: string; violations: ViolationDetail[] };

// ─── Core detector ────────────────────────────────────────────────────────────

/**
 * Returns the first prohibited ingredient found in `text`, or null.
 * Uses whole-word matching to prevent false positives (e.g. "eggplant").
 */
export function detectProhibitedIngredient(text: string): string | null {
  const lower = text.toLowerCase();
  for (const ingredient of PROHIBITED_VEGETARIAN_INGREDIENTS) {
    if (new RegExp(`\\b${ingredient}\\b`, "i").test(lower)) {
      return ingredient;
    }
  }
  return null;
}

// ─── Plan validator ───────────────────────────────────────────────────────────

const MEAL_FIELDS: (keyof DietDay)[] = [
  "breakfast",
  "morning_snack",
  "lunch",
  "evening_snack",
  "dinner",
];

/**
 * Validates a 7-day diet plan against the user's food preference.
 *
 * - For "non-vegetarian": always passes (no restrictions enforced here).
 * - For "vegetarian": scans every meal of every day for prohibited ingredients.
 *
 * @returns ValidationResult — { valid: true } or { valid: false, reason, violations }
 */
export function validateDietPlan(
  days: DietDay[],
  foodPreference: FoodPreference,
): ValidationResult {
  if (foodPreference !== "vegetarian") {
    return { valid: true };
  }

  const violations: ViolationDetail[] = [];

  for (const day of days) {
    for (const field of MEAL_FIELDS) {
      const mealText = String(day[field]);
      const found = detectProhibitedIngredient(mealText);
      if (found) {
        violations.push({
          day: day.day,
          meal: field,
          text: mealText,
          ingredient: found,
        });
      }
    }
  }

  if (violations.length === 0) {
    return { valid: true };
  }

  // Collect unique ingredient names for the error message
  const uniqueIngredients = [...new Set(violations.map((v) => v.ingredient))];

  return {
    valid: false,
    reason: "Non-vegetarian food detected",
    violations,
    // Surface unique prohibited items so the caller can inject them back into
    // the regeneration prompt as an explicit additional exclusion list.
    ...(uniqueIngredients.length > 0 ? { detectedIngredients: uniqueIngredients } : {}),
  } as { valid: false; reason: string; violations: ViolationDetail[] } & {
    detectedIngredients: string[];
  };
}

/**
 * Convenience: extracts the unique detected ingredient names from a failed result.
 * Returns an empty array for passing results or non-vegetarian preference.
 */
export function getDetectedIngredients(result: ValidationResult): string[] {
  if (result.valid) return [];
  return (result as unknown as { detectedIngredients?: string[] }).detectedIngredients ?? [];
}

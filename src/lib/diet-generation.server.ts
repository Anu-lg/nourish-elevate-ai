/**
 * Server-only diet generation service.
 * This file must never be imported from client-side code.
 * The API key is read from process.env and never leaves the server.
 */

import type {
  UserProfile,
  FitnessGoal,
  FoodPreference,
} from "@/context/UserProfileContext";
import { VEGETARIAN_EXCLUDED_INGREDIENTS } from "@/context/UserProfileContext";
import {
  validateDietPlan,
  getDetectedIngredients,
} from "@/lib/diet-validator.server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DietDay {
  day: string;
  breakfast: string;
  morning_snack: string;
  lunch: string;
  evening_snack: string;
  dinner: string;
  calories: number;
}

export interface DietPlan {
  days: DietDay[];
  foodPreference: FoodPreference;
  fitnessGoal: FitnessGoal;
  allowedNonVegFoods?: string[];
  avoidFoods?: string[];
  generatedAt: string;
}

export interface GenerateDietPlanInput {
  profile: UserProfile;
  fitnessGoal: FitnessGoal;
  foodPreference: FoodPreference;
  allowedNonVegFoods?: string[];
  avoidFoods?: string[];
}

// ─── Label maps ───────────────────────────────────────────────────────────────

const GOAL_LABELS: Record<FitnessGoal, string> = {
  "weight-gain":    "weight gain (healthy calorie surplus)",
  "weight-loss":    "weight loss (moderate calorie deficit)",
  "fat-loss":       "fat loss (preserve lean mass, calorie deficit)",
  "muscle-building":"muscle building (high protein, calorie surplus)",
  "strength":       "strength development (high protein, adequate calories)",
  "general-fitness":"general fitness and wellbeing",
};

const ACTIVITY_LABELS: Record<string, string> = {
  "sedentary":         "sedentary (little or no exercise)",
  "lightly-active":    "lightly active (1–3 days/week)",
  "moderately-active": "moderately active (3–5 days/week)",
  "very-active":       "very active (6–7 days/week)",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner:     "beginner (less than 1 year)",
  intermediate: "intermediate (1–3 years)",
  advanced:     "advanced (3+ years)",
};

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(
  input: GenerateDietPlanInput,
  extraExclusions: string[] = [],
): string {
  const { profile, fitnessGoal, foodPreference, allowedNonVegFoods = [], avoidFoods = [] } = input;
  const isVegetarian = foodPreference === "vegetarian";

  const fullExclusionList = isVegetarian
    ? [...new Set([...VEGETARIAN_EXCLUDED_INGREDIENTS, ...extraExclusions])]
    : [];

  const vegetarianRules = isVegetarian
    ? `
CRITICAL DIETARY RESTRICTION — VEGETARIAN ONLY:
- This user is VEGETARIAN. You MUST NOT include ANY of these ingredients in ANY meal:
  ${fullExclusionList.join(", ")}.
${extraExclusions.length > 0 ? `- IMPORTANT: a previous attempt incorrectly included: ${extraExclusions.join(", ")}. These are strictly forbidden.` : ""}
- Every single meal across all 7 days must be 100% vegetarian.
- Use plant-based protein sources only: lentils, beans, chickpeas, tofu, tempeh,
  paneer, Greek yogurt, cottage cheese, nuts, seeds, quinoa, and similar.
- Violating this rule will cause the plan to be rejected and regenerated.`
    : `
Food preference: Non-vegetarian.
${allowedNonVegFoods.length > 0
  ? `IMPORTANT: The user ONLY eats these non-vegetarian foods: ${allowedNonVegFoods.join(", ")}.
You MUST use ONLY these allowed non-vegetarian ingredients. Do NOT include any other meat, poultry, fish or seafood not in this list.`
  : "You may include lean meats, poultry, fish, eggs and seafood where appropriate for the fitness goal."}`;

  const avoidRules = avoidFoods.length > 0
    ? `
FOODS TO AVOID — the user does NOT eat these:
${avoidFoods.map(f => `  - ${f}`).join("\n")}
Do NOT include any of these in any meal across all 7 days.`
    : "";

  return `You are an expert nutritionist and dietitian. Generate a personalised 7-day diet plan.

USER PROFILE:
- Age: ${profile.age} years
- Gender: ${profile.gender}
- Height: ${profile.heightCm} cm
- Weight: ${profile.weightKg} kg
- Activity level: ${ACTIVITY_LABELS[profile.activityLevel] ?? profile.activityLevel}
- Fitness experience: ${EXPERIENCE_LABELS[profile.fitnessExperience] ?? profile.fitnessExperience}
- Primary fitness goal: ${GOAL_LABELS[fitnessGoal] ?? fitnessGoal}
${vegetarianRules}
${avoidRules}

INSTRUCTIONS:
1. Generate exactly 7 days: Monday through Sunday.
2. For each day provide: breakfast, morning_snack, lunch, evening_snack, dinner.
3. Each meal description should be concise (one sentence, include key ingredients).
4. Provide realistic approximate total daily calories as an integer.
5. Vary meals across the week — do not repeat the same meal on consecutive days.
6. Portion sizes and calorie targets must be appropriate for the user's goal and profile.
7. Return ONLY valid JSON — no markdown, no code fences, no explanatory text outside the JSON.

OUTPUT FORMAT (return exactly this structure, no extra keys):
{
  "days": [
    {
      "day": "Monday",
      "breakfast": "...",
      "morning_snack": "...",
      "lunch": "...",
      "evening_snack": "...",
      "dinner": "...",
      "calories": 2000
    }
  ]
}

Generate all 7 days in the "days" array.`;
}

// ─── Response parser ──────────────────────────────────────────────────────────

function parseDietResponse(raw: string): DietDay[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI response did not contain valid JSON.");
    parsed = JSON.parse(match[0]);
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray((parsed as Record<string, unknown>)["days"])
  ) {
    throw new Error("AI response missing expected 'days' array.");
  }

  const days = (parsed as { days: unknown[] }).days;
  if (days.length !== 7) {
    throw new Error(`Expected 7 days in plan, got ${days.length}.`);
  }

  return days.map((d, i) => {
    const day = d as Record<string, unknown>;
    const required = ["day", "breakfast", "morning_snack", "lunch", "evening_snack", "dinner", "calories"];
    for (const key of required) {
      if (!(key in day)) throw new Error(`Day ${i + 1} missing field: "${key}".`);
    }
    return {
      day:           String(day["day"]),
      breakfast:     String(day["breakfast"]),
      morning_snack: String(day["morning_snack"]),
      lunch:         String(day["lunch"]),
      evening_snack: String(day["evening_snack"]),
      dinner:        String(day["dinner"]),
      calories:      Number(day["calories"]),
    };
  });
}

// ─── Gemini API call ──────────────────────────────────────────────────────────

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const model = "gemini-3.1-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const systemText =
    "You are a professional nutritionist. Always respond with valid JSON only. " +
    "Never include markdown, code fences, or explanatory text outside the JSON structure.";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: systemText + "\n\n" + prompt }] },
      ],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");
  return text;
}

// ─── Generation with validation + retry loop ──────────────────────────────────

const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function generateWithRetry(
  apiKey: string,
  input: GenerateDietPlanInput,
): Promise<DietDay[]> {
  let extraExclusions: string[] = [];
  let lastError = "";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const prompt = buildPrompt(input, extraExclusions);
      const raw = await callGemini(apiKey, prompt);
      const days = parseDietResponse(raw);
      const result = validateDietPlan(days, input.foodPreference);

      if (result.valid) return days;

      const detected = getDetectedIngredients(result);
      extraExclusions = detected.length > 0 ? detected : extraExclusions;
      lastError = result.reason;
      console.warn(
        `[diet-generation] Attempt ${attempt}/${MAX_RETRIES} failed validation. ` +
        `Detected: [${detected.join(", ")}]. Retrying...`,
      );
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[diet-generation] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError}`);
      // Back off on rate limit or server overload
      if (attempt < MAX_RETRIES && (lastError.includes("429") || lastError.includes("503"))) {
        await sleep(5000 * attempt);
      } else if (attempt < MAX_RETRIES) {
        throw err; // non-retryable error — bubble up immediately
      }
    }
  }

  throw new Error(
    `Diet plan generation failed after ${MAX_RETRIES} attempts. ` +
    `Last validation failure: "${lastError}". ` +
    `Please try again or contact support if the issue persists.`,
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateDietPlan(input: GenerateDietPlanInput): Promise<DietPlan> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  const days = await generateWithRetry(apiKey, input);

  return {
    days,
    foodPreference: input.foodPreference,
    fitnessGoal:    input.fitnessGoal,
    allowedNonVegFoods: input.allowedNonVegFoods ?? [],
    avoidFoods:     input.avoidFoods ?? [],
    generatedAt:    new Date().toISOString(),
  };
}

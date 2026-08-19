/**
 * Server-only workout generation service.
 * Never import this file from client-side code.
 * The API key is read from process.env and never leaves the server.
 */

import type {
  GenerateWorkoutPlanInput,
  WorkoutDay,
  WorkoutPlan,
  Exercise,
} from "@/lib/workout-types";

// ─── Label maps ───────────────────────────────────────────────────────────────

const GOAL_LABELS: Record<string, string> = {
  "weight-gain":     "weight gain — build muscle mass with progressive overload",
  "weight-loss":     "weight loss — calorie-burning circuits with moderate intensity",
  "fat-loss":        "fat loss — HIIT and compound movements to maximise fat burn",
  "muscle-building": "muscle building — hypertrophy-focused splits with volume",
  "strength":        "strength — heavy compound lifts, low reps, high intensity",
  "general-fitness": "general fitness — balanced mix of strength, cardio and mobility",
};

const ACTIVITY_LABELS: Record<string, string> = {
  "sedentary":         "sedentary (little or no exercise)",
  "lightly-active":    "lightly active (1–3 days/week)",
  "moderately-active": "moderately active (3–5 days/week)",
  "very-active":       "very active (6–7 days/week)",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner:     "beginner — under 1 year, focus on form, low volume, safe exercises only",
  intermediate: "intermediate — 1–3 years, moderate intensity and volume",
  advanced:     "advanced — 3+ years, high intensity, complex movements allowed",
};

const PREFERENCE_LABELS: Record<string, string> = {
  home:              "home workouts (minimal equipment, open floor space)",
  gym:               "full gym (barbells, dumbbells, machines, cables)",
  bodyweight:        "bodyweight only (no equipment at all)",
  "equipment-based": "equipment-based (dumbbells, resistance bands, kettlebells)",
};

// ─── Beginner safety rules ────────────────────────────────────────────────────

const BEGINNER_SAFETY_RULES = `
BEGINNER SAFETY RULES (this user is a beginner — these are mandatory):
- Use only safe, low-impact exercises with well-known correct form.
- Do NOT include: heavy barbell squats, deadlifts with heavy load, Olympic lifts,
  box jumps, kipping pull-ups, or any plyometric movement with high injury risk.
- Keep sets to 2–3, reps to 8–15, rest to 60–90 seconds minimum.
- Difficulty must be "easy" or at most "moderate" for all exercises.
- Include form cues in the "notes" field for compound movements.
- Total session duration must not exceed 45 minutes.`;

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(input: GenerateWorkoutPlanInput): string {
  const { profile, fitnessGoal, workoutPreference, workoutsPerWeek } = input;
  const isBeginnerSafety = profile.fitnessExperience === "beginner";
  const restDays = 7 - workoutsPerWeek;

  return `You are an expert certified personal trainer. Generate a personalised 7-day weekly workout plan.

USER PROFILE:
- Age: ${profile.age} years
- Gender: ${profile.gender}
- Height: ${profile.heightCm} cm
- Weight: ${profile.weightKg} kg
- Activity level: ${ACTIVITY_LABELS[profile.activityLevel] ?? profile.activityLevel}
- Fitness experience: ${EXPERIENCE_LABELS[profile.fitnessExperience] ?? profile.fitnessExperience}
- Primary fitness goal: ${GOAL_LABELS[fitnessGoal] ?? fitnessGoal}
- Workout preference: ${PREFERENCE_LABELS[workoutPreference] ?? workoutPreference}
- Workout days per week: ${workoutsPerWeek} (rest/recovery days: ${restDays})
${isBeginnerSafety ? BEGINNER_SAFETY_RULES : ""}

INSTRUCTIONS:
1. Generate exactly 7 days: Monday through Sunday.
2. Exactly ${workoutsPerWeek} days must be workout days; the remaining ${restDays} must be rest/recovery days.
3. Distribute workout days sensibly (avoid 3+ consecutive training days where possible).
4. For WORKOUT days include 4–7 exercises appropriate to the goal, experience and equipment.
5. For REST days: set type to "rest", focus to null, exercises to [], duration_minutes to null.
6. Each exercise must have: name, sets, reps OR duration_seconds (use null for the other),
   rest_seconds, target_muscle (short string), difficulty ("easy"|"moderate"|"hard"), notes (string or null).
7. Vary muscle groups across the week — do not train the same muscle group on back-to-back days.
8. duration_minutes for workout days should reflect realistic session length.
9. Return ONLY valid JSON — no markdown, no code fences, no extra text outside the JSON.

OUTPUT FORMAT (return exactly this structure):
{
  "days": [
    {
      "day": "Monday",
      "type": "workout",
      "focus": "Upper Body",
      "duration_minutes": 45,
      "exercises": [
        {
          "name": "Push Ups",
          "sets": 3,
          "reps": 12,
          "duration_seconds": null,
          "rest_seconds": 60,
          "target_muscle": "Chest",
          "difficulty": "easy",
          "notes": "Keep core tight, full range of motion"
        }
      ]
    },
    {
      "day": "Tuesday",
      "type": "rest",
      "focus": null,
      "duration_minutes": null,
      "exercises": []
    }
  ]
}

Generate all 7 days in the "days" array.`;
}

// ─── Response parser & structural validator ───────────────────────────────────

function parseExercise(raw: Record<string, unknown>, dayLabel: string, idx: number): Exercise {
  const required = ["name", "sets", "rest_seconds", "target_muscle", "difficulty"];
  for (const key of required) {
    if (!(key in raw)) throw new Error(`Exercise ${idx + 1} on ${dayLabel} missing field: "${key}".`);
  }

  const difficulty = String(raw["difficulty"]);
  if (!["easy", "moderate", "hard"].includes(difficulty)) {
    throw new Error(`Exercise "${String(raw["name"])}" has invalid difficulty: "${difficulty}".`);
  }

  return {
    name:             String(raw["name"]),
    sets:             Number(raw["sets"]),
    reps:             raw["reps"] != null ? Number(raw["reps"]) : null,
    duration_seconds: raw["duration_seconds"] != null ? Number(raw["duration_seconds"]) : null,
    rest_seconds:     Number(raw["rest_seconds"]),
    target_muscle:    String(raw["target_muscle"]),
    difficulty:       difficulty as Exercise["difficulty"],
    notes:            raw["notes"] != null ? String(raw["notes"]) : null,
  };
}

function parseWorkoutResponse(raw: string): WorkoutDay[] {
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
    throw new Error(`Expected 7 days in workout plan, got ${days.length}.`);
  }

  return days.map((d, i) => {
    const day = d as Record<string, unknown>;
    if (!("day" in day) || !("type" in day)) {
      throw new Error(`Day ${i + 1} missing required fields "day" or "type".`);
    }

    const type = String(day["type"]);
    if (type !== "workout" && type !== "rest") {
      throw new Error(`Day ${i + 1} has invalid type: "${type}". Must be "workout" or "rest".`);
    }

    const rawExercises = Array.isArray(day["exercises"]) ? day["exercises"] : [];
    const exercises = (rawExercises as Record<string, unknown>[]).map((ex, j) =>
      parseExercise(ex, String(day["day"]), j),
    );

    return {
      day:              String(day["day"]),
      type:             type as WorkoutDay["type"],
      focus:            day["focus"] != null ? String(day["focus"]) : null,
      exercises,
      duration_minutes: day["duration_minutes"] != null ? Number(day["duration_minutes"]) : null,
    };
  });
}

// ─── Safety validator ─────────────────────────────────────────────────────────

const FORBIDDEN_BEGINNER_EXERCISES = [
  "barbell squat", "heavy squat", "deadlift", "olympic lift",
  "clean and jerk", "snatch", "box jump", "kipping pull-up",
  "muscle up", "plyometric",
];

function validateWorkoutPlan(days: WorkoutDay[], experience: string, workoutsPerWeek: number): void {
  const actualWorkoutDays = days.filter(d => d.type === "workout").length;
  if (actualWorkoutDays !== workoutsPerWeek) {
    throw new Error(`Expected ${workoutsPerWeek} workout days, got ${actualWorkoutDays}. Regeneration required.`);
  }

  if (experience === "beginner") {
    for (const day of days) {
      for (const ex of day.exercises) {
        const nameLower = ex.name.toLowerCase();
        for (const forbidden of FORBIDDEN_BEGINNER_EXERCISES) {
          if (nameLower.includes(forbidden)) {
            throw new Error(`Beginner safety violation: "${ex.name}" is not safe for beginners on ${day.day}.`);
          }
        }
        if (ex.difficulty === "hard") {
          throw new Error(`Beginner safety violation: "${ex.name}" on ${day.day} has difficulty "hard", not allowed for beginners.`);
        }
      }
    }
  }
}

// ─── Gemini API call ──────────────────────────────────────────────────────────

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const model = "gemini-3.1-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const systemText =
    "You are a certified personal trainer. Always respond with valid JSON only. " +
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

// ─── Generation with validation + retry ──────────────────────────────────────

const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function generateWithRetry(apiKey: string, input: GenerateWorkoutPlanInput): Promise<WorkoutDay[]> {
  let lastError = "";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const prompt = buildPrompt(input);
      const raw = await callGemini(apiKey, prompt);
      const days = parseWorkoutResponse(raw);
      validateWorkoutPlan(days, input.profile.fitnessExperience, input.workoutsPerWeek);
      return days;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[workout-generation] Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError}`);
      // Back off on rate limit or server overload before retrying
      if (attempt < MAX_RETRIES && (lastError.includes("429") || lastError.includes("503"))) {
        await sleep(5000 * attempt);
      }
    }
  }

  throw new Error(
    `Workout plan generation failed after ${MAX_RETRIES} attempts. Last error: "${lastError}". Please try again.`,
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<WorkoutPlan> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  const days = await generateWithRetry(apiKey, input);

  return {
    days,
    workoutPreference: input.workoutPreference,
    workoutsPerWeek:   input.workoutsPerWeek,
    generatedAt:       new Date().toISOString(),
  };
}

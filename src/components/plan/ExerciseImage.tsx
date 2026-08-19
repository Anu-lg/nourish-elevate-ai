/**
 * ExerciseImage — shows a reference GIF/image for a named exercise.
 * Uses Wikimedia Commons public domain exercise illustrations as a fallback-safe source.
 * If the image fails to load, shows a clean placeholder — never breaks the page.
 */

import { useState } from "react";
import { Dumbbell } from "lucide-react";

// Map of exercise keywords → Wikimedia Commons direct image URLs (public domain)
const EXERCISE_IMAGE_MAP: Record<string, string> = {
  "push up":         "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Push_up_2.png/320px-Push_up_2.png",
  "push-up":         "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Push_up_2.png/320px-Push_up_2.png",
  "pushup":          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Push_up_2.png/320px-Push_up_2.png",
  "squat":           "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Squats_01.svg/320px-Squats_01.svg.png",
  "lunge":           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Lunge.png/320px-Lunge.png",
  "lunges":          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Lunge.png/320px-Lunge.png",
  "plank":           "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Plank_position.jpg/320px-Plank_position.jpg",
  "pull up":         "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Pull_up_2_-_corrected.png/320px-Pull_up_2_-_corrected.png",
  "pull-up":         "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Pull_up_2_-_corrected.png/320px-Pull_up_2_-_corrected.png",
  "pullup":          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Pull_up_2_-_corrected.png/320px-Pull_up_2_-_corrected.png",
  "dumbbell curl":   "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Dumbbell_bicep_curl.png/320px-Dumbbell_bicep_curl.png",
  "bicep curl":      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Dumbbell_bicep_curl.png/320px-Dumbbell_bicep_curl.png",
  "sit up":          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sit-up_2011-01-31.png/320px-Sit-up_2011-01-31.png",
  "sit-up":          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sit-up_2011-01-31.png/320px-Sit-up_2011-01-31.png",
  "situp":           "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sit-up_2011-01-31.png/320px-Sit-up_2011-01-31.png",
  "crunch":          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Crunch_1.png/320px-Crunch_1.png",
  "crunches":        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Crunch_1.png/320px-Crunch_1.png",
  "jumping jack":    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Jumping-Jacks.png/320px-Jumping-Jacks.png",
  "jumping jacks":   "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Jumping-Jacks.png/320px-Jumping-Jacks.png",
  "mountain climber":"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Mountain_climber.png/320px-Mountain_climber.png",
  "burpee":          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Burpee_sequence.png/320px-Burpee_sequence.png",
  "burpees":         "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Burpee_sequence.png/320px-Burpee_sequence.png",
  "deadlift":        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Deaflift_animation.gif/320px-Deaflift_animation.gif",
  "shoulder press":  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Shoulder_press_2.svg/320px-Shoulder_press_2.svg.png",
  "overhead press":  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Shoulder_press_2.svg/320px-Shoulder_press_2.svg.png",
  "bench press":     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Bench_press.png/320px-Bench_press.png",
  "row":             "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Dumbbell_row_2.png/320px-Dumbbell_row_2.png",
  "dumbbell row":    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Dumbbell_row_2.png/320px-Dumbbell_row_2.png",
  "tricep":          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Triceps_pushdown.png/320px-Triceps_pushdown.png",
  "hip thrust":      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Hip_thrust.png/320px-Hip_thrust.png",
  "leg raise":       "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Leg_raises_01.png/320px-Leg_raises_01.png",
  "glute bridge":    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Glute_bridge.jpg/320px-Glute_bridge.jpg",
};

function findImageUrl(exerciseName: string): string | null {
  const lower = exerciseName.toLowerCase();
  for (const [keyword, url] of Object.entries(EXERCISE_IMAGE_MAP)) {
    if (lower.includes(keyword)) return url;
  }
  return null;
}

interface ExerciseImageProps {
  exerciseName: string;
}

export function ExerciseImage({ exerciseName }: ExerciseImageProps) {
  const [failed, setFailed] = useState(false);
  const url = findImageUrl(exerciseName);

  if (!url || failed) {
    // Clean placeholder — never breaks
    return (
      <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-violet-100">
        <Dumbbell className="size-6 text-violet-400" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={`${exerciseName} reference`}
      onError={() => setFailed(true)}
      className="size-16 shrink-0 rounded-xl object-cover bg-violet-100"
      loading="lazy"
    />
  );
}

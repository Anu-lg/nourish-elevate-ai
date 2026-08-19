/**
 * PDF Export — generates a clean 7-day plan PDF using jsPDF.
 * Runs entirely client-side. No API keys are included.
 */
import jsPDF from "jspdf";
import type { DietPlan } from "./diet-generation.server";
import type { WorkoutPlan } from "./workout-types";
import type { ActivePrefs } from "@/components/plan/CustomizeSheet";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const GOAL_LABELS: Record<string, string> = {
  "weight-gain": "Weight Gain", "weight-loss": "Weight Loss",
  "fat-loss": "Fat Loss", "muscle-building": "Muscle Building",
  "strength": "Strength", "general-fitness": "General Fitness",
};

function addHeader(doc: jsPDF, y: number): number {
  doc.setFillColor(79, 156, 120);
  doc.rect(0, 0, 210, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("NutriFlex AI — Personalized 7-Day Fitness Plan", 14, 12);
  doc.setTextColor(0, 0, 0);
  return 24;
}

function sectionTitle(doc: jsPDF, text: string, y: number): number {
  doc.setFillColor(240, 250, 245);
  doc.rect(10, y, 190, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 120, 80);
  doc.text(text, 14, y + 5.5);
  doc.setTextColor(0, 0, 0);
  return y + 12;
}

function checkPage(doc: jsPDF, y: number): number {
  if (y > 270) { doc.addPage(); return 20; }
  return y;
}

export function exportPlanToPDF(
  diet: DietPlan,
  workout: WorkoutPlan,
  prefs: ActivePrefs,
  allowedNonVegFoods: string[],
  avoidFoods: string[],
  userName?: string,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = addHeader(doc, 0);

  // ── User info ─────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold"); doc.setFontSize(9);
  doc.text("Generated for:", 14, y); y += 5;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  if (userName) { doc.text(`Name: ${userName}`, 14, y); y += 4; }
  doc.text(`Goal: ${GOAL_LABELS[prefs.fitnessGoal] ?? prefs.fitnessGoal}`, 14, y); y += 4;
  doc.text(`Diet: ${prefs.foodPreference === "vegetarian" ? "Vegetarian" : "Non-Vegetarian"}`, 14, y); y += 4;
  if (allowedNonVegFoods.length > 0) {
    doc.text(`Allowed non-veg: ${allowedNonVegFoods.join(", ")}`, 14, y); y += 4;
  }
  if (avoidFoods.length > 0) {
    doc.text(`Foods avoided: ${avoidFoods.join(", ")}`, 14, y); y += 4;
  }
  doc.text(`Activity: ${prefs.activityLevel}`, 14, y); y += 4;
  doc.text(`Workout: ${prefs.workoutPreference} · ${prefs.workoutsPerWeek}×/week`, 14, y); y += 4;
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, y); y += 8;

  // ── Diet Plan ─────────────────────────────────────────────────────────────
  y = sectionTitle(doc, "WEEKLY DIET PLAN", y);

  for (const dayName of DAYS) {
    const day = diet.days.find(d => d.day === dayName);
    if (!day) continue;
    y = checkPage(doc, y);

    doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    doc.setTextColor(30, 120, 80);
    doc.text(`${dayName}  —  ${day.calories.toLocaleString()} kcal`, 14, y);
    doc.setTextColor(0, 0, 0); y += 5;

    doc.setFont("helvetica", "normal"); doc.setFontSize(8);
    const meals = [
      ["Breakfast", day.breakfast],
      ["Morning Snack", day.morning_snack],
      ["Lunch", day.lunch],
      ["Evening Snack", day.evening_snack],
      ["Dinner", day.dinner],
    ];
    for (const [label, text] of meals) {
      y = checkPage(doc, y);
      doc.setFont("helvetica", "bold"); doc.text(`  ${label}: `, 14, y);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(text, 155);
      doc.text(lines, 45, y);
      y += lines.length * 4 + 1;
    }
    y += 3;
  }

  // ── Workout Plan ──────────────────────────────────────────────────────────
  doc.addPage();
  y = 20;
  y = sectionTitle(doc, "WEEKLY WORKOUT PLAN", y);

  for (const dayName of DAYS) {
    const day = workout.days.find(d => d.day === dayName);
    if (!day) continue;
    y = checkPage(doc, y);

    doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    doc.setTextColor(100, 60, 180);
    doc.text(`${dayName}${day.focus ? `  —  ${day.focus}` : "  —  Rest Day"}${day.duration_minutes ? `  (~${day.duration_minutes} min)` : ""}`, 14, y);
    doc.setTextColor(0, 0, 0); y += 5;

    if (day.type === "rest") {
      doc.setFont("helvetica", "italic"); doc.setFontSize(8);
      doc.text("  Rest & Recovery — stay hydrated, prioritise sleep.", 14, y);
      y += 7;
      continue;
    }

    doc.setFont("helvetica", "normal"); doc.setFontSize(8);
    for (const ex of day.exercises) {
      y = checkPage(doc, y);
      const vol = ex.reps != null ? `${ex.sets}×${ex.reps} reps` : `${ex.sets}×${ex.duration_seconds}s`;
      doc.setFont("helvetica", "bold"); doc.text(`  • ${ex.name}`, 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(`  ${vol}  |  Rest: ${ex.rest_seconds}s  |  ${ex.target_muscle}  |  ${ex.difficulty}`, 50, y);
      y += 4;
      if (ex.notes) {
        doc.setFont("helvetica", "italic");
        const noteLines = doc.splitTextToSize(`    💡 ${ex.notes}`, 165);
        doc.text(noteLines, 14, y);
        y += noteLines.length * 4;
        doc.setFont("helvetica", "normal");
      }
    }
    y += 3;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`NutriFlex AI · Page ${i} of ${pageCount}`, 14, 290);
    doc.text("Generated by NutriFlex AI — for personal use only.", 100, 290, { align: "right" });
  }

  doc.save("NutriFlex-AI-Plan.pdf");
}

import { useState } from "react";
import { Coffee, Apple, UtensilsCrossed, Sunset, Moon, Flame, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DietDay } from "@/lib/diet-generation.server";

const MEALS: { key: keyof Omit<DietDay, "day" | "calories">; label: string; icon: React.ElementType; time: string }[] = [
  { key: "breakfast",     label: "Breakfast",     icon: Coffee,          time: "7–8 am" },
  { key: "morning_snack", label: "Morning Snack", icon: Apple,           time: "10–11 am" },
  { key: "lunch",         label: "Lunch",         icon: UtensilsCrossed, time: "1–2 pm" },
  { key: "evening_snack", label: "Evening Snack", icon: Sunset,          time: "4–5 pm" },
  { key: "dinner",        label: "Dinner",        icon: Moon,            time: "7–8 pm" },
];

// Rough calorie split across meals (relative weights)
const CAL_WEIGHTS = [0.25, 0.1, 0.3, 0.1, 0.25];

interface NutritionCardProps {
  diet: DietDay;
  targetCalories?: number; // optional daily target for progress ring
}

export function NutritionCard({ diet, targetCalories }: NutritionCardProps) {
  const [expanded, setExpanded] = useState(true);
  const target = targetCalories ?? diet.calories;
  const pct    = Math.min(100, Math.round((diet.calories / (target || 1)) * 100));

  // SVG ring params
  const r = 22, cx = 28, cy = 28;
  const circ = 2 * Math.PI * r;
  const dash  = (pct / 100) * circ;

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white shadow-soft">
      {/* ── Header ── */}
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-emerald-50/50"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
          🥗
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-emerald-800">Nutrition Plan</p>
          <p className="text-xs text-emerald-600/70">5 meals · {diet.calories.toLocaleString()} kcal</p>
        </div>

        {/* Calorie ring */}
        <div className="mr-1 shrink-0">
          <svg width={56} height={56} className="-rotate-90">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#d1fae5" strokeWidth={5} />
            <circle
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke="#10b981"
              strokeWidth={5}
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
            />
          </svg>
          <p className="mt-[-42px] text-center text-[10px] font-bold text-emerald-700">{pct}%</p>
        </div>

        <ChevronDown className={cn("size-4 text-emerald-600 transition-transform duration-300", expanded && "rotate-180")} />
      </button>

      {/* ── Calorie bar ── */}
      <div className="px-5 pb-1">
        <div className="flex items-center gap-2 text-xs text-emerald-600/70">
          <Flame className="size-3" />
          <span>{diet.calories.toLocaleString()} kcal today</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-emerald-100">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* ── Meal list ── */}
      <div className={cn(
        "transition-all duration-300 overflow-hidden",
        expanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0",
      )}>
        <ul className="space-y-2 px-5 pb-5 pt-3">
          {MEALS.map(({ key, label, icon: Icon, time }, idx) => {
            const estCal = Math.round(diet.calories * (CAL_WEIGHTS[idx] ?? 0.2));
            return (
              <li key={key} className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white/80 p-3.5">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-emerald-700">{label}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{time} · ~{estCal} kcal</span>
                  </div>
                  <p className="mt-0.5 text-sm leading-snug text-foreground/80">
                    {diet[key] as string}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

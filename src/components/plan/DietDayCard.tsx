import { Coffee, Apple, UtensilsCrossed, Sunset, Moon, Flame } from "lucide-react";
import type { DietDay } from "@/lib/diet-generation.server";

const meals: { key: keyof Omit<DietDay, "day" | "calories">; label: string; icon: React.ElementType }[] = [
  { key: "breakfast",    label: "Breakfast",      icon: Coffee },
  { key: "morning_snack", label: "Morning Snack", icon: Apple },
  { key: "lunch",        label: "Lunch",          icon: UtensilsCrossed },
  { key: "evening_snack", label: "Evening Snack", icon: Sunset },
  { key: "dinner",       label: "Dinner",         icon: Moon },
];

interface DietDayCardProps {
  diet: DietDay;
}

export function DietDayCard({ diet }: DietDayCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-base">🥗</span>
        <span className="text-sm font-semibold text-emerald-800">Diet</span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          <Flame className="size-3" />
          ~{diet.calories.toLocaleString()} kcal
        </span>
      </div>

      <ul className="space-y-2">
        {meals.map(({ key, label, icon: Icon }) => (
          <li key={key} className="flex items-start gap-2.5">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-emerald-100 text-emerald-600">
              <Icon className="size-3" />
            </span>
            <div className="min-w-0">
              <span className="text-xs font-medium text-emerald-700">{label} </span>
              <span className="text-xs text-foreground/80">{diet[key] as string}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

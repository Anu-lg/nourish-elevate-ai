import { useState } from "react";
import { Leaf, Beef, ArrowRight, ShieldCheck, UtensilsCrossed, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserProfile, type FoodPreference, type NonVegFood, NON_VEG_FOOD_OPTIONS } from "@/context/UserProfileContext";

const AVOID_PRESETS = ["Dairy", "Gluten", "Nuts", "Soy", "Shellfish", "Pork", "Beef", "Alcohol"];

interface FoodPreferenceFormProps {
  onComplete?: (preference: FoodPreference) => void;
}

export function FoodPreferenceForm({ onComplete }: FoodPreferenceFormProps) {
  const { setFoodPreference, setAllowedNonVegFoods, setAvoidFoods } = useUserProfile();
  const [selected, setSelected] = useState<FoodPreference | null>(null);
  const [nonVegSelected, setNonVegSelected] = useState<NonVegFood[]>([]);
  const [avoidSelected, setAvoidSelected] = useState<string[]>([]);
  const [customAvoid, setCustomAvoid] = useState("");
  const [touched, setTouched] = useState(false);

  function toggleNonVeg(food: NonVegFood) {
    setNonVegSelected(prev =>
      prev.includes(food) ? prev.filter(f => f !== food) : [...prev, food]
    );
  }

  function toggleAvoid(food: string) {
    setAvoidSelected(prev =>
      prev.includes(food) ? prev.filter(f => f !== food) : [...prev, food]
    );
  }

  function addCustomAvoid() {
    const trimmed = customAvoid.trim();
    if (trimmed && !avoidSelected.includes(trimmed)) {
      setAvoidSelected(prev => [...prev, trimmed]);
    }
    setCustomAvoid("");
  }

  function handleContinue() {
    setTouched(true);
    if (!selected) return;
    setFoodPreference(selected);
    setAllowedNonVegFoods(selected === "non-vegetarian" ? nonVegSelected : []);
    setAvoidFoods(avoidSelected);
    onComplete?.(selected);
  }

  return (
    <div className="space-y-6">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
          <UtensilsCrossed className="size-3.5" />
        </span>
        <span className="text-sm font-medium text-foreground">
          Food Preference <span className="text-destructive">*</span>
        </span>
      </div>

      {/* Preference cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {([
          { value: "vegetarian" as const, label: "Vegetarian", desc: "Only plant-based foods.", icon: Leaf, gradient: "border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-400/40", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", badge: "Plant-based only", badgeColor: "bg-emerald-100 text-emerald-700" },
          { value: "non-vegetarian" as const, label: "Non-Vegetarian", desc: "May include meat, fish, eggs.", icon: Beef, gradient: "border-orange-400 bg-orange-50/60 ring-1 ring-orange-300/40", iconBg: "bg-orange-100", iconColor: "text-orange-600", badge: "All proteins", badgeColor: "bg-orange-100 text-orange-700" },
        ]).map(({ value, label, desc, icon: Icon, gradient, iconBg, iconColor, badge, badgeColor }) => {
          const isActive = selected === value;
          return (
            <button key={value} type="button" aria-pressed={isActive}
              onClick={() => { setSelected(value); setTouched(false); }}
              className={cn(
                "relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5",
                isActive ? gradient + " shadow-soft" : "border-border bg-background hover:border-primary/30 hover:bg-secondary/50",
              )}
            >
              {isActive && (
                <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                  <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="2,6 5,9 10,3" /></svg>
                </span>
              )}
              <div className="mb-3 flex w-full items-center gap-3">
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl transition-colors", isActive ? "gradient-primary text-primary-foreground shadow-soft" : cn(iconBg, iconColor))}>
                  <Icon className="size-5" />
                </span>
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", badgeColor)}>{badge}</span>
              </div>
              <p className="text-base font-semibold">{label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </button>
          );
        })}
      </div>

      {/* Non-veg specific food selection */}
      {selected === "non-vegetarian" && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-4 space-y-3">
          <p className="text-sm font-semibold text-orange-800">Which non-vegetarian foods do you eat?</p>
          <p className="text-xs text-orange-600">Select all that apply. Only these will be used in your diet.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {NON_VEG_FOOD_OPTIONS.map(({ value, label, emoji }) => {
              const active = nonVegSelected.includes(value);
              return (
                <button key={value} type="button" onClick={() => toggleNonVeg(value)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all",
                    active ? "border-orange-400 bg-orange-100 font-semibold text-orange-800" : "border-border bg-background text-foreground hover:border-orange-300",
                  )}
                >
                  <span>{emoji}</span>{label}
                  {active && <span className="ml-auto text-orange-600">✓</span>}
                </button>
              );
            })}
          </div>
          {nonVegSelected.length === 0 && (
            <p className="text-xs text-amber-600">ⓘ If none selected, all non-veg foods may be used.</p>
          )}
        </div>
      )}

      {/* Vegetarian notice */}
      {selected === "vegetarian" && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <span><span className="font-semibold">Strict vegetarian mode.</span> All meals will be 100% plant-based — enforced on the server before returning your plan.</span>
        </div>
      )}

      {/* Foods to avoid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-red-100 text-red-500"><X className="size-3.5" /></span>
          <span className="text-sm font-medium text-foreground">Foods I Don't Eat <span className="text-xs font-normal text-muted-foreground">(optional)</span></span>
        </div>
        <div className="flex flex-wrap gap-2">
          {AVOID_PRESETS.map(food => {
            const active = avoidSelected.includes(food);
            return (
              <button key={food} type="button" onClick={() => toggleAvoid(food)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-all",
                  active ? "border-red-400 bg-red-100 font-semibold text-red-700" : "border-border bg-background text-muted-foreground hover:border-red-300",
                )}
              >
                {active ? "✓ " : ""}{food}
              </button>
            );
          })}
        </div>
        {/* Custom avoid input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a specific food…"
            value={customAvoid}
            onChange={e => setCustomAvoid(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomAvoid())}
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
          />
          <button type="button" onClick={addCustomAvoid}
            className="grid size-9 place-items-center rounded-xl border border-border bg-background transition-colors hover:bg-secondary">
            <Plus className="size-4" />
          </button>
        </div>
        {avoidSelected.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {avoidSelected.map(food => (
              <span key={food} className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs text-red-700">
                {food}
                <button type="button" onClick={() => setAvoidSelected(p => p.filter(f => f !== food))} className="ml-0.5 text-red-500 hover:text-red-700">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {touched && !selected && <p className="text-xs text-destructive">Please select a food preference to continue.</p>}

      <Button type="button" variant="hero" size="lg" className="w-full" onClick={handleContinue}>
        Continue <ArrowRight />
      </Button>
    </div>
  );
}

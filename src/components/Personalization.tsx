import { Check, Dumbbell, Leaf, Salad, Target } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const profiles = [
  {
    name: "User A",
    goal: "Weight Gain",
    food: "Vegetarian",
    accent: "primary" as const,
    outputs: ["Vegetarian calorie-focused diet", "Personalized workout"],
    meals: ["Paneer bhurji + multigrain toast", "Rajma rice bowl", "Peanut butter banana shake"],
  },
  {
    name: "User B",
    goal: "Fat Loss",
    food: "Non-Vegetarian",
    accent: "accent" as const,
    outputs: ["Goal-focused nutrition", "Personalized workout"],
    meals: ["Egg white omelette + oats", "Grilled chicken salad", "Baked fish + veggies"],
  },
];

export function Personalization() {
  return (
    <section id="about" className="scroll-mt-20 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Personalization
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            A Plan That Understands Your Preferences
          </h2>
          <p className="mt-4 text-muted-foreground">
            NutriFlex AI never hands the same generic plan to everyone. Two people with different
            goals and food preferences get two genuinely different weeks.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {profiles.map((p, i) => (
            <Reveal key={p.name} delay={i * 120}>
              <article className="card-surface h-full overflow-hidden">
                <header
                  className={cn(
                    "flex items-center justify-between px-6 py-5",
                    p.accent === "primary" ? "bg-mint" : "bg-secondary",
                  )}
                >
                  <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-soft">
                    <Leaf className="size-3.5" /> {p.food}
                  </span>
                </header>

                <div className="space-y-4 px-6 py-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-background/60 px-4 py-3">
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Target className="size-3.5" /> Goal
                      </p>
                      <p className="mt-1 text-sm font-semibold">{p.goal}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/60 px-4 py-3">
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Salad className="size-3.5" /> Food
                      </p>
                      <p className="mt-1 text-sm font-semibold">{p.food}</p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {p.outputs.map((o) => (
                      <li key={o} className="flex items-center gap-2 text-sm font-medium">
                        <span className="grid size-5 place-items-center rounded-full gradient-primary text-primary-foreground">
                          <Check className="size-3" />
                        </span>
                        {o}
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-2xl border border-dashed border-primary/25 bg-mint/50 px-4 py-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                      <Dumbbell className="size-3.5" /> Sample meals
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                      {p.meals.map((m) => (
                        <li key={m}>· {m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <p className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-card px-5 py-4 text-center text-sm text-muted-foreground shadow-soft">
            <strong className="font-semibold text-foreground">Preference guarantee:</strong> if you
            choose Vegetarian, your plan contains only vegetarian foods — no chicken, fish, meat or
            eggs.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

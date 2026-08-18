import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Dumbbell,
  Flame,
  Salad,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

const planItems = [
  { icon: Salad, title: "Personalized Nutrition", meta: "Vegetarian · 2,850 kcal" },
  { icon: Dumbbell, title: "Personalized Workout", meta: "5 days · Push / Pull / Legs" },
  { icon: CalendarDays, title: "7-Day Plan", meta: "Mon – Sun scheduled" },
  { icon: Sparkles, title: "AI Powered", meta: "Generated for your profile" },
];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden gradient-soft pt-28 pb-20 md:pt-36 md:pb-28">
      {/* ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-40 size-80 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary backdrop-blur-sm">
            <Sparkles className="size-3.5" /> AI diet &amp; workout planning
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
            Your AI-Powered Path to a{" "}
            <span className="text-gradient">Healthier You.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Get a personalized 7-day nutrition and workout plan designed around your body, goals,
            food preferences, and lifestyle.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="hero" size="xl" asChild>
              <Link to="/create-plan">
                Create My Plan <ArrowRight />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#how-it-works">Explore How It Works</a>
            </Button>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { k: "7-Day", v: "Full plans" },
              { k: "100%", v: "Preference safe" },
              { k: "5 Goals", v: "Supported" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="font-display text-xl font-semibold text-foreground">{s.k}</dt>
                <dd className="text-xs text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={140} className="relative">
          <div className="relative rounded-3xl border border-border bg-card/90 p-6 shadow-card backdrop-blur-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  NutriFlex AI
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold">Your Weekly Plan</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-xs font-semibold text-primary">
                <span className="relative grid size-2 place-items-center">
                  <span className="absolute inline-block size-2 rounded-full bg-primary pulse-ring" />
                  <span className="size-2 rounded-full bg-primary" />
                </span>
                Ready
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl gradient-primary px-4 py-3 text-primary-foreground shadow-soft">
              <Target className="size-5" />
              <p className="text-sm font-semibold">Goal: Weight Gain</p>
            </div>

            <ul className="mt-4 space-y-3">
              {planItems.map(({ icon: Icon, title, meta }) => (
                <li
                  key={title}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-mint/60"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-mint text-primary">
                    <Icon className="size-4.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{meta}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* floating cards */}
          <div className="absolute -left-6 bottom-24 hidden lg:-left-10 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft float-slow sm:block">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <Flame className="size-4 text-accent" /> 2,850 kcal / day
            </p>
          </div>
          <div className="absolute -right-4 -bottom-6 hidden lg:-right-10 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft float-slower sm:block">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <Timer className="size-4 text-primary" /> 45 min sessions
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

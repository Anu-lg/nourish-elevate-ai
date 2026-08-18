import { Brain, CalendarCheck, Leaf, Target } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const highlights = [
  {
    icon: Brain,
    title: "AI Personalized",
    text: "Plans adapt to your individual information — body metrics, activity and lifestyle.",
  },
  {
    icon: Leaf,
    title: "Food Preference Aware",
    text: "Vegetarian and non-vegetarian preferences are strictly respected in every meal.",
  },
  {
    icon: CalendarCheck,
    title: "7-Day Planning",
    text: "Get a complete weekly diet and workout plan, day by day.",
  },
  {
    icon: Target,
    title: "Goal Focused",
    text: "Plans are generated according to your specific fitness objective.",
  },
];

export function Highlights() {
  return (
    <section id="features" className="scroll-mt-20 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Why NutriFlex</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Built to fit your body, not an average
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 90}>
              <article className="card-surface h-full p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-mint text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

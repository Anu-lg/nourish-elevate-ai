import { ArrowRight, Cpu, Salad, UserRound } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const flow = [
  { icon: UserRound, title: "User Profile", text: "Age, body metrics, activity, preferences" },
  { icon: Cpu, title: "AI Analysis", text: "Calorie, macro and training structuring" },
  { icon: Salad, title: "Diet + Workout", text: "A structured, personalized 7-day plan" },
];

export function AISection() {
  return (
    <section className="relative overflow-hidden bg-secondary/50 py-20 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl"
      />
      <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Technology</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Powered by Generative AI</h2>
          <p className="mt-4 text-muted-foreground">
            NutriFlex AI uses Generative AI to transform your personal information, fitness goals,
            activity level and dietary preferences into a structured weekly plan.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          {flow.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="flex flex-1 items-center gap-4 md:flex-col md:gap-4">
              <Reveal delay={i * 120} className="w-full">
                <div className="card-surface h-full bg-card/90 p-6 text-center backdrop-blur-sm">
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-glow">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
                </div>
              </Reveal>
              {i < flow.length - 1 && (
                <ArrowRight
                  aria-hidden
                  className="mx-auto size-5 shrink-0 rotate-90 text-primary/60 md:rotate-0 md:hidden"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

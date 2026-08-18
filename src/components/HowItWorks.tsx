import { ClipboardList, Salad, Sparkles, Target } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const steps = [
  {
    icon: ClipboardList,
    step: "Step 1",
    title: "Tell Us About You",
    text: "Enter your age, height, weight, activity level and other basic information.",
  },
  {
    icon: Target,
    step: "Step 2",
    title: "Choose Your Goal",
    text: "Select weight gain, weight loss, fat loss, strength or muscle building.",
  },
  {
    icon: Salad,
    step: "Step 3",
    title: "Set Your Food Preference",
    text: "Choose Vegetarian or Non-Vegetarian — your plan never breaks that rule.",
  },
  {
    icon: Sparkles,
    step: "Step 4",
    title: "Get Your AI Plan",
    text: "NutriFlex AI generates your personalized 7-day diet and workout plan.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 bg-secondary/50 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            From your details to a full week in four steps
          </h2>
          <p className="mt-4 text-muted-foreground">
            No guesswork, no generic templates — just a clear path to a plan made for you.
          </p>
        </Reveal>

        <div className="relative mt-12">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent lg:block"
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, step, title, text }, i) => (
              <Reveal key={title} delay={i * 100}>
                <li className="card-surface relative h-full bg-card p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-soft">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-display text-3xl font-semibold text-primary/15">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                    {step}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export function CTA() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl gradient-primary px-6 py-14 text-center shadow-glow sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 -top-10 size-52 rounded-full bg-primary-foreground/15 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-8 size-64 rounded-full bg-primary-foreground/10 blur-2xl"
            />
            <h2 className="relative text-3xl font-semibold text-primary-foreground sm:text-4xl">
              Ready to Build Your Personalized Plan?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/85">
              Tell NutriFlex AI about yourself and get a 7-day plan built around your goals.
            </p>
            <Button
              size="xl"
              className="relative mt-8 bg-card text-primary hover:bg-card/90 hover:-translate-y-0.5"
              asChild
            >
              <Link to="/create-plan">
                Create My Personalized Plan <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

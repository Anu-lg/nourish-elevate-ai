import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl gradient-primary shadow-soft">
              <Leaf className="size-5 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-semibold">
              NutriFlex <span className="text-gradient">AI</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Personalized fitness and nutrition powered by AI.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Explore
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-4 md:grid-cols-2">
            <li>
              <a href="#home" className="text-muted-foreground transition-colors hover:text-primary">
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                How It Works
              </a>
            </li>
            <li>
              <Link
                to="/create-plan"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/70">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground lg:px-8">
          © 2026 NutriFlex AI.
        </p>
      </div>
    </footer>
  );
}

import { Sparkles } from "lucide-react";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className ?? ""}`} />;
}

export function PlanLoadingState() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="rounded-3xl border border-border bg-card/95 p-6 shadow-card">
        <div className="flex items-center gap-4">
          <Skeleton className="size-9 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-64" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 rounded-2xl" />)}
        </div>
      </div>

      {/* Weekly overview skeleton */}
      <div className="rounded-3xl border border-border bg-card/95 p-5 shadow-soft">
        <Skeleton className="mb-4 h-3 w-32" />
        <div className="grid grid-cols-7 gap-1.5">
          {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      </div>

      {/* Day detail skeleton */}
      <div className="rounded-3xl border border-border bg-card/95 p-6 shadow-card">
        {/* Loading indicator */}
        <div className="mb-6 flex flex-col items-center gap-4 py-4 text-center">
          <div className="relative">
            <div className="grid size-14 place-items-center rounded-2xl gradient-primary shadow-glow">
              <Sparkles className="size-6 text-primary-foreground animate-pulse" />
            </div>
            <span className="absolute -inset-2 rounded-3xl border-2 border-primary/30 pulse-ring" />
          </div>
          <div>
            <p className="font-display text-base font-semibold">Creating your weekly plan…</p>
            <p className="mt-1 text-sm text-muted-foreground">
              NutriFlex AI is generating your personalised diet &amp; workout plan.
            </p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <span key={i} className="size-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>

        {/* Skeleton meals */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
              <Skeleton className="size-8 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

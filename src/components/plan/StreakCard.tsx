import { useStreak } from "@/hooks/use-streak";
import { Flame, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StreakCard() {
  const { streak, isTodayCompleted, markToday, getWeekStatus } = useStreak();
  const week = getWeekStatus();

  return (
    <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50/80 to-white p-5 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-orange-100 text-xl">🔥</span>
          <div>
            <p className="text-sm font-semibold text-orange-800">Streak Tracker</p>
            <p className="text-xs text-orange-600/70">Keep your momentum going!</p>
          </div>
        </div>
        <div className="flex gap-4 text-center">
          <div>
            <p className="font-display text-2xl font-bold text-orange-600">{streak.currentStreak}</p>
            <p className="text-[10px] text-orange-500">Current</p>
          </div>
          <div className="flex items-center gap-1 text-amber-600">
            <Trophy className="size-4" />
            <div>
              <p className="font-display text-2xl font-bold">{streak.bestStreak}</p>
              <p className="text-[10px]">Best</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly indicator */}
      <div className="mt-4 flex justify-between">
        {week.map(({ short, done }) => (
          <div key={short} className="flex flex-col items-center gap-1">
            <span className={cn(
              "grid size-7 place-items-center rounded-full text-xs font-semibold",
              done ? "bg-orange-400 text-white" : "bg-orange-100 text-orange-400",
            )}>
              {done ? "✓" : "○"}
            </span>
            <span className="text-[10px] text-muted-foreground">{short}</span>
          </div>
        ))}
      </div>

      {/* Mark today button */}
      <div className="mt-4">
        {isTodayCompleted ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="size-4" /> Completed today! 🎉
          </div>
        ) : (
          <Button variant="hero" size="sm" className="w-full gap-2 bg-orange-500 hover:bg-orange-600" onClick={markToday}>
            <Flame className="size-4" /> Mark Today as Completed
          </Button>
        )}
      </div>
    </div>
  );
}

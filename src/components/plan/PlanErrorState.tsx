import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function PlanErrorState({ message, onRetry }: PlanErrorStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
      <span className="grid size-12 place-items-center rounded-2xl border border-destructive/20 bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" />
      </span>
      <div>
        <p className="font-display text-base font-semibold text-destructive">Generation failed</p>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="size-4" /> Try again
        </Button>
      )}
    </div>
  );
}

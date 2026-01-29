import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrialPeriodBadgeProps {
  daysRemaining: number;
  isTrialActive: boolean;
  variant?: "compact" | "full";
}

export function TrialPeriodBadge({ 
  daysRemaining, 
  isTrialActive,
  variant = "compact" 
}: TrialPeriodBadgeProps) {
  if (!isTrialActive) {
    return (
      <div className={cn(
        "flex items-center gap-1.5 rounded-full bg-success/10 text-success",
        variant === "compact" ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm"
      )}>
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span className="font-medium">Monthly Confirmed</span>
      </div>
    );
  }

  const isUrgent = daysRemaining <= 2;

  return (
    <div className={cn(
      "flex items-center gap-1.5 rounded-full",
      isUrgent 
        ? "bg-gold/10 text-gold-foreground" 
        : "bg-primary/10 text-primary",
      variant === "compact" ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm"
    )}>
      {isUrgent ? (
        <AlertCircle className="h-3.5 w-3.5" />
      ) : (
        <Clock className="h-3.5 w-3.5" />
      )}
      <span className="font-medium">
        Trial: {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left
      </span>
    </div>
  );
}

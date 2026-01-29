import { cn } from "@/lib/utils";
import { HiringType } from "@/types/jobServices";
import { Calendar, CalendarDays } from "lucide-react";

interface HiringTypeToggleProps {
  value: HiringType;
  onChange: (type: HiringType) => void;
  dailyRate: number;
  monthlyRate: number;
}

export function HiringTypeToggle({ 
  value, 
  onChange, 
  dailyRate, 
  monthlyRate 
}: HiringTypeToggleProps) {
  const monthlySavings = (dailyRate * 30) - monthlyRate;
  const savingsPercent = Math.round((monthlySavings / (dailyRate * 30)) * 100);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Hiring Type</label>
      <div className="grid grid-cols-2 gap-3">
        {/* Daily Option */}
        <button
          onClick={() => onChange("daily")}
          className={cn(
            "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
            value === "daily"
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-muted-foreground/30"
          )}
        >
          <Calendar className={cn(
            "h-6 w-6",
            value === "daily" ? "text-primary" : "text-muted-foreground"
          )} />
          <span className={cn(
            "font-medium",
            value === "daily" ? "text-primary" : "text-foreground"
          )}>
            Daily
          </span>
          <span className="text-lg font-bold">₹{dailyRate}/day</span>
          <span className="text-xs text-muted-foreground">
            Pay per day worked
          </span>
        </button>

        {/* Monthly Option */}
        <button
          onClick={() => onChange("monthly")}
          className={cn(
            "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
            value === "monthly"
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-muted-foreground/30"
          )}
        >
          {savingsPercent > 0 && (
            <div className="absolute -top-2 -right-2 rounded-full bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
              Save {savingsPercent}%
            </div>
          )}
          <CalendarDays className={cn(
            "h-6 w-6",
            value === "monthly" ? "text-primary" : "text-muted-foreground"
          )} />
          <span className={cn(
            "font-medium",
            value === "monthly" ? "text-primary" : "text-foreground"
          )}>
            Monthly
          </span>
          <span className="text-lg font-bold">₹{monthlyRate}/mo</span>
          <span className="text-xs text-muted-foreground">
            7-day trial first
          </span>
        </button>
      </div>
    </div>
  );
}

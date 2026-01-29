import { JobHiring, MonthlyAttendanceSummary } from "@/types/jobServices";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  Check, 
  Clock, 
  IndianRupee,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface MonthlyPaymentCardProps {
  hiring: JobHiring;
  summary: MonthlyAttendanceSummary;
  onPayNow?: () => void;
}

export function MonthlyPaymentCard({ 
  hiring, 
  summary,
  onPayNow 
}: MonthlyPaymentCardProps) {
  const attendancePercent = Math.round((summary.presentDays / summary.totalDays) * 100);
  const isPending = summary.amountDue > 0;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className={cn(
        "p-4",
        isPending ? "bg-gold/10" : "bg-success/10"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className={cn(
              "h-5 w-5",
              isPending ? "text-gold-foreground" : "text-success"
            )} />
            <span className="font-medium">
              {new Date(summary.month + "-01").toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          {isPending ? (
            <div className="flex items-center gap-1 text-gold-foreground">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Due</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-success">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Paid</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Attendance Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Attendance</span>
            <span className="text-sm font-medium">
              {summary.presentDays}/{summary.totalDays} days
            </span>
          </div>
          <Progress value={attendancePercent} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-success/10 p-2">
            <Check className="h-4 w-4 mx-auto text-success" />
            <p className="text-lg font-bold text-success mt-1">{summary.presentDays}</p>
            <p className="text-xs text-muted-foreground">Present</p>
          </div>
          <div className="rounded-lg bg-destructive/10 p-2">
            <Clock className="h-4 w-4 mx-auto text-destructive" />
            <p className="text-lg font-bold text-destructive mt-1">{summary.missedDays}</p>
            <p className="text-xs text-muted-foreground">Missed</p>
          </div>
          <div className="rounded-lg bg-gold/10 p-2">
            <Clock className="h-4 w-4 mx-auto text-gold-foreground" />
            <p className="text-lg font-bold text-gold-foreground mt-1">{summary.pendingConfirmation}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>

        {/* Payment Amount */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {hiring.hiringType === "monthly" ? "Monthly Payment" : "Total Earned"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <IndianRupee className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{summary.amountDue}</span>
              </div>
            </div>
            {hiring.hiringType === "monthly" && summary.missedDays > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Deduction</p>
                <p className="text-sm font-medium text-destructive">
                  -₹{summary.missedDays * (hiring.monthlyRate / 30)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pay Button */}
        {isPending && onPayNow && (
          <Button onClick={onPayNow} className="w-full">
            <IndianRupee className="h-4 w-4 mr-2" />
            Pay ₹{summary.amountDue}
          </Button>
        )}
      </div>
    </div>
  );
}

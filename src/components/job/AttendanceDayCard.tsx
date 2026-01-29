import { AttendanceRecord } from "@/types/jobServices";
import { cn } from "@/lib/utils";
import { Check, Clock, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendanceDayCardProps {
  date: string;
  record?: AttendanceRecord;
  providerName: string;
  onProviderMark?: () => void;
  onUserConfirm?: () => void;
  isProvider?: boolean;
}

export function AttendanceDayCard({
  date,
  record,
  providerName,
  onProviderMark,
  onUserConfirm,
  isProvider = false,
}: AttendanceDayCardProps) {
  const dateObj = new Date(date);
  const isToday = new Date().toISOString().split("T")[0] === date;
  
  const formattedDate = dateObj.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const canProviderMark = isProvider && (!record || !record.providerMarked);
  const canUserConfirm = !isProvider && record?.providerMarked && !record.userConfirmed;

  return (
    <div className={cn(
      "rounded-xl border p-4",
      isToday ? "border-primary bg-primary/5" : "border-border bg-card",
      record?.isVerified && "border-success/30 bg-success/5"
    )}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={cn(
            "font-medium",
            isToday && "text-primary"
          )}>
            {formattedDate}
          </p>
          {isToday && (
            <span className="text-xs text-primary">Today</span>
          )}
        </div>
        {record?.isVerified && (
          <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs text-success">
            <Check className="h-3 w-3" />
            Verified
          </div>
        )}
      </div>

      <div className="space-y-2">
        {/* Provider Status */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{providerName}</span>
          </div>
          {record?.providerMarked ? (
            <div className="flex items-center gap-1 text-xs text-success">
              <Check className="h-3 w-3" />
              Marked
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Pending
            </div>
          )}
        </div>

        {/* User Status */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Your Confirmation</span>
          </div>
          {record?.userConfirmed ? (
            <div className="flex items-center gap-1 text-xs text-success">
              <Check className="h-3 w-3" />
              Confirmed
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Pending
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      {canProviderMark && onProviderMark && (
        <Button 
          onClick={onProviderMark} 
          className="w-full mt-3"
          size="sm"
        >
          <Check className="h-4 w-4 mr-2" />
          Mark Present Today
        </Button>
      )}

      {canUserConfirm && onUserConfirm && (
        <Button 
          onClick={onUserConfirm} 
          className="w-full mt-3"
          size="sm"
        >
          <Check className="h-4 w-4 mr-2" />
          Confirm Attendance
        </Button>
      )}

      {!canProviderMark && !canUserConfirm && !record?.isVerified && record?.providerMarked && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Waiting for {isProvider ? "user" : "you"} to confirm
        </p>
      )}
    </div>
  );
}

import { useState } from "react";
import { AttendanceRecord } from "@/types/jobServices";
import { cn } from "@/lib/utils";
import { Check, X, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
  hiringStartDate: string;
  onConfirmAttendance?: (date: string) => void;
  isProvider?: boolean; // If true, show provider's mark button
}

export function AttendanceCalendar({ 
  records, 
  hiringStartDate,
  onConfirmAttendance,
  isProvider = false
}: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(hiringStartDate);
  
  // Get days in current month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Get record for a specific date
  const getRecordForDate = (date: Date): AttendanceRecord | undefined => {
    const dateStr = date.toISOString().split("T")[0];
    return records.find((r) => r.date === dateStr);
  };

  // Get status icon and color for a date
  const getDateStatus = (date: Date) => {
    const record = getRecordForDate(date);
    const isBeforeStart = date < startDate;
    const isAfterToday = date > today;
    const dateStr = date.toISOString().split("T")[0];
    const isToday = dateStr === today.toISOString().split("T")[0];

    if (isBeforeStart || isAfterToday) {
      return { status: "disabled", icon: null };
    }

    if (!record) {
      return { status: "missed", icon: <X className="h-3 w-3" /> };
    }

    if (record.isVerified) {
      return { status: "verified", icon: <Check className="h-3 w-3" /> };
    }

    if (isProvider && !record.providerMarked) {
      return { status: "pending", icon: <Clock className="h-3 w-3" /> };
    }

    if (!isProvider && record.providerMarked && !record.userConfirmed) {
      return { status: "awaiting", icon: <Clock className="h-3 w-3" /> };
    }

    return { status: "partial", icon: <Clock className="h-3 w-3" /> };
  };

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Generate calendar grid
  const calendarDays: (Date | null)[] = [];
  
  // Add empty slots for days before the first day
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const { status, icon } = getDateStatus(date);
          const isToday = date.toISOString().split("T")[0] === today.toISOString().split("T")[0];
          const canConfirm = status === "awaiting" && onConfirmAttendance;

          return (
            <button
              key={date.toISOString()}
              onClick={() => canConfirm && onConfirmAttendance(date.toISOString().split("T")[0])}
              disabled={!canConfirm}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative",
                status === "disabled" && "text-muted-foreground/30",
                status === "verified" && "bg-success/10 text-success",
                status === "missed" && "bg-destructive/10 text-destructive",
                status === "awaiting" && "bg-gold/10 text-gold-foreground",
                status === "pending" && "bg-muted text-muted-foreground",
                status === "partial" && "bg-primary/10 text-primary",
                isToday && "ring-2 ring-primary ring-offset-1",
                canConfirm && "cursor-pointer hover:opacity-80 transition-opacity"
              )}
            >
              <span className={cn("font-medium", isToday && "text-primary")}>
                {date.getDate()}
              </span>
              {icon && status !== "disabled" && (
                <span className="absolute bottom-0.5">{icon}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-success/20" />
          <span className="text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-gold/20" />
          <span className="text-muted-foreground">Awaiting</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-destructive/20" />
          <span className="text-muted-foreground">Missed</span>
        </div>
      </div>
    </div>
  );
}

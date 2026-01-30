import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Check, 
  X, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Phone,
  User,
  IndianRupee
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  providerJobHirings, 
  providerAttendanceRecords,
  getSubTaskNames 
} from "@/data/providerJobMockData";
import { AttendanceRecord } from "@/types/jobServices";

const ProviderJobAttendance = () => {
  const { hiringId } = useParams();
  const hiring = providerJobHirings.find((h) => h.id === hiringId);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [records, setRecords] = useState<AttendanceRecord[]>(
    providerAttendanceRecords.filter((r) => r.hiringId === hiringId)
  );

  if (!hiring) {
    return (
      <ProviderLayout>
        <div className="px-4 py-6 text-center">
          <p className="text-muted-foreground">Hiring not found</p>
          <Link to="/provider/jobs">
            <Button variant="link" className="mt-2">Back to Jobs</Button>
          </Link>
        </div>
      </ProviderLayout>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(hiring.startDate);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const getRecordForDate = (date: Date): AttendanceRecord | undefined => {
    const dateStr = date.toISOString().split("T")[0];
    return records.find((r) => r.date === dateStr);
  };

  const handleMarkPresent = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    const existingRecord = getRecordForDate(date);

    if (existingRecord) {
      // Already marked
      toast.info("You've already marked attendance for this day");
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      hiringId: hiring.id,
      date: dateStr,
      providerMarked: true,
      providerMarkedAt: new Date().toISOString(),
      userConfirmed: false,
      isVerified: false,
    };

    setRecords((prev) => [...prev, newRecord]);
    toast.success("Attendance marked!", {
      description: "Waiting for customer confirmation",
    });
  };

  const getDateStatus = (date: Date) => {
    const record = getRecordForDate(date);
    const isBeforeStart = date < startDate;
    const isAfterToday = date > today;
    const dateStr = date.toISOString().split("T")[0];
    const isToday = dateStr === today.toISOString().split("T")[0];

    if (isBeforeStart || isAfterToday) {
      return { status: "disabled", icon: null, canMark: false };
    }

    if (!record) {
      if (isToday) {
        return { status: "mark_today", icon: null, canMark: true };
      }
      return { status: "missed", icon: <X className="h-3 w-3" /> , canMark: false };
    }

    if (record.isVerified) {
      return { status: "verified", icon: <Check className="h-3 w-3" />, canMark: false };
    }

    if (record.providerMarked && !record.userConfirmed) {
      return { status: "pending", icon: <Clock className="h-3 w-3" />, canMark: false };
    }

    return { status: "partial", icon: <Clock className="h-3 w-3" />, canMark: false };
  };

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // Stats calculation
  const stats = useMemo(() => {
    const verified = records.filter((r) => r.isVerified).length;
    const pending = records.filter((r) => r.providerMarked && !r.userConfirmed).length;
    const totalEarned = verified * hiring.dailyRate;
    const pendingAmount = pending * hiring.dailyRate;
    return { verified, pending, totalEarned, pendingAmount };
  }, [records, hiring.dailyRate]);

  return (
    <ProviderLayout>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/provider/jobs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Mark Attendance</h1>
            <p className="text-sm text-muted-foreground">{hiring.customerName}</p>
          </div>
        </div>

        {/* Customer Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{hiring.customerName}</h3>
                <p className="text-sm text-muted-foreground">
                  {getSubTaskNames(hiring.subTaskIds).join(", ")}
                </p>
              </div>
              <Button variant="outline" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{hiring.address}</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{stats.verified}</p>
              <p className="text-sm text-muted-foreground">Days Verified</p>
              <p className="text-xs text-success mt-1">₹{stats.totalEarned} earned</p>
            </CardContent>
          </Card>
          <Card className="bg-gold/10 border-gold/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gold-foreground">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Confirm</p>
              <p className="text-xs text-gold-foreground mt-1">₹{stats.pendingAmount} pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-base">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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

                const { status, icon, canMark } = getDateStatus(date);
                const isToday = date.toISOString().split("T")[0] === today.toISOString().split("T")[0];

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => canMark && handleMarkPresent(date)}
                    disabled={!canMark}
                    className={cn(
                      "aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative",
                      status === "disabled" && "opacity-30 cursor-not-allowed",
                      status === "verified" && "bg-success/20 text-success",
                      status === "pending" && "bg-gold/20 text-gold-foreground",
                      status === "missed" && "bg-destructive/10 text-destructive",
                      status === "mark_today" && "bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 animate-pulse",
                      isToday && status !== "mark_today" && "ring-2 ring-primary"
                    )}
                  >
                    <span className={cn("font-medium", isToday && "font-bold")}>
                      {date.getDate()}
                    </span>
                    {icon && <span className="absolute bottom-1">{icon}</span>}
                    {status === "mark_today" && (
                      <span className="text-[8px] absolute bottom-0.5">TAP</span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-success/20 flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-success" />
            </div>
            <span>Verified</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-gold/20 flex items-center justify-center">
              <Clock className="h-2.5 w-2.5 text-gold-foreground" />
            </div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-destructive/10 flex items-center justify-center">
              <X className="h-2.5 w-2.5 text-destructive" />
            </div>
            <span>Missed</span>
          </div>
        </div>

        {/* Monthly Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This Month Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verified Days</span>
              <span className="font-medium">{stats.verified} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Rate</span>
              <span className="font-medium">₹{hiring.dailyRate}/day</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-medium">Total Earned</span>
              <span className="font-bold text-success">₹{stats.totalEarned}</span>
            </div>
            {stats.pending > 0 && (
              <div className="flex justify-between text-gold-foreground">
                <span className="text-sm">+ Pending confirmation</span>
                <span className="text-sm">₹{stats.pendingAmount}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProviderLayout>
  );
};

export default ProviderJobAttendance;

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Check, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { 
  mockJobHirings, 
  mockAttendanceRecords, 
  jobRoles 
} from "@/data/jobMockData";
import { AttendanceRecord, MonthlyAttendanceSummary } from "@/types/jobServices";
import { AttendanceCalendar } from "@/components/job/AttendanceCalendar";
import { AttendanceDayCard } from "@/components/job/AttendanceDayCard";
import { MonthlyPaymentCard } from "@/components/job/MonthlyPaymentCard";
import { TrialPeriodBadge } from "@/components/job/TrialPeriodBadge";

const JobHiringAttendance = () => {
  const { hiringId } = useParams<{ hiringId: string }>();
  
  const hiring = mockJobHirings.find((h) => h.id === hiringId);
  const [records, setRecords] = useState<AttendanceRecord[]>(
    mockAttendanceRecords.filter((r) => r.hiringId === hiringId)
  );

  if (!hiring) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">Hiring not found</p>
          <Link to="/job-hirings">
            <Button variant="link" className="mt-2">
              Back to Hirings
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const getRoleName = (roleId: string) => {
    return jobRoles.find((r) => r.id === roleId)?.name || roleId;
  };

  const today = new Date().toISOString().split("T")[0];
  const todayRecord = records.find((r) => r.date === today);

  // Calculate monthly summary
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthRecords = records.filter((r) => r.date.startsWith(currentMonth));
  const presentDays = monthRecords.filter((r) => r.isVerified).length;
  const missedDays = monthRecords.filter((r) => !r.isVerified && !r.providerMarked).length;
  const pendingConfirmation = monthRecords.filter((r) => r.providerMarked && !r.userConfirmed).length;
  
  const totalDays = new Date().getDate(); // Days elapsed in current month
  const amountDue = hiring.hiringType === "monthly" && !hiring.isTrialPeriod
    ? hiring.monthlyRate - (missedDays * (hiring.monthlyRate / 30))
    : presentDays * hiring.dailyRate;

  const summary: MonthlyAttendanceSummary = {
    hiringId: hiring.id,
    month: currentMonth,
    totalDays,
    presentDays,
    missedDays,
    pendingConfirmation,
    amountDue,
  };

  // Calculate trial days remaining
  const trialDaysRemaining = hiring.trialEndDate
    ? Math.max(0, Math.ceil((new Date(hiring.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const handleConfirmAttendance = (date: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.date === date
          ? { ...r, userConfirmed: true, userConfirmedAt: new Date().toISOString(), isVerified: true }
          : r
      )
    );
    toast.success("Attendance confirmed!", {
      description: `Marked ${hiring.provider?.name} as present for ${new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
    });
  };

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/job-hirings">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold">{hiring.provider?.name}</h1>
            <p className="text-xs text-muted-foreground">
              {getRoleName(hiring.jobRoleId)} • Attendance
            </p>
          </div>
          {hiring.isTrialPeriod && (
            <TrialPeriodBadge 
              daysRemaining={trialDaysRemaining} 
              isTrialActive={true}
            />
          )}
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Today's Attendance */}
        <div>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Attendance
          </h2>
          <AttendanceDayCard
            date={today}
            record={todayRecord}
            providerName={hiring.provider?.name || "Provider"}
            onUserConfirm={() => handleConfirmAttendance(today)}
          />
        </div>

        {/* Monthly Summary Card */}
        <div>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-primary" />
            This Month
          </h2>
          <MonthlyPaymentCard
            hiring={hiring}
            summary={summary}
            onPayNow={() => {
              toast.success("Payment initiated", {
                description: `₹${summary.amountDue} payment processing...`,
              });
            }}
          />
        </div>

        {/* Calendar View */}
        <div>
          <h2 className="font-semibold mb-3">Attendance Calendar</h2>
          <AttendanceCalendar
            records={records}
            hiringStartDate={hiring.startDate}
            onConfirmAttendance={handleConfirmAttendance}
          />
        </div>

        {/* Attendance Rules */}
        <div className="rounded-lg bg-muted/50 p-4">
          <h3 className="font-medium mb-2">How it works</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
              Provider marks attendance when they arrive
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
              You confirm at the end of the work day
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
              Day is counted only when both confirm
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
              Missed days are not charged
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

export default JobHiringAttendance;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  ChevronRight,
  Clock,
  IndianRupee,
  MapPin,
  User,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { mockJobHirings, jobRoles, jobSubTasks } from "@/data/jobMockData";
import { JobHiring, JobHiringStatus } from "@/types/jobServices";
import { TrialPeriodBadge } from "@/components/job/TrialPeriodBadge";
import { TerminationDialog } from "@/components/job/TerminationDialog";

const statusConfig: Record<JobHiringStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-gold/10 text-gold-foreground" },
  active: { label: "Active", className: "bg-success/10 text-success" },
  trial: { label: "Trial", className: "bg-primary/10 text-primary" },
  monthly_confirmed: { label: "Monthly", className: "bg-success/10 text-success" },
  terminated: { label: "Ended", className: "bg-muted text-muted-foreground" },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground" },
};

const JobHirings = () => {
  const navigate = useNavigate();
  const [hirings, setHirings] = useState(mockJobHirings);

  const activeHirings = hirings.filter(
    (h) => ["pending", "active", "trial", "monthly_confirmed"].includes(h.status)
  );
  const pastHirings = hirings.filter(
    (h) => ["terminated", "completed"].includes(h.status)
  );

  const handleTerminate = (hiringId: string) => {
    setHirings((prev) =>
      prev.map((h) =>
        h.id === hiringId ? { ...h, status: "terminated" as JobHiringStatus } : h
      )
    );
    toast.success("Hiring terminated", {
      description: "Settlement amount will be processed within 24 hours.",
    });
  };

  const getRoleName = (roleId: string) => {
    return jobRoles.find((r) => r.id === roleId)?.name || roleId;
  };

  const getTaskNames = (taskIds: string[]) => {
    return taskIds
      .map((id) => jobSubTasks.find((t) => t.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const calculateTrialDaysRemaining = (trialEndDate?: string) => {
    if (!trialEndDate) return 0;
    const end = new Date(trialEndDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const HiringCard = ({ hiring }: { hiring: JobHiring }) => {
    const status = statusConfig[hiring.status];
    const trialDaysRemaining = calculateTrialDaysRemaining(hiring.trialEndDate);
    const isActive = ["trial", "monthly_confirmed", "active"].includes(hiring.status);

    return (
      <div className="rounded-xl bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
              <span className="text-lg font-semibold text-secondary">
                {hiring.provider?.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{hiring.provider?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {getRoleName(hiring.jobRoleId)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", status.className)}>
              {status.label}
            </span>
            {hiring.status === "trial" && (
              <TrialPeriodBadge 
                daysRemaining={trialDaysRemaining} 
                isTrialActive={true}
                variant="compact"
              />
            )}
          </div>
        </div>

        {/* Services */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">Services</p>
          <p className="text-sm">{getTaskNames(hiring.subTaskIds)}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="rounded-lg bg-muted/50 p-2 text-center">
            <Calendar className="h-4 w-4 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium mt-1">{hiring.daysWorked}</p>
            <p className="text-xs text-muted-foreground">Days</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2 text-center">
            <IndianRupee className="h-4 w-4 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium mt-1">₹{hiring.totalPaid}</p>
            <p className="text-xs text-muted-foreground">Paid</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2 text-center">
            <Clock className="h-4 w-4 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium mt-1">
              {hiring.hiringType === "monthly" ? `₹${hiring.monthlyRate}` : `₹${hiring.dailyRate}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {hiring.hiringType === "monthly" ? "/mo" : "/day"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/job-hirings/${hiring.id}/attendance`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Attendance
            </Button>
          </Link>
          {isActive && (
            <TerminationDialog 
              hiring={hiring} 
              onConfirmTermination={() => handleTerminate(hiring.id)}
            >
              <Button variant="ghost" size="sm" className="text-destructive">
                <XCircle className="h-4 w-4 mr-1" />
                End
              </Button>
            </TerminationDialog>
          )}
        </div>

        {/* Trial Action */}
        {hiring.status === "trial" && trialDaysRemaining === 0 && (
          <Button 
            className="w-full mt-3"
            onClick={() => {
              setHirings((prev) =>
                prev.map((h) =>
                  h.id === hiring.id ? { ...h, status: "monthly_confirmed" as JobHiringStatus, isTrialPeriod: false } : h
                )
              );
              toast.success("Monthly hire confirmed!", {
                description: `${hiring.provider?.name} is now your monthly ${getRoleName(hiring.jobRoleId)}.`,
              });
            }}
          >
            Confirm Monthly Hire - ₹{hiring.monthlyRate}/mo
          </Button>
        )}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">My Hirings</h1>
          <Link to="/services/job-services">
            <Button size="sm">
              Hire Staff
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active ({activeHirings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastHirings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4 space-y-4">
            {activeHirings.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No active hirings</p>
                <Link to="/services/job-services">
                  <Button variant="link" className="mt-2">
                    Hire staff now
                  </Button>
                </Link>
              </div>
            ) : (
              activeHirings.map((hiring) => (
                <HiringCard key={hiring.id} hiring={hiring} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4 space-y-4">
            {pastHirings.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No past hirings</p>
              </div>
            ) : (
              pastHirings.map((hiring) => (
                <HiringCard key={hiring.id} hiring={hiring} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default JobHirings;

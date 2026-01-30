import { useState } from "react";
import { Link } from "react-router-dom";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle,
  User,
  Clock,
  Briefcase,
  IndianRupee
} from "lucide-react";
import { toast } from "sonner";
import { 
  providerJobHirings, 
  providerJobRequests,
  getJobRoleName,
  getSubTaskNames
} from "@/data/providerJobMockData";
import { JobHiring, JobHiringStatus } from "@/types/jobServices";

// Calculate trial days remaining
function getTrialDaysRemaining(trialEndDate: string): number {
  const end = new Date(trialEndDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

const ProviderJobHirings = () => {
  const [hirings, setHirings] = useState(providerJobHirings);
  const [requests, setRequests] = useState(providerJobRequests);

  const activeHirings = hirings.filter(
    (h) => h.status === "trial" || h.status === "monthly_confirmed"
  );
  const pastHirings = hirings.filter(
    (h) => h.status === "completed" || h.status === "terminated"
  );

  const handleAcceptRequest = (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    const newHiring: JobHiring = {
      id: `hiring-${Date.now()}`,
      userId: "customer-new",
      providerId: "provider-current",
      jobRoleId: request.jobRole,
      subTaskIds: request.subTaskIds,
      hiringType: request.hiringType,
      status: request.hiringType === "monthly" ? "trial" : "monthly_confirmed",
      startDate: new Date().toISOString().split("T")[0],
      trialEndDate: request.hiringType === "monthly" 
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        : undefined,
      isTrialPeriod: request.hiringType === "monthly",
      address: request.address,
      dailyRate: request.dailyRate,
      monthlyRate: request.monthlyRate,
      totalPaid: 0,
      daysWorked: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerName: request.customerName,
      customerPhone: request.customerPhone,
    };

    setHirings((prev) => [newHiring, ...prev]);
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    toast.success("Job request accepted!", {
      description: `You're now working for ${request.customerName}`,
    });
  };

  const handleDeclineRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    toast.info("Request declined");
  };

  const RequestCard = ({ request }: { request: typeof providerJobRequests[0] }) => (
    <Card className="border-gold/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{request.customerName}</h3>
              <p className="text-sm text-muted-foreground">
                {getSubTaskNames(request.subTaskIds).join(", ")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant={request.hiringType === "monthly" ? "default" : "secondary"}>
              {request.hiringType === "monthly" ? "Monthly" : "Daily"}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">{request.distance} km away</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <IndianRupee className="h-4 w-4" />
            <span>
              {request.hiringType === "monthly" 
                ? `₹${request.monthlyRate}/mo` 
                : `₹${request.dailyRate}/day`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="truncate max-w-[180px]">{request.address}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => handleDeclineRequest(request.id)}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Decline
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => handleAcceptRequest(request.id)}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const HiringCard = ({ hiring }: { hiring: JobHiring }) => {
    const isActive = hiring.status === "trial" || hiring.status === "monthly_confirmed";

    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{hiring.customerName || "Customer"}</h3>
                  {hiring.status === "trial" && hiring.trialEndDate && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gold/10 text-gold-foreground">
                      Trial: {getTrialDaysRemaining(hiring.trialEndDate)} days left
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {getSubTaskNames(hiring.subTaskIds).join(", ")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">
                ₹{hiring.hiringType === "monthly" ? hiring.monthlyRate : hiring.dailyRate}
                <span className="text-xs font-normal text-muted-foreground">
                  /{hiring.hiringType === "monthly" ? "mo" : "day"}
                </span>
              </p>
              <Badge 
                variant={isActive ? "default" : "secondary"}
                className="text-xs mt-1"
              >
                {hiring.status === "trial" ? "Trial" : 
                 hiring.status === "monthly_confirmed" ? "Monthly" : 
                 hiring.status === "terminated" ? "Terminated" : "Completed"}
              </Badge>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{hiring.daysWorked} days worked</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="truncate max-w-[180px]">{hiring.address}</span>
            </div>
          </div>

          {isActive && (
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <Link to={`/provider/jobs/${hiring.id}/attendance`} className="flex-1">
                <Button size="sm" className="w-full">
                  <Calendar className="h-4 w-4 mr-1" />
                  Mark Attendance
                </Button>
              </Link>
            </div>
          )}

          {!isActive && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Earned</span>
                <span className="font-medium text-success">₹{hiring.totalPaid}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <ProviderLayout>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">My Jobs</h1>
          <Link to="/provider/jobs/profile">
            <Button variant="outline" size="sm">
              <Briefcase className="h-4 w-4 mr-1" />
              My Job Profile
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests" className="relative">
              Requests
              {requests.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {requests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">Active ({activeHirings.length})</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-4 space-y-3">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No new job requests</p>
                </CardContent>
              </Card>
            ) : (
              requests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-4 space-y-3">
            {activeHirings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No active jobs</p>
                </CardContent>
              </Card>
            ) : (
              activeHirings.map((hiring) => (
                <HiringCard key={hiring.id} hiring={hiring} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4 space-y-3">
            {pastHirings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No past jobs</p>
                </CardContent>
              </Card>
            ) : (
              pastHirings.map((hiring) => (
                <HiringCard key={hiring.id} hiring={hiring} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProviderLayout>
  );
};

export default ProviderJobHirings;

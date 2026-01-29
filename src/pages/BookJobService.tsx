import { useState, useMemo } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  CheckCircle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  jobRoles, 
  getSubTasksForRole,
  getProvidersForRole,
  jobSubTasks
} from "@/data/jobMockData";
import { JobProvider, JobRole, HiringType } from "@/types/jobServices";
import { HiringTypeToggle } from "@/components/job/HiringTypeToggle";
import { TrialPeriodBadge } from "@/components/job/TrialPeriodBadge";
import { JobProviderCard } from "@/components/job/JobProviderCard";

type BookingStep = "details" | "providers" | "confirm";

// Mock user location
const USER_LOCATION = {
  latitude: 12.9352,
  longitude: 77.6245,
};

// Calculate distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const BookJobService = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const taskId = searchParams.get("task");
  
  const [step, setStep] = useState<BookingStep>("details");
  const [selectedProvider, setSelectedProvider] = useState<JobProvider | null>(null);
  const [hiringType, setHiringType] = useState<HiringType>("daily");
  const [startDate, setStartDate] = useState("");
  const [address, setAddress] = useState("123, 4th Cross, Koramangala, Bangalore - 560034");
  const [notes, setNotes] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>(
    taskId && taskId !== "all" ? [taskId] : []
  );

  const role = jobRoles.find((r) => r.id === roleId);
  const subTasks = roleId ? getSubTasksForRole(roleId as JobRole) : [];
  const task = taskId !== "all" ? jobSubTasks.find((t) => t.id === taskId) : null;

  // Get providers sorted by distance
  const sortedProviders = useMemo(() => {
    if (!roleId) return [];
    return getProvidersForRole(roleId as JobRole)
      .map((p) => ({
        ...p,
        distance: calculateDistance(
          USER_LOCATION.latitude,
          USER_LOCATION.longitude,
          p.latitude,
          p.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [roleId]);

  // Generate next 14 days for date selection
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    };
  });

  // Toggle sub-task selection
  const toggleTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((t) => t !== taskId)
        : [...prev, taskId]
    );
  };

  // Calculate trial end date (7 days from start)
  const trialEndDate = startDate
    ? new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : "";

  const handleSubmit = () => {
    if (!selectedProvider) return;
    
    const price = hiringType === "daily" 
      ? selectedProvider.dailyRate 
      : selectedProvider.monthlyRate;
    
    toast.success(
      hiringType === "monthly" 
        ? "Trial period started!" 
        : "Booking confirmed!",
      {
        description: hiringType === "monthly"
          ? `7-day trial with ${selectedProvider.name}. Daily rate: ₹${selectedProvider.dailyRate}/day`
          : `₹${price} for ${selectedProvider.name} on ${new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
      }
    );
    navigate("/job-hirings");
  };

  const handleBack = () => {
    if (step === "details") {
      navigate(`/job-services/${roleId}`);
    } else if (step === "providers") {
      setStep("details");
    } else {
      setStep("providers");
    }
  };

  if (!role) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">Role not found</p>
          <Link to="/services/job-services">
            <Button variant="link" className="mt-2">
              Back to Job Services
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold">Hire {role.name}</h1>
            <p className="text-xs text-muted-foreground">
              {step === "details" && "Select your requirements"}
              {step === "providers" && "Choose a provider"}
              {step === "confirm" && "Review & confirm"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-4 py-3">
        {["details", "providers", "confirm"].map((s, i) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= ["details", "providers", "confirm"].indexOf(step)
                ? "bg-primary"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      <div className="px-4 pb-24">
        {/* Step 1: Details */}
        {step === "details" && (
          <div className="space-y-6">
            {/* Hiring Type Toggle */}
            <HiringTypeToggle
              value={hiringType}
              onChange={setHiringType}
              dailyRate={sortedProviders[0]?.dailyRate || 500}
              monthlyRate={sortedProviders[0]?.monthlyRate || 12000}
            />

            {/* Trial Period Info for Monthly */}
            {hiringType === "monthly" && (
              <div className="rounded-lg bg-primary/10 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-primary">7-Day Trial Period</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      First 7 days are trial. You pay daily rate only for days worked. 
                      Cancel anytime during trial with no commitment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-task Selection */}
            <div>
              <label className="mb-3 block text-sm font-medium">
                Select Services Required
              </label>
              <div className="space-y-2">
                {subTasks.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => toggleTask(st.id)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-lg border p-3 text-left transition-colors",
                      selectedTasks.includes(st.id)
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    )}
                  >
                    <div>
                      <p className="font-medium">{st.name}</p>
                      <p className="text-sm text-muted-foreground">{st.description}</p>
                    </div>
                    <div className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                      selectedTasks.includes(st.id)
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {selectedTasks.includes(st.id) && (
                        <CheckCircle className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {hiringType === "daily" ? "Select Date" : "Start Date"}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setStartDate(d.value)}
                    className={cn(
                      "flex shrink-0 flex-col items-center rounded-lg border px-3 py-2 transition-colors min-w-[60px]",
                      startDate === d.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card"
                    )}
                  >
                    <span className="text-xs">{d.day}</span>
                    <span className="text-lg font-semibold">{d.date}</span>
                    <span className="text-xs">{d.month}</span>
                  </button>
                ))}
              </div>
              {hiringType === "monthly" && startDate && (
                <p className="text-xs text-muted-foreground mt-2">
                  Trial ends: {new Date(trialEndDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Work Address</span>
              </div>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete address"
                rows={2}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Special Instructions (Optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requirements..."
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Step 2: Provider Selection */}
        {step === "providers" && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      {hiringType === "daily" ? "Daily Hire" : "Monthly Hire"}
                    </p>
                    {hiringType === "monthly" && (
                      <TrialPeriodBadge daysRemaining={7} isTrialActive={true} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Starting {new Date(startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setStep("details")}
                  className="text-primary"
                >
                  Edit
                </Button>
              </div>
            </div>

            {/* Providers List */}
            <div>
              <h2 className="font-semibold mb-3">
                Available {role.name}s ({sortedProviders.length})
              </h2>
              <div className="space-y-3">
                {sortedProviders.map((provider) => (
                  <JobProviderCard
                    key={provider.id}
                    provider={provider}
                    distance={provider.distance}
                    selected={selectedProvider?.id === provider.id}
                    onSelect={() => setSelectedProvider(provider)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === "confirm" && selectedProvider && (
          <div className="space-y-4">
            {/* Summary Card */}
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Hiring Summary</h3>
                {hiringType === "monthly" && (
                  <TrialPeriodBadge daysRemaining={7} isTrialActive={true} />
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-medium">{selectedProvider.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium">{role.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hiring Type</span>
                  <span className="font-medium capitalize">{hiringType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">
                    {new Date(startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {hiringType === "monthly" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trial Ends</span>
                    <span className="font-medium">
                      {new Date(trialEndDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">Services</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedTasks.map((id) => {
                      const t = jobSubTasks.find((st) => st.id === id);
                      return t ? (
                        <span
                          key={id}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                        >
                          {t.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm">{address}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-xl bg-secondary/10 p-4">
              <h4 className="font-medium mb-3">Payment Details</h4>
              <div className="space-y-2">
                {hiringType === "daily" ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Daily Rate</span>
                      <span className="font-bold text-primary">
                        ₹{selectedProvider.dailyRate}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Payment after work confirmation
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Daily Rate (Trial)</span>
                      <span className="font-medium">₹{selectedProvider.dailyRate}/day</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Rate</span>
                      <span className="font-bold text-primary">
                        ₹{selectedProvider.monthlyRate}/month
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      During 7-day trial, you pay ₹{selectedProvider.dailyRate}/day for days worked. 
                      Monthly rate applies after trial confirmation.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 safe-area-bottom">
        {step === "details" && (
          <Button
            onClick={() => setStep("providers")}
            className="w-full"
            disabled={!startDate || selectedTasks.length === 0}
          >
            Find Providers
          </Button>
        )}
        {step === "providers" && (
          <Button
            onClick={() => setStep("confirm")}
            className="w-full"
            disabled={!selectedProvider}
          >
            Continue with {selectedProvider?.name || "Selected Provider"}
          </Button>
        )}
        {step === "confirm" && (
          <Button onClick={handleSubmit} className="w-full">
            {hiringType === "monthly" ? "Start Trial Period" : "Confirm Booking"}
          </Button>
        )}
      </div>
    </AppLayout>
  );
};

export default BookJobService;

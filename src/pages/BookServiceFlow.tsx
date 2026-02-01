import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Send,
  Loader2,
  XCircle,
  Key,
  Copy,
  Phone,
  Navigation
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  getCategoryById, 
  getProblemsByCategory, 
  getProvidersByCategory,
} from "@/data/categoriesData";
import { ServiceProvider, HiringType } from "@/types/services";
import { WaveRequestCard } from "@/components/booking/WaveRequestCard";
import { WaveRequestTimer } from "@/components/booking/WaveRequestTimer";
import { useWaveRequest } from "@/hooks/useWaveRequest";

// Flow: Schedule → Wave Request → Confirmation (with OTP)
type BookingStep = "schedule" | "wave" | "confirm";

const WAVE_TIMEOUT = 45; // seconds to wait for provider response

// Mock user location
const USER_LOCATION = { latitude: 12.9352, longitude: 77.6245 };

// Calculate distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Generate 4-digit OTP
function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
];

const BookServiceFlow = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const categoryId = searchParams.get("category") || "";
  const problemIds = searchParams.get("problems")?.split(",") || [];
  const hiringType = (searchParams.get("hiringType") as HiringType) || "task";

  const [step, setStep] = useState<BookingStep>("schedule");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("123, 4th Cross, Koramangala, Bangalore - 560034");
  const [notes, setNotes] = useState("");
  const [bookingOTP, setBookingOTP] = useState<string>("");
  const [bookingId, setBookingId] = useState<string>("");

  const category = getCategoryById(categoryId);
  const problems = getProblemsByCategory(categoryId).filter(p => problemIds.includes(p.id));
  
  // Get and sort providers by distance
  const providers = useMemo(() => {
    return getProvidersByCategory(categoryId)
      .map(p => ({
        ...p,
        distance: calculateDistance(USER_LOCATION.latitude, USER_LOCATION.longitude, p.latitude, p.longitude)
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [categoryId]);

  // Calculate total price for selected provider
  const calculateTotal = useCallback((provider: ServiceProvider) => {
    if (hiringType === "monthly" && provider.monthlyRate) {
      return provider.monthlyRate;
    }
    if (hiringType === "daily" && provider.dailyRate) {
      return provider.dailyRate;
    }
    // Task-based: sum of individual prices
    return problemIds.reduce((sum, pid) => sum + (provider.taskPrices[pid] || 0), 0);
  }, [hiringType, problemIds]);

  const totalPrice = selectedProvider ? calculateTotal(selectedProvider) : 0;
  const advanceAmount = Math.round(totalPrice * 0.37);
  const remainingAmount = totalPrice - advanceAmount;

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      isToday: i === 0,
    };
  });

  // Wave request hook
  const {
    state: waveState,
    providersWithStatus,
    acceptedProvider,
    sendWaveRequest,
    handleTimeout: handleWaveTimeout,
    cancelRequest,
    reset: resetWave,
    isWaiting,
  } = useWaveRequest({
    providers,
    onProviderAccepted: (provider) => {
      setSelectedProvider(provider as ServiceProvider);
      // Generate OTP and booking ID
      const otp = generateOTP();
      const bId = `BK${Date.now().toString().slice(-8)}`;
      setBookingOTP(otp);
      setBookingId(bId);
      
      toast.success(`${provider.name} accepted your request!`, {
        description: "Booking confirmed. Share OTP when provider arrives.",
      });
      
      // Move to confirmation step
      setTimeout(() => {
        setStep("confirm");
      }, 1500);
    },
    onTimeout: () => {
      toast.error("No providers responded", {
        description: "Please try again or select a different time.",
      });
    },
  });

  // After scheduling, send wave request
  const handleScheduleConfirm = () => {
    setStep("wave");
    sendWaveRequest();
  };

  const handleBack = () => {
    if (step === "schedule") {
      navigate(-1);
    } else if (step === "wave") {
      cancelRequest();
      resetWave();
      setStep("schedule");
    } else if (step === "confirm") {
      // Can't go back from confirmed booking
      navigate("/bookings");
    }
  };

  const handleRetryWave = () => {
    resetWave();
    sendWaveRequest();
  };

  const handleCopyOTP = () => {
    navigator.clipboard.writeText(bookingOTP);
    toast.success("OTP copied to clipboard");
  };

  const handleViewBooking = () => {
    navigate("/bookings");
  };

  if (!category || problems.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">Invalid booking request</p>
          <Link to="/">
            <Button variant="link" className="mt-2">Back to Home</Button>
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
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold">{category.name}</h1>
            <p className="text-xs text-muted-foreground">
              {step === "schedule" && "Choose date & time"}
              {step === "wave" && "Finding available provider"}
              {step === "confirm" && "Booking confirmed!"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-4 py-3">
        {["schedule", "wave", "confirm"].map((s, i) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= ["schedule", "wave", "confirm"].indexOf(step) ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      <div className="px-4 pb-24">
        {/* Selected Services Summary */}
        <div className="mb-4 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {problems.length} {problems.length === 1 ? "service" : "services"} selected
                {hiringType !== "task" && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {hiringType === "monthly" ? "Monthly" : "Daily"}
                  </Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {problems.map(p => p.name).join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Schedule Selection */}
        {step === "schedule" && (
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Select Date</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDate(d.value)}
                    className={cn(
                      "flex shrink-0 flex-col items-center rounded-lg border px-4 py-2 transition-colors",
                      selectedDate === d.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card"
                    )}
                  >
                    <span className="text-xs">{d.isToday ? "Today" : d.day}</span>
                    <span className="text-lg font-semibold">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Select Time</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "rounded-lg border px-2 py-2.5 text-sm transition-colors",
                      selectedTime === time
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Service Address</span>
              </div>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Additional Notes (Optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific instructions for the provider..."
                rows={2}
              />
            </div>

            {/* Nearby Providers Preview */}
            <div>
              <h3 className="font-medium mb-3">
                {providers.length} providers available nearby
              </h3>
              <div className="flex -space-x-2 overflow-hidden">
                {providers.slice(0, 5).map((provider, i) => (
                  <div
                    key={provider.id}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary/10"
                    style={{ zIndex: 5 - i }}
                  >
                    <span className="text-sm font-medium text-primary">
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                ))}
                {providers.length > 5 && (
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted">
                    <span className="text-xs font-medium">+{providers.length - 5}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your request will be sent to all nearby providers. First to accept gets the job!
              </p>
            </div>

            {/* Continue Button */}
            <Button 
              className="w-full" 
              size="lg"
              disabled={!selectedDate || !selectedTime || !address.trim()}
              onClick={handleScheduleConfirm}
            >
              <Send className="h-4 w-4 mr-2" />
              Find Provider
            </Button>
          </div>
        )}

        {/* Step 2: Wave Request - Finding provider */}
        {step === "wave" && (
          <div className="space-y-4">
            {/* Booking Details Summary */}
            <div className="rounded-lg bg-muted/50 p-3 mb-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(selectedDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedTime}</span>
                </div>
              </div>
            </div>

            {/* Timer */}
            <WaveRequestTimer
              duration={WAVE_TIMEOUT}
              isActive={isWaiting}
              onTimeout={handleWaveTimeout}
            />

            {/* Status message */}
            {waveState === "accepted" && acceptedProvider && (
              <div className="rounded-xl bg-success/10 p-4 text-center">
                <CheckCircle className="h-8 w-8 mx-auto text-success mb-2" />
                <h3 className="font-semibold text-success">Provider Found!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {acceptedProvider.name} accepted your request
                </p>
              </div>
            )}

            {waveState === "timeout" && (
              <div className="rounded-xl bg-destructive/10 p-4 text-center">
                <XCircle className="h-8 w-8 mx-auto text-destructive mb-2" />
                <h3 className="font-semibold text-destructive">No Response</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Providers are busy. Try again or choose a different time.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" onClick={handleBack}>
                    Change Time
                  </Button>
                  <Button className="flex-1" onClick={handleRetryWave}>
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Provider status cards */}
            {waveState !== "timeout" && (
              <div className="space-y-3">
                <h3 className="font-semibold">Provider Responses</h3>
                {providersWithStatus.slice(0, 5).map((provider) => (
                  <WaveRequestCard
                    key={provider.id}
                    provider={provider}
                    status={provider.waveStatus}
                  />
                ))}
              </div>
            )}

            {/* Cancel button */}
            {isWaiting && (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleBack}
              >
                Cancel Request
              </Button>
            )}
          </div>
        )}

        {/* Step 3: Confirmation with OTP */}
        {step === "confirm" && selectedProvider && (
          <div className="space-y-4">
            {/* Success Banner */}
            <div className="rounded-xl bg-success/10 p-6 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-success mb-3" />
              <h2 className="text-xl font-bold text-success">Booking Confirmed!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Booking ID: {bookingId}
              </p>
            </div>

            {/* OTP Card - Uber style */}
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Key className="h-5 w-5 text-primary" />
                  <span className="font-medium text-primary">Start Work OTP</span>
                </div>
                <div className="flex items-center justify-center gap-4 my-4">
                  {bookingOTP.split("").map((digit, i) => (
                    <div
                      key={i}
                      className="h-14 w-14 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold"
                    >
                      {digit}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyOTP}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy OTP
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Share this OTP only when provider arrives at your location
                </p>
              </div>
            </div>

            {/* Provider Card */}
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Your Provider</h3>
              <div className="flex items-start gap-3">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-semibold text-primary">
                    {selectedProvider.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{selectedProvider.name}</h3>
                    {selectedProvider.verified && (
                      <Shield className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    <span className="text-sm">{selectedProvider.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({selectedProvider.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{selectedProvider.distance?.toFixed(1)} km away</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => window.open("tel:+919876543210")}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => toast.info("Opening navigation...")}
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Services</span>
                  <span className="font-medium text-right max-w-[60%]">
                    {problems.map(p => p.name).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      weekday: "short",
                    })}, {selectedTime}
                  </span>
                </div>
                {hiringType !== "task" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hiring Type</span>
                    <Badge variant="secondary">
                      {hiringType === "monthly" ? "Monthly" : "Daily"}
                    </Badge>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm">{address}</p>
                </div>
                {notes && (
                  <div>
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="text-sm">{notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="rounded-xl bg-primary/5 p-4">
              <h4 className="font-medium mb-3">Payment Details</h4>
              <div className="space-y-2">
                {hiringType === "task" && problems.map((prob) => (
                  <div key={prob.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{prob.name}</span>
                    <span>₹{selectedProvider.taskPrices[prob.id] || prob.basePrice}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium border-t border-border pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Advance (37%)</span>
                  <span className="font-bold text-primary">₹{advanceAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pay after service</span>
                  <span>₹{remainingAmount}</span>
                </div>
              </div>
            </div>

            {/* Trial Period Notice */}
            {hiringType === "monthly" && (
              <div className="rounded-xl bg-gold/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-gold-foreground shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gold-foreground">7-Day Trial Period</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cancel anytime in first 7 days. Only pay for days worked.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* View Booking Button */}
            <Button className="w-full" size="lg" onClick={handleViewBooking}>
              View My Bookings
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BookServiceFlow;

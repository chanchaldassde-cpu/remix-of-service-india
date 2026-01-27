import { useState, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { serviceProblems, serviceProviders, serviceCategories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle, Shield, AlertCircle, Info, Send, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ServiceProvider } from "@/types";
import { WaveRequestCard } from "@/components/booking/WaveRequestCard";
import { WaveRequestTimer } from "@/components/booking/WaveRequestTimer";
import { ProviderMap } from "@/components/booking/ProviderMap";
import { useWaveRequest } from "@/hooks/useWaveRequest";

// New flow: details → wave → confirm
type BookingStep = "details" | "wave" | "confirm";

// Wave request timeout duration in seconds
const WAVE_TIMEOUT_SECONDS = 30;

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

// Mock user location (Koramangala center)
const USER_LOCATION = {
  latitude: 12.9352,
  longitude: 77.6245,
};

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const BookService = () => {
  const { categoryId, problemId } = useParams();
  const navigate = useNavigate();
  
  // Step 1: Details first, Step 2: Wave request, Step 3: Confirm
  const [step, setStep] = useState<BookingStep>("details");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("123, 4th Cross, Koramangala, Bangalore - 560034");
  const [notes, setNotes] = useState("");

  const problem = serviceProblems.find((p) => p.id === problemId);
  const category = serviceCategories.find((c) => c.id === categoryId);

  // Sort providers by distance from user
  const sortedProviders = useMemo(() => {
    return serviceProviders
      .map(p => ({
        ...p,
        distance: calculateDistance(
          USER_LOCATION.latitude,
          USER_LOCATION.longitude,
          p.latitude,
          p.longitude
        )
      }))
      .sort((a, b) => a.distance - b.distance);
  }, []);

  // Handle provider acceptance from wave request
  const handleProviderAccepted = useCallback((provider: ServiceProvider) => {
    setSelectedProvider(provider);
    toast.success(`${provider.name} accepted your request!`, {
      description: "Redirecting to payment...",
    });
    // Auto-redirect to confirm/payment step after brief delay
    setTimeout(() => {
      setStep("confirm");
    }, 1500);
  }, []);

  // Handle wave request timeout
  const handleWaveTimeout = useCallback(() => {
    toast.error("No providers available", {
      description: "All providers are busy. Please try again or select a different time slot.",
    });
  }, []);

  // Wave request hook - manages simulated real-time responses
  const {
    state: waveState,
    providersWithStatus,
    sendWaveRequest,
    handleTimeout,
    cancelRequest,
    reset: resetWave,
    isWaiting,
  } = useWaveRequest({
    providers: sortedProviders,
    onProviderAccepted: handleProviderAccepted,
    onTimeout: handleWaveTimeout,
  });

  // Calculate pricing based on selected provider
  const totalPrice = selectedProvider?.fixedPrice || sortedProviders[0]?.fixedPrice || 0;
  const advanceAmount = Math.round(totalPrice * 0.37); // 37% advance
  const remainingAmount = totalPrice - advanceAmount; // 63% remaining

  // Generate next 7 days for date selection
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
    };
  });

  // Handle final booking submission
  const handleSubmit = () => {
    toast.success("Booking confirmed!", {
      description: `₹${advanceAmount} advance paid. Service scheduled for ${new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${selectedTime}`,
    });
    navigate("/bookings");
  };

  // Handle back navigation between steps
  const handleBack = () => {
    if (step === "details") {
      navigate(`/services/${categoryId}`);
    } else if (step === "wave") {
      cancelRequest(); // Cancel any pending wave request
      setStep("details");
    } else {
      resetWave();
      setStep("wave");
    }
  };

  if (!problem || !category) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">Service not found</p>
          <Link to="/services">
            <Button variant="link" className="mt-2">
              Back to Services
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showHeader={false}>
      {/* Custom Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={handleBack}
            disabled={isWaiting} // Prevent back during wave request
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold">{problem.name}</h1>
            <p className="text-xs text-muted-foreground">
              {step === "details" && "Enter your slot details"}
              {step === "wave" && "Broadcasting to nearby providers"}
              {step === "confirm" && "Review & pay advance"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-1 px-4 py-3">
        {["details", "wave", "confirm"].map((s, i) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= ["details", "wave", "confirm"].indexOf(step)
                ? "bg-primary"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      <div className="px-4 pb-24">
        {/* Step 1: Schedule Details */}
        {step === "details" && (
          <div className="space-y-6">
            {/* Problem Info */}
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm font-medium">{problem.name}</p>
              <p className="text-xs text-muted-foreground">
                {problem.description} • {problem.estimatedTime}
              </p>
            </div>

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
                    <span className="text-xs">{d.day}</span>
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
                placeholder="Enter your complete address"
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
                placeholder="Any specific instructions for the professional..."
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Step 2: Wave Request - Send to Multiple Providers */}
        {step === "wave" && (
          <div className="space-y-4">
            {/* Slot Summary */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {new Date(selectedDate).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })} at {selectedTime}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{address}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    cancelRequest();
                    setStep("details");
                  }}
                  className="text-primary"
                  disabled={isWaiting}
                >
                  Edit
                </Button>
              </div>
            </div>

            {/* Wave Request Info Banner */}
            {waveState === "idle" && (
              <div className="rounded-lg bg-primary/10 p-4">
                <div className="flex items-start gap-3">
                  <Radio className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-primary">Wave Request</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Send your booking request to all {sortedProviders.length} nearby providers at once. 
                      The first one to accept will be assigned to your job.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timer - Only shown during active wave request */}
            <WaveRequestTimer
              duration={WAVE_TIMEOUT_SECONDS}
              isActive={isWaiting}
              onTimeout={handleTimeout}
            />

            {/* Wave State Messages */}
            {waveState === "accepted" && selectedProvider && (
              <div className="rounded-lg bg-success/10 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium text-success">Provider Found!</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedProvider.name} accepted your request
                    </p>
                  </div>
                </div>
              </div>
            )}

            {waveState === "timeout" && (
              <div className="rounded-lg bg-destructive/10 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Request Timed Out</p>
                    <p className="text-sm text-muted-foreground">
                      No providers accepted. Try a different time slot.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Map - Shows provider locations with status */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">
                  {waveState === "idle" ? "Nearby Providers" : "Live Provider Status"}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {sortedProviders.length} providers within 5km
                </span>
              </div>
              <ProviderMap
                userLocation={USER_LOCATION}
                providers={providersWithStatus}
                isWaveActive={isWaiting || waveState === "accepted" || waveState === "timeout"}
              />
            </div>

            {/* Providers List with Wave Status */}
            <div>
              <h2 className="font-semibold mb-3">
                {waveState === "idle" ? "Available Professionals" : "Request Status"}
              </h2>
              <div className="space-y-3">
                {providersWithStatus.map((p) => (
                  <WaveRequestCard
                    key={p.id}
                    provider={p}
                    status={p.waveStatus}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation with Payment */}
        {step === "confirm" && selectedProvider && (
          <div className="space-y-4">
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <h3 className="font-semibold">Booking Summary</h3>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{problem.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Professional</span>
                  <span className="font-medium">{selectedProvider.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}, {selectedTime}
                  </span>
                </div>
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
            <div className="rounded-xl bg-secondary/10 p-4">
              <h4 className="font-medium mb-3">Payment Details</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Service Price</span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Advance (37%)</span>
                  <span className="font-bold text-primary">₹{advanceAmount}</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-border pt-2">
                  <span className="text-muted-foreground">Pay after service</span>
                  <span className="font-medium">₹{remainingAmount}</span>
                </div>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="rounded-lg bg-gold/10 p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-gold">Refund Policy</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Advance is refundable up to 50% if cancelled. Full refund if provider doesn't show up.
                  </p>
                </div>
              </div>
            </div>

            {/* Late Penalty Info */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Provider Late Policy</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    ₹5 deducted from provider's payment for every 10 minutes late.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Provider marks work complete → You confirm → Pay rest</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm">
                <Shield className="h-4 w-4 text-accent" />
                <span>Rate & review after service completion</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-border bg-card p-4 safe-area-bottom md:bottom-0">
        {/* Step 1: Proceed to Wave Request */}
        {step === "details" && (
          <Button
            className="w-full"
            size="lg"
            disabled={!selectedDate || !selectedTime || !address}
            onClick={() => setStep("wave")}
          >
            Find Available Professionals
          </Button>
        )}

        {/* Step 2: Wave Request Actions */}
        {step === "wave" && (
          <>
            {waveState === "idle" && (
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={sendWaveRequest}
              >
                <Send className="h-4 w-4" />
                Send Wave Request to All Providers
              </Button>
            )}

            {isWaiting && (
              <Button
                className="w-full"
                size="lg"
                variant="outline"
                onClick={cancelRequest}
              >
                Cancel Request
              </Button>
            )}

            {waveState === "timeout" && (
              <div className="space-y-2">
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => {
                    resetWave();
                    sendWaveRequest();
                  }}
                >
                  <Send className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  variant="ghost"
                  onClick={() => {
                    resetWave();
                    setStep("details");
                  }}
                >
                  Change Time Slot
                </Button>
              </div>
            )}
          </>
        )}

        {/* Step 3: Payment */}
        {step === "confirm" && (
          <div className="space-y-2">
            <Button
              className="w-full bg-secondary hover:bg-secondary/90"
              size="lg"
              onClick={handleSubmit}
            >
              Pay ₹{advanceAmount} Advance & Book
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              ₹{remainingAmount} to be paid after service completion
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BookService;
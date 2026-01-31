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
  Radio,
  Send
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  getCategoryById, 
  getProblemsByCategory, 
  getProvidersByCategory,
  getProviderPrice,
  serviceProviders
} from "@/data/categoriesData";
import { ServiceProvider, HiringType } from "@/types/services";

type BookingStep = "providers" | "schedule" | "confirm";

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

  const [step, setStep] = useState<BookingStep>("providers");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("123, 4th Cross, Koramangala, Bangalore - 560034");
  const [notes, setNotes] = useState("");

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
  const calculateTotal = (provider: ServiceProvider) => {
    if (hiringType === "monthly" && provider.monthlyRate) {
      return provider.monthlyRate;
    }
    if (hiringType === "daily" && provider.dailyRate) {
      return provider.dailyRate;
    }
    // Task-based: sum of individual prices
    return problemIds.reduce((sum, pid) => sum + (provider.taskPrices[pid] || 0), 0);
  };

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
    };
  });

  const handleProviderSelect = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setStep("schedule");
  };

  const handleBack = () => {
    if (step === "providers") {
      navigate(-1);
    } else if (step === "schedule") {
      setStep("providers");
    } else {
      setStep("schedule");
    }
  };

  const handleSubmit = () => {
    toast.success("Booking confirmed!", {
      description: `₹${advanceAmount} advance paid. Service scheduled for ${new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${selectedTime}`,
    });
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
              {step === "providers" && "Select a provider"}
              {step === "schedule" && "Choose date & time"}
              {step === "confirm" && "Review & confirm"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-4 py-3">
        {["providers", "schedule", "confirm"].map((s, i) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= ["providers", "schedule", "confirm"].indexOf(step) ? "bg-primary" : "bg-muted"
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

        {/* Step 1: Provider Selection */}
        {step === "providers" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Available Providers</h2>
              <span className="text-xs text-muted-foreground">
                Sorted by distance
              </span>
            </div>
            
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderSelect(provider)}
                className="w-full rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg font-semibold text-primary">
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{provider.name}</h3>
                      {provider.verified && (
                        <Shield className="h-4 w-4 text-success shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      <span className="text-sm">{provider.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({provider.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{provider.experience} exp</span>
                      <span>•</span>
                      <span>{provider.completedJobs} jobs</span>
                      <span>•</span>
                      <span>{provider.distance?.toFixed(1)} km</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-primary">₹{calculateTotal(provider)}</p>
                    {hiringType === "monthly" && (
                      <p className="text-xs text-muted-foreground">/month</p>
                    )}
                    {hiringType === "daily" && (
                      <p className="text-xs text-muted-foreground">/day</p>
                    )}
                  </div>
                </div>

                {/* Price breakdown for task-based */}
                {hiringType === "task" && problems.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Price breakdown:</p>
                    <div className="flex flex-wrap gap-2">
                      {problems.map((prob) => (
                        <Badge key={prob.id} variant="outline" className="text-xs">
                          {prob.name}: ₹{provider.taskPrices[prob.id] || prob.basePrice}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            ))}

            {providers.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No providers available in your area</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === "schedule" && selectedProvider && (
          <div className="space-y-6">
            {/* Selected Provider */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {selectedProvider.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{selectedProvider.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ★ {selectedProvider.rating} • {selectedProvider.experience}
                  </p>
                </div>
              </div>
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
                placeholder="Any specific instructions..."
                rows={2}
              />
            </div>

            {/* Continue Button */}
            <Button 
              className="w-full" 
              size="lg"
              disabled={!selectedDate || !selectedTime || !address.trim()}
              onClick={() => setStep("confirm")}
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === "confirm" && selectedProvider && (
          <div className="space-y-4">
            {/* Booking Summary */}
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <h3 className="font-semibold">Booking Summary</h3>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Professional</span>
                  <span className="font-medium">{selectedProvider.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Services</span>
                  <span className="font-medium text-right max-w-[60%]">
                    {problems.map(p => p.name).join(", ")}
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
                {hiringType === "monthly" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trial Period</span>
                    <span className="font-medium text-success">First 7 days</span>
                  </div>
                )}
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
                      Cancel anytime in first 7 days. Only pay for days worked at daily rate (₹{selectedProvider.dailyRate || Math.round(totalPrice / 30)}/day).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button className="w-full" size="lg" onClick={handleSubmit}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Pay ₹{advanceAmount} & Confirm
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BookServiceFlow;

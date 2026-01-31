import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mockBookings, getBookingById } from "@/data/bookingsData";
import { serviceProviders, serviceProblems, serviceCategories } from "@/data/categoriesData";

const statusConfig = {
  pending: { label: "Pending", color: "bg-gold/10 text-gold-foreground" },
  accepted: { label: "Accepted", color: "bg-primary/10 text-primary" },
  in_progress: { label: "In Progress", color: "bg-primary/10 text-primary" },
  provider_completed: { label: "Awaiting Confirmation", color: "bg-secondary/10 text-secondary" },
  completed: { label: "Completed", color: "bg-success/10 text-success" },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive" },
};

const BookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const booking = getBookingById(bookingId || "");
  
  if (!booking) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">Booking not found</p>
          <Link to="/bookings">
            <Button variant="link" className="mt-2">Back to Bookings</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const provider = serviceProviders.find(p => p.id === booking.providerId);
  const problems = serviceProblems.filter(p => booking.selectedProblemIds.includes(p.id));
  const category = serviceCategories.find(c => c.id === booking.categoryId);
  const status = statusConfig[booking.status];

  const handleConfirmCompletion = () => {
    setShowRatingDialog(true);
  };

  const handleSubmitRating = () => {
    toast.success("Thank you for your rating!", {
      description: `You rated ${provider?.name} ${rating} stars.`,
    });
    setShowRatingDialog(false);
    navigate("/bookings");
  };

  const handleCancelBooking = () => {
    toast.success("Booking cancelled", {
      description: "Your booking has been cancelled. Refund will be processed within 3-5 days.",
    });
    setShowCancelDialog(false);
    navigate("/bookings");
  };

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/bookings">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold">Booking Details</h1>
            <p className="text-xs text-muted-foreground">#{booking.id}</p>
          </div>
          <Badge className={cn("text-xs", status.color)}>
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="px-4 py-6 pb-32 space-y-4">
        {/* Provider Card */}
        <div className="rounded-xl bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Service Provider</h3>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">
                {provider?.name.charAt(0) || "?"}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{provider?.name || "Unknown"}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                <span className="text-sm">{provider?.rating || 0}</span>
                <span className="text-xs text-muted-foreground">
                  ({provider?.reviewCount || 0} reviews)
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Services Card */}
        <div className="rounded-xl bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Services</h3>
          <div className="space-y-2">
            {problems.map((prob) => (
              <div key={prob.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{prob.name}</p>
                  <p className="text-xs text-muted-foreground">{prob.description}</p>
                </div>
                <span className="font-medium">₹{booking.itemPrices[prob.id]}</span>
              </div>
            ))}
          </div>
          {booking.hiringType && (
            <div className="mt-3 pt-3 border-t border-border">
              <Badge variant="secondary">
                {booking.hiringType === "monthly" ? "Monthly Hire" : "Daily Hire"}
              </Badge>
              {booking.isTrialPeriod && (
                <Badge variant="outline" className="ml-2 text-gold-foreground">
                  Trial Period
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Schedule Card */}
        <div className="rounded-xl bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Schedule</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{booking.scheduledTime}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>{booking.address}</span>
            </div>
          </div>
        </div>

        {/* Payment Card */}
        <div className="rounded-xl bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Payment</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-medium">₹{booking.totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Advance Paid</span>
              <span className="text-success font-medium">₹{booking.advanceAmount}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="font-medium">Remaining</span>
              <span className="font-bold text-primary">₹{booking.remainingAmount}</span>
            </div>
          </div>
        </div>

        {/* Rating (if completed) */}
        {booking.status === "completed" && booking.userRating && (
          <div className="rounded-xl bg-success/5 p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Rating</h3>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-5 w-5",
                    star <= booking.userRating! ? "fill-gold text-gold" : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            {booking.userReview && (
              <p className="text-sm text-muted-foreground">{booking.userReview}</p>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 safe-area-bottom space-y-2">
        {booking.status === "provider_completed" && (
          <Button className="w-full" size="lg" onClick={handleConfirmCompletion}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm & Pay ₹{booking.remainingAmount}
          </Button>
        )}
        
        {(booking.status === "pending" || booking.status === "accepted") && (
          <Button 
            variant="destructive" 
            className="w-full" 
            size="lg"
            onClick={() => setShowCancelDialog(true)}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel Booking
          </Button>
        )}

        {booking.status === "in_progress" && (
          <div className="text-center text-sm text-muted-foreground">
            Service is in progress. Wait for provider to mark complete.
          </div>
        )}
      </div>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              How was your service with {provider?.name}?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      "h-10 w-10 transition-colors",
                      star <= rating ? "fill-gold text-gold" : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
            
            <Textarea
              placeholder="Share your experience (optional)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
              Skip
            </Button>
            <Button onClick={handleSubmitRating} disabled={rating === 0}>
              Submit & Pay ₹{booking.remainingAmount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? Your advance of ₹{booking.advanceAmount} will be refunded within 3-5 business days.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default BookingDetails;

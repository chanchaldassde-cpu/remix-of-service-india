import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import { Booking } from "@/types/services";
import { serviceProviders, serviceProblems } from "@/data/categoriesData";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface BookingCardProps {
  booking: Booking;
}

const statusConfig = {
  pending: { label: "Pending", className: "bg-gold/10 text-gold-foreground" },
  accepted: { label: "Accepted", className: "bg-accent text-accent-foreground" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary" },
  provider_completed: { label: "Awaiting Confirmation", className: "bg-secondary/10 text-secondary" },
  completed: { label: "Completed", className: "bg-success/10 text-success" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
};

export function BookingCard({ booking }: BookingCardProps) {
  const provider = serviceProviders.find((p) => p.id === booking.providerId);
  const problems = serviceProblems.filter((p) => booking.selectedProblemIds.includes(p.id));
  const status = statusConfig[booking.status];

  return (
    <Link
      to={`/booking/${booking.id}`}
      className="block rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">
            {problems.map(p => p.name).join(", ")}
          </h3>
          <p className="text-sm text-muted-foreground">
            by {provider?.name || "Provider"}
          </p>
        </div>
        <Badge className={cn("shrink-0 ml-2", status.className)}>
          {status.label}
        </Badge>
      </div>

      {/* Hiring Type Badge */}
      {booking.hiringType && (
        <div className="mt-2 flex gap-2">
          <Badge variant="outline" className="text-xs">
            {booking.hiringType === "monthly" ? "Monthly" : booking.hiringType === "daily" ? "Daily" : "One-time"}
          </Badge>
          {booking.isTrialPeriod && (
            <Badge variant="outline" className="text-xs text-gold-foreground border-gold/30">
              Trial Period
            </Badge>
          )}
        </div>
      )}

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <Clock className="ml-2 h-4 w-4" />
          <span>{booking.scheduledTime}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{booking.address}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-medium">
          ₹{booking.totalPrice} 
          <span className="text-muted-foreground text-xs ml-1">
            (₹{booking.advanceAmount} paid)
          </span>
        </span>
        <div className="flex items-center text-sm text-primary font-medium">
          View Details
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

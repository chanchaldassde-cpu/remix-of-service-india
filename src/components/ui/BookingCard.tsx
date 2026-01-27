import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import { Booking, BookingStatus } from "@/types";
import { serviceProblems, serviceProviders } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface BookingCardProps {
  booking: Booking;
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-gold/10 text-gold",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-accent/10 text-accent",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-primary/10 text-primary",
  },
  provider_completed: {
    label: "Awaiting Confirmation",
    className: "bg-secondary/10 text-secondary",
  },
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive",
  },
};

export function BookingCard({ booking }: BookingCardProps) {
  const problem = serviceProblems.find((p) => p.id === booking.problemId);
  const provider = serviceProviders.find((p) => p.id === booking.providerId);
  const status = statusConfig[booking.status];

  return (
    <Link
      to={`/bookings/${booking.id}`}
      className="block rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{problem?.name || "Service"}</h3>
          <p className="text-sm text-muted-foreground">
            by {provider?.name || "Provider"}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            status.className
          )}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{booking.scheduledDate}</span>
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
          ₹{booking.totalPrice} (₹{booking.advanceAmount} paid)
        </span>
        <div className="flex items-center text-sm text-primary">
          View Details
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

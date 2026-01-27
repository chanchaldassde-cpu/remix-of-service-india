import { Star, BadgeCheck, MapPin, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { ServiceProvider } from "@/types";
import { cn } from "@/lib/utils";

// Provider status during wave request
export type WaveStatus = "idle" | "waiting" | "accepted" | "rejected";

interface WaveRequestCardProps {
  provider: ServiceProvider & { distance?: number };
  status: WaveStatus;
}

/**
 * WaveRequestCard - Displays provider info with real-time wave request status
 * Status indicators: idle (not sent), waiting (pending response), accepted, rejected
 */
export function WaveRequestCard({ provider, status }: WaveRequestCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl bg-card p-4 shadow-sm transition-all",
        status === "accepted" && "ring-2 ring-success bg-success/5",
        status === "rejected" && "opacity-50"
      )}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/10">
          <span className="text-lg font-semibold text-secondary">
            {provider.name.charAt(0)}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{provider.name}</h3>
            {provider.verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
            )}
          </div>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              <span className="font-medium">{provider.rating}</span>
            </div>
            <span className="text-muted-foreground">
              ({provider.reviewCount} reviews)
            </span>
          </div>

          {/* Location & Distance */}
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{provider.location}</span>
            {provider.distance !== undefined && (
              <>
                <span>•</span>
                <span className="text-primary font-medium">
                  {provider.distance.toFixed(1)} km away
                </span>
              </>
            )}
          </div>

          {/* Fixed Price */}
          <p className="mt-2 text-sm font-medium text-secondary">
            ₹{provider.fixedPrice}
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center">
          {status === "idle" && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          {status === "waiting" && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
          )}
          {status === "accepted" && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
          )}
          {status === "rejected" && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
          )}
        </div>
      </div>

      {/* Status Text */}
      <div className="mt-3 text-center">
        {status === "idle" && (
          <span className="text-xs text-muted-foreground">Ready to receive request</span>
        )}
        {status === "waiting" && (
          <span className="text-xs text-primary animate-pulse">Waiting for response...</span>
        )}
        {status === "accepted" && (
          <span className="text-xs font-medium text-success">Accepted your request!</span>
        )}
        {status === "rejected" && (
          <span className="text-xs text-muted-foreground">Declined</span>
        )}
      </div>
    </div>
  );
}

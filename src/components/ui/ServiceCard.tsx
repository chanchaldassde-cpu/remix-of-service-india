import { Star, BadgeCheck, MapPin } from "lucide-react";
import { ServiceProvider } from "@/types";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  provider: ServiceProvider;
  onSelect?: () => void;
  selected?: boolean;
  distance?: number; // Distance in km
}

export function ServiceCard({ provider, onSelect, selected, distance }: ServiceCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl bg-card p-4 text-left shadow-sm transition-all hover:shadow-md",
        selected && "ring-2 ring-primary"
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

          {/* Location & Experience */}
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{provider.location}</span>
            {distance !== undefined && (
              <>
                <span>•</span>
                <span className="text-primary font-medium">{distance.toFixed(1)} km away</span>
              </>
            )}
            <span>•</span>
            <span>{provider.experience} exp</span>
          </div>

          {/* Fixed Price */}
          <p className="mt-2 text-sm font-medium text-secondary">
            ₹{provider.fixedPrice}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {provider.specializations.slice(0, 3).map((spec) => (
          <span
            key={spec}
            className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {spec}
          </span>
        ))}
        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
          {provider.completedJobs}+ jobs done
        </span>
      </div>
    </button>
  );
}

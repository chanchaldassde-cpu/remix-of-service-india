import { Star, BadgeCheck, MapPin, Calendar, CalendarDays } from "lucide-react";
import { JobProvider } from "@/types/jobServices";
import { cn } from "@/lib/utils";
import { jobSubTasks } from "@/data/jobMockData";

interface JobProviderCardProps {
  provider: JobProvider;
  onSelect?: () => void;
  selected?: boolean;
  distance?: number;
}

export function JobProviderCard({ 
  provider, 
  onSelect, 
  selected, 
  distance 
}: JobProviderCardProps) {
  // Get sub-task names
  const subTaskNames = provider.subTasks
    .map((id) => jobSubTasks.find((t) => t.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3);

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
                <span className="text-primary font-medium">{distance.toFixed(1)} km</span>
              </>
            )}
            <span>•</span>
            <span>{provider.experience} exp</span>
          </div>

          {/* Pricing */}
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium text-secondary">₹{provider.dailyRate}/day</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium text-primary">₹{provider.monthlyRate}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tasks & Stats */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {subTaskNames.map((name) => (
          <span
            key={name}
            className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {name}
          </span>
        ))}
        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
          {provider.completedJobs}+ jobs done
        </span>
      </div>
    </button>
  );
}

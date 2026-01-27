import { lazy, Suspense } from "react";
import { WaveStatus } from "./WaveRequestCard";
import { ServiceProvider } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import map content to isolate leaflet context
const MapContent = lazy(() => import("./MapContent"));

interface ProviderWithStatus extends ServiceProvider {
  distance?: number;
  waveStatus: WaveStatus;
}

interface ProviderMapProps {
  userLocation: { latitude: number; longitude: number };
  providers: ProviderWithStatus[];
  isWaveActive: boolean;
}

/**
 * ProviderMap - Shows user and provider locations on an interactive map
 * Uses lazy loading to isolate react-leaflet context from Radix UI
 */
export function ProviderMap({ userLocation, providers, isWaveActive }: ProviderMapProps) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-border">
      {/* Map Legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg p-2 shadow-md">
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />
            <span>Your Location</span>
          </div>
          {isWaveActive && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm animate-pulse" />
                <span>Waiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success border-2 border-white shadow-sm" />
                <span>Accepted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50 border-2 border-white shadow-sm" />
                <span>Declined</span>
              </div>
            </>
          )}
          {!isWaveActive && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground border-2 border-white shadow-sm" />
              <span>Providers</span>
            </div>
          )}
        </div>
      </div>

      {/* Map with Suspense boundary for lazy loading */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center bg-muted/50" style={{ height: "250px" }}>
            <div className="text-center space-y-2">
              <Skeleton className="h-4 w-24 mx-auto" />
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        }
      >
        <MapContent userLocation={userLocation} providers={providers} />
      </Suspense>
    </div>
  );
}

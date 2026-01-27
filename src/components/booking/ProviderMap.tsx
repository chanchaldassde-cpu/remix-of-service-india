import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { WaveStatus } from "./WaveRequestCard";
import { ServiceProvider } from "@/types";

// Fix for default marker icons in Leaflet + Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icons based on wave status
const createCustomIcon = (status: WaveStatus, isUser?: boolean) => {
  if (isUser) {
    // User location - blue marker
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, hsl(221, 83%, 53%), hsl(221, 83%, 40%));
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }

  // Provider markers based on status
  const colors = {
    idle: { bg: "hsl(220, 9%, 46%)", pulse: false },
    waiting: { bg: "hsl(221, 83%, 53%)", pulse: true },
    accepted: { bg: "hsl(142, 76%, 36%)", pulse: false },
    rejected: { bg: "hsl(0, 84%, 60%)", pulse: false },
  };

  const { bg, pulse } = colors[status];

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative;">
        ${pulse ? `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: ${bg};
            opacity: 0.3;
            border-radius: 50%;
            animation: pulse 1.5s ease-out infinite;
          "></div>
        ` : ""}
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          background: ${bg};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          ${status === "rejected" ? "opacity: 0.5;" : ""}
        ">
          ${status === "accepted" ? "✓" : status === "rejected" ? "✗" : ""}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Component to fit map bounds to all markers
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [map, positions]);

  return null;
}

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
 * Markers change color based on wave request status
 */
export function ProviderMap({ userLocation, providers, isWaveActive }: ProviderMapProps) {
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // All positions for bounds fitting
  const allPositions: [number, number][] = [
    [userLocation.latitude, userLocation.longitude],
    ...providers.map((p) => [p.latitude, p.longitude] as [number, number]),
  ];

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border">
        <div 
          className="bg-muted/50 flex items-center justify-center"
          style={{ height: "250px", width: "100%" }}
        >
          <div className="text-center text-muted-foreground">
            <div className="animate-pulse">Loading map...</div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Pulse Animation Styles */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>

      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={13}
        style={{ height: "250px", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit bounds to show all markers */}
        <FitBounds positions={allPositions} />

        {/* User location marker */}
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={createCustomIcon("idle", true)}
        >
          <Popup>
            <div className="text-center">
              <p className="font-medium">Your Location</p>
              <p className="text-xs text-muted-foreground">Service Address</p>
            </div>
          </Popup>
        </Marker>

        {/* Range circle around user */}
        <Circle
          center={[userLocation.latitude, userLocation.longitude]}
          radius={3000} // 3km radius
          pathOptions={{
            color: "hsl(221, 83%, 53%)",
            fillColor: "hsl(221, 83%, 53%)",
            fillOpacity: 0.1,
            weight: 1,
          }}
        />

        {/* Provider markers */}
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            position={[provider.latitude, provider.longitude]}
            icon={createCustomIcon(provider.waveStatus)}
          >
            <Popup>
              <div className="min-w-[150px]">
                <p className="font-medium">{provider.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <span>⭐ {provider.rating}</span>
                  <span>•</span>
                  <span>{provider.distance?.toFixed(1)} km</span>
                </div>
                <p className="text-sm font-medium text-secondary mt-1">
                  ₹{provider.fixedPrice}
                </p>
                {provider.waveStatus === "accepted" && (
                  <p className="text-xs text-success font-medium mt-1">
                    ✓ Accepted your request!
                  </p>
                )}
                {provider.waveStatus === "rejected" && (
                  <p className="text-xs text-destructive mt-1">
                    Declined
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

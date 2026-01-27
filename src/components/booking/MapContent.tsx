import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { WaveStatus } from "./WaveRequestCard";
import { ServiceProvider } from "@/types";

// Fix for default marker icons in Leaflet + Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icons based on wave status
const createCustomIcon = (status: WaveStatus, isUser?: boolean) => {
  if (isUser) {
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

interface MapContentProps {
  userLocation: { latitude: number; longitude: number };
  providers: ProviderWithStatus[];
}

export function MapContent({ userLocation, providers }: MapContentProps) {
  const allPositions: [number, number][] = [
    [userLocation.latitude, userLocation.longitude],
    ...providers.map((p) => [p.latitude, p.longitude] as [number, number]),
  ];

  return (
    <>
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
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FitBounds positions={allPositions} />

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

        <Circle
          center={[userLocation.latitude, userLocation.longitude]}
          radius={3000}
          pathOptions={{
            color: "hsl(221, 83%, 53%)",
            fillColor: "hsl(221, 83%, 53%)",
            fillOpacity: 0.1,
            weight: 1,
          }}
        />

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
                  <p className="text-xs text-destructive mt-1">Declined</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default MapContent;

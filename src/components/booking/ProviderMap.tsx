import { useEffect, useRef } from "react";
import { WaveStatus } from "./WaveRequestCard";
import { ServiceProvider } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

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
 * ProviderMap - Renders map in an iframe to completely isolate
 * react-leaflet from Radix UI's context system
 */
export function ProviderMap({ userLocation, providers, isWaveActive }: ProviderMapProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    // Build the HTML content for the map
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
      100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
    .pulse-ring {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 40px; height: 40px;
      border-radius: 50%;
      animation: pulse 1.5s ease-out infinite;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const userLocation = ${JSON.stringify(userLocation)};
    const providers = ${JSON.stringify(providers)};
    
    const map = L.map('map', { zoomControl: false, attributionControl: false })
      .setView([userLocation.latitude, userLocation.longitude], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    // User marker
    const userIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="width:24px;height:24px;background:linear-gradient(135deg,hsl(221,83%,53%),hsl(221,83%,40%));border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    
    L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
      .bindPopup('<div style="text-align:center;"><p style="font-weight:500;">Your Location</p><p style="font-size:12px;color:#666;">Service Address</p></div>')
      .addTo(map);
    
    // Range circle
    L.circle([userLocation.latitude, userLocation.longitude], {
      radius: 3000,
      color: 'hsl(221, 83%, 53%)',
      fillColor: 'hsl(221, 83%, 53%)',
      fillOpacity: 0.1,
      weight: 1
    }).addTo(map);
    
    // Provider markers
    const colors = {
      idle: { bg: 'hsl(220, 9%, 46%)', pulse: false },
      waiting: { bg: 'hsl(221, 83%, 53%)', pulse: true },
      accepted: { bg: 'hsl(142, 76%, 36%)', pulse: false },
      rejected: { bg: 'hsl(0, 84%, 60%)', pulse: false }
    };
    
    const bounds = [[userLocation.latitude, userLocation.longitude]];
    
    providers.forEach(p => {
      const { bg, pulse } = colors[p.waveStatus] || colors.idle;
      const symbol = p.waveStatus === 'accepted' ? '✓' : p.waveStatus === 'rejected' ? '✗' : '';
      const opacity = p.waveStatus === 'rejected' ? 'opacity:0.5;' : '';
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: \`
          <div style="position:relative;">
            \${pulse ? '<div class="pulse-ring" style="background:\${bg};"></div>' : ''}
            <div style="position:relative;width:32px;height:32px;background:\${bg};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px;\${opacity}">\${symbol}</div>
          </div>
        \`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      let popupContent = '<div style="min-width:150px;">' +
        '<p style="font-weight:500;">' + p.name + '</p>' +
        '<div style="display:flex;align-items:center;gap:4px;font-size:12px;color:#666;margin-top:4px;">' +
        '<span>⭐ ' + p.rating + '</span><span>•</span><span>' + (p.distance?.toFixed(1) || '?') + ' km</span></div>' +
        '<p style="font-size:14px;font-weight:500;color:hsl(142,76%,36%);margin-top:4px;">₹' + p.fixedPrice + '</p>';
      
      if (p.waveStatus === 'accepted') {
        popupContent += '<p style="font-size:12px;color:hsl(142,76%,36%);font-weight:500;margin-top:4px;">✓ Accepted your request!</p>';
      } else if (p.waveStatus === 'rejected') {
        popupContent += '<p style="font-size:12px;color:hsl(0,84%,60%);margin-top:4px;">Declined</p>';
      }
      popupContent += '</div>';
      
      L.marker([p.latitude, p.longitude], { icon }).bindPopup(popupContent).addTo(map);
      bounds.push([p.latitude, p.longitude]);
    });
    
    // Fit bounds to show all markers
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  <\/script>
</body>
</html>
    `;

    doc.open();
    doc.write(html);
    doc.close();
  }, [userLocation, providers]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border">
      {/* Map Legend */}
      <div className="absolute top-3 right-3 z-10 bg-card/95 backdrop-blur-sm rounded-lg p-2 shadow-md">
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

      {/* Map iframe - completely isolated from React context */}
      <iframe
        ref={iframeRef}
        title="Provider Map"
        style={{ width: "100%", height: "250px", border: "none" }}
      />
    </div>
  );
}

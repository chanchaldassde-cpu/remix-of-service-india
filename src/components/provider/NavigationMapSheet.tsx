import { useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Navigation, Phone, MessageSquare } from "lucide-react";

interface NavigationMapSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    customerName: string;
    address: string;
    service: string;
    latitude?: number;
    longitude?: number;
  } | null;
}

export function NavigationMapSheet({ open, onOpenChange, booking }: NavigationMapSheetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Default coordinates for demo (Koramangala, Bangalore)
  const customerLat = booking?.latitude || 12.9352;
  const customerLng = booking?.longitude || 77.6245;
  
  // Provider location (HSR Layout for demo)
  const providerLat = 12.9116;
  const providerLng = 77.6389;

  useEffect(() => {
    if (!open || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    if (!doc) return;

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
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const customerLat = ${customerLat};
    const customerLng = ${customerLng};
    const providerLat = ${providerLat};
    const providerLng = ${providerLng};
    
    const map = L.map('map', { zoomControl: true, attributionControl: false })
      .setView([customerLat, customerLng], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    // Customer marker (destination)
    const customerIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="width:36px;height:36px;background:hsl(0,84%,60%);border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });
    
    L.marker([customerLat, customerLng], { icon: customerIcon })
      .bindPopup('<div style="text-align:center;"><p style="font-weight:600;">${booking?.customerName || "Customer"}</p><p style="font-size:12px;color:#666;">${booking?.address || "Address"}</p></div>')
      .addTo(map)
      .openPopup();
    
    // Provider marker (you)
    const providerIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="width:32px;height:32px;background:hsl(221,83%,53%);border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;">You</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    
    L.marker([providerLat, providerLng], { icon: providerIcon })
      .bindPopup('<div style="text-align:center;"><p style="font-weight:500;">Your Location</p></div>')
      .addTo(map);
    
    // Draw route line
    const routeLine = L.polyline([
      [providerLat, providerLng],
      [customerLat, customerLng]
    ], {
      color: 'hsl(221, 83%, 53%)',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(map);
    
    // Fit bounds to show both markers
    map.fitBounds([
      [providerLat, providerLng],
      [customerLat, customerLng]
    ], { padding: [50, 50] });
  <\/script>
</body>
</html>
    `;

    doc.open();
    doc.write(html);
    doc.close();
  }, [open, customerLat, customerLng, booking]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${customerLat},${customerLng}`;
    window.open(url, "_blank");
  };

  if (!booking) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle>Navigate to {booking.customerName}</SheetTitle>
          <p className="text-sm text-muted-foreground">{booking.address}</p>
        </SheetHeader>

        {/* Map */}
        <div className="h-[calc(100%-180px)]">
          <iframe
            ref={iframeRef}
            title="Navigation Map"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border space-y-3">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
          <Button className="w-full" onClick={openInGoogleMaps}>
            <Navigation className="h-4 w-4 mr-2" />
            Open in Google Maps
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

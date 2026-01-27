import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocationSearch } from "./LocationSearch";

export function Header() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Koramangala, Bangalore");
  const [, setUserCoords] = useState({ lat: 12.9352, lng: 77.6245 });

  const handleLocationChange = (newLocation: string, lat: number, lng: number) => {
    setLocation(newLocation);
    setUserCoords({ lat, lng });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Location Selector */}
        <LocationSearch
          currentLocation={location}
          onLocationChange={handleLocationChange}
        />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </Button>
        </div>
      </div>
    </header>
  );
}

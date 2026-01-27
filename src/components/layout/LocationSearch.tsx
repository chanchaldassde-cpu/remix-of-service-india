import { useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const popularLocations = [
  { name: "Koramangala", area: "Bangalore", lat: 12.9352, lng: 77.6245 },
  { name: "HSR Layout", area: "Bangalore", lat: 12.9116, lng: 77.6389 },
  { name: "Indiranagar", area: "Bangalore", lat: 12.9784, lng: 77.6408 },
  { name: "Whitefield", area: "Bangalore", lat: 12.9698, lng: 77.7500 },
  { name: "Jayanagar", area: "Bangalore", lat: 12.9308, lng: 77.5838 },
  { name: "BTM Layout", area: "Bangalore", lat: 12.9166, lng: 77.6101 },
];

interface LocationSearchProps {
  currentLocation: string;
  onLocationChange: (location: string, lat: number, lng: number) => void;
}

export function LocationSearch({ currentLocation, onLocationChange }: LocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = popularLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc: typeof popularLocations[0]) => {
    onLocationChange(`${loc.name}, ${loc.area}`, loc.lat, loc.lng);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 text-left">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Your Location</p>
            <p className="text-sm font-medium">{currentLocation}</p>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle>Select your location</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for area, street name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Use Current Location */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    onLocationChange(
                      "Current Location",
                      position.coords.latitude,
                      position.coords.longitude
                    );
                    setOpen(false);
                  },
                  () => {
                    // Fallback to default location
                    onLocationChange("Koramangala, Bangalore", 12.9352, 77.6245);
                    setOpen(false);
                  }
                );
              }
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Use current location</p>
              <p className="text-xs text-muted-foreground">Enable GPS for accurate location</p>
            </div>
          </Button>

          {/* Popular Locations */}
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Popular Locations</p>
            <div className="space-y-1">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.name}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent"
                  onClick={() => handleSelectLocation(loc)}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{loc.name}</p>
                    <p className="text-xs text-muted-foreground">{loc.area}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

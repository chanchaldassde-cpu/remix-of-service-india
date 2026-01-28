import { useState } from "react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CalendarDays, 
  Plus,
  Trash2,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

type WeekSchedule = {
  [key: string]: DaySchedule;
};

const defaultSchedule: WeekSchedule = {
  monday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
  tuesday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
  wednesday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
  thursday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
  friday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
  saturday: { enabled: true, slots: [{ start: "10:00", end: "14:00" }] },
  sunday: { enabled: false, slots: [] },
};

const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const dayLabels: { [key: string]: string } = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const ProviderAvailability = () => {
  const [schedule, setSchedule] = useState<WeekSchedule>(defaultSchedule);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const updateSlot = (day: string, index: number, field: "start" | "end", value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const addSlot = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: "09:00", end: "18:00" }],
      },
    }));
  };

  const removeSlot = (day: string, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }));
  };

  const handleBlockDate = (date: Date | undefined) => {
    if (!date) return;
    
    const isBlocked = blockedDates.some(d => d.toDateString() === date.toDateString());
    if (isBlocked) {
      setBlockedDates(prev => prev.filter(d => d.toDateString() !== date.toDateString()));
    } else {
      setBlockedDates(prev => [...prev, date]);
    }
  };

  const handleSave = () => {
    toast.success("Availability updated successfully!");
  };

  return (
    <ProviderLayout>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Set Availability</h1>
            <p className="text-sm text-muted-foreground">
              Manage your working hours and days off
            </p>
          </div>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>

        {/* Online Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${isOnline ? "bg-success" : "bg-muted-foreground"}`} />
                <div>
                  <p className="font-medium">Online Status</p>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? "You're visible to customers" : "You're hidden from search"}
                  </p>
                </div>
              </div>
              <Switch
                checked={isOnline}
                onCheckedChange={setIsOnline}
              />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dayNames.map(day => (
              <div key={day} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={schedule[day].enabled}
                      onCheckedChange={() => toggleDay(day)}
                    />
                    <Label className="font-medium">{dayLabels[day]}</Label>
                  </div>
                  {schedule[day].enabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addSlot(day)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {schedule[day].enabled && (
                  <div className="space-y-2 ml-12">
                    {schedule[day].slots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateSlot(day, index, "start", e.target.value)}
                          className="px-3 py-1.5 border border-input rounded-md bg-background text-sm"
                        />
                        <span className="text-muted-foreground">to</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateSlot(day, index, "end", e.target.value)}
                          className="px-3 py-1.5 border border-input rounded-md bg-background text-sm"
                        />
                        {schedule[day].slots.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeSlot(day, index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {!schedule[day].enabled && (
                  <p className="text-sm text-muted-foreground ml-12">Day off</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Block Dates */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5" />
              Block Specific Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Click on dates to mark them as unavailable
            </p>
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={handleBlockDate}
              modifiers={{
                blocked: blockedDates,
              }}
              modifiersStyles={{
                blocked: {
                  backgroundColor: "hsl(var(--destructive))",
                  color: "hsl(var(--destructive-foreground))",
                  borderRadius: "50%",
                },
              }}
              className="rounded-md border"
            />
            
            {blockedDates.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Blocked dates:</p>
                <div className="flex flex-wrap gap-2">
                  {blockedDates.map((date, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleBlockDate(date)}
                    >
                      {date.toLocaleDateString()}
                      <Trash2 className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProviderLayout>
  );
};

export default ProviderAvailability;

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookingCard } from "@/components/ui/BookingCard";
import { mockBookings } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

type TabType = "upcoming" | "completed";

const Bookings = () => {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  const upcomingBookings = mockBookings.filter(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  );
  const completedBookings = mockBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const displayBookings = activeTab === "upcoming" ? upcomingBookings : completedBookings;

  return (
    <AppLayout>
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold">My Bookings</h1>

        {/* Tabs */}
        <div className="mt-4 flex rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={cn(
              "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
              activeTab === "upcoming"
                ? "bg-card shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={cn(
              "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
              activeTab === "completed"
                ? "bg-card shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Completed
          </button>
        </div>

        {/* Bookings List */}
        <div className="mt-6 space-y-3">
          {displayBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>

        {/* Empty State */}
        {displayBookings.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-medium">No bookings yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeTab === "upcoming"
                ? "Your upcoming bookings will appear here"
                : "Your completed bookings will appear here"}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Bookings;

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookingCard } from "@/components/booking/BookingCardNew";
import { mockBookings } from "@/data/bookingsData";
import { cn } from "@/lib/utils";
import { Calendar, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type TabType = "upcoming" | "completed";

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  const upcomingBookings = mockBookings.filter(
    (b) => !["completed", "cancelled"].includes(b.status)
  );
  const completedBookings = mockBookings.filter(
    (b) => ["completed", "cancelled"].includes(b.status)
  );

  const displayBookings = activeTab === "upcoming" ? upcomingBookings : completedBookings;

  return (
    <AppLayout>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">My Bookings</h1>
          <Link to="/job-hirings">
            <Button variant="outline" size="sm">
              <Briefcase className="h-4 w-4 mr-1" />
              Staff Hirings
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={cn(
              "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
              activeTab === "upcoming"
                ? "bg-card shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Upcoming ({upcomingBookings.length})
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
            Completed ({completedBookings.length})
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
            <Link to="/" className="mt-4">
              <Button>Book a Service</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BookingsPage;

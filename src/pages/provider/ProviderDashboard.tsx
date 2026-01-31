import { useState } from "react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  IndianRupee, 
  Star, 
  TrendingUp, 
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import { NavigationMapSheet } from "@/components/provider/NavigationMapSheet";
import { toast } from "sonner";

// Mock booking requests for provider
const pendingRequests = [
  {
    id: "req-1",
    customerName: "Amit Verma",
    customerPhone: "+91 98765 43210",
    service: "Fan not working, Switch issue",
    time: "Today, 3:00 PM",
    address: "BTM Layout, 2nd Stage",
    price: 548,
    status: "pending",
  },
  {
    id: "req-2",
    customerName: "Sneha Gupta",
    customerPhone: "+91 87654 32109",
    service: "Wiring problem",
    time: "Tomorrow, 10:00 AM",
    address: "HSR Layout, Sector 3",
    price: 499,
    status: "pending",
  },
];

const todayBookings = [
  {
    id: "1",
    customerName: "Rahul Sharma",
    customerPhone: "+91 99887 76655",
    service: "Fan not working",
    time: "10:00 AM",
    address: "Koramangala 4th Block",
    status: "in_progress",
    price: 349,
  },
  {
    id: "2",
    customerName: "Priya Patel",
    customerPhone: "+91 88776 65544",
    service: "Switch/Socket issue",
    time: "2:00 PM",
    address: "HSR Layout Sector 2",
    status: "upcoming",
    price: 299,
  },
];

const stats = {
  todayEarnings: 1548,
  weeklyEarnings: 8750,
  completedJobs: 12,
  rating: 4.8,
  totalReviews: 234,
  pendingRequests: pendingRequests.length,
};

const ProviderDashboard = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<typeof todayBookings[0] | null>(null);
  const [requests, setRequests] = useState(pendingRequests);

  const handleNavigate = (booking: typeof todayBookings[0]) => {
    setSelectedBooking(booking);
    setNavigationOpen(true);
  };

  const handleAcceptRequest = (reqId: string) => {
    setRequests(prev => prev.filter(r => r.id !== reqId));
    toast.success("Booking accepted!", {
      description: "Customer has been notified.",
    });
  };

  const handleRejectRequest = (reqId: string) => {
    setRequests(prev => prev.filter(r => r.id !== reqId));
    toast.info("Booking declined");
  };

  const handleMarkComplete = (bookingId: string) => {
    toast.success("Job marked as complete!", {
      description: "Waiting for customer confirmation.",
    });
  };

  const handleStartJob = (bookingId: string) => {
    toast.success("Job started!", {
      description: "Customer has been notified you're on the way.",
    });
  };

  return (
    <ProviderLayout>
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Welcome Section */}
        <div>
          <h1 className="text-xl font-bold">Good Morning, Rajesh! 👋</h1>
          <p className="text-sm text-muted-foreground">
            You have {todayBookings.length} bookings today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
              <p className="mt-1 text-2xl font-bold">₹{stats.todayEarnings}</p>
            </CardContent>
          </Card>
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">This Week</span>
              </div>
              <p className="mt-1 text-2xl font-bold">₹{stats.weeklyEarnings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{stats.completedJobs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-gold text-gold" />
                <span className="text-sm text-muted-foreground">Rating</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{stats.rating}</p>
              <p className="text-xs text-muted-foreground">{stats.totalReviews} reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        {requests.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-gold-foreground" />
                New Requests
              </h2>
              <Badge variant="secondary">{requests.length}</Badge>
            </div>
            
            <div className="space-y-3">
              {requests.map((req) => (
                <Card key={req.id} className="border-gold/30 bg-gold/5">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{req.customerName}</h3>
                        <p className="text-sm text-muted-foreground">{req.service}</p>
                      </div>
                      <span className="font-bold text-primary">₹{req.price}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{req.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{req.address}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleRejectRequest(req.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleAcceptRequest(req.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Today's Schedule */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Today's Schedule</h2>
            <Link to="/provider/bookings">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {todayBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{booking.customerName}</h3>
                        <Badge 
                          variant={booking.status === "in_progress" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {booking.status === "in_progress" ? "In Progress" : "Upcoming"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {booking.service}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{booking.price}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 mt-1"
                        onClick={() => window.open(`tel:${booking.customerPhone}`)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    {booking.status === "in_progress" ? (
                      <Button 
                        className="flex-1" 
                        size="sm"
                        onClick={() => handleMarkComplete(booking.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Mark Complete
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleNavigate(booking)}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Navigate
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleStartJob(booking.id)}
                        >
                          Start Job
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/provider/availability">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto text-primary" />
                <p className="mt-2 font-medium">Set Availability</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/provider/services">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <IndianRupee className="h-8 w-8 mx-auto text-primary" />
                <p className="mt-2 font-medium">Manage Pricing</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Navigation Map Sheet */}
      <NavigationMapSheet
        open={navigationOpen}
        onOpenChange={setNavigationOpen}
        booking={selectedBooking}
      />
    </ProviderLayout>
  );
};

export default ProviderDashboard;

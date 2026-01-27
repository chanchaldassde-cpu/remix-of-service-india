import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for provider dashboard
const todayBookings = [
  {
    id: "1",
    customerName: "Rahul Sharma",
    service: "Fan not working",
    time: "10:00 AM",
    address: "Koramangala 4th Block",
    status: "upcoming",
    price: 349,
  },
  {
    id: "2",
    customerName: "Priya Patel",
    service: "Switch/Socket issue",
    time: "2:00 PM",
    address: "HSR Layout Sector 2",
    status: "in_progress",
    price: 299,
  },
];

const stats = {
  todayEarnings: 1548,
  weeklyEarnings: 8750,
  completedJobs: 12,
  rating: 4.8,
  pendingRequests: 3,
};

const ProviderDashboard = () => {
  return (
    <ProviderLayout>
      <div className="px-4 py-6 space-y-6">
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
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Alert */}
        {stats.pendingRequests > 0 && (
          <Link to="/provider/bookings?tab=requests">
            <Card className="border-gold/50 bg-gold/10">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                    <AlertCircle className="h-5 w-5 text-gold-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{stats.pendingRequests} New Requests</p>
                    <p className="text-sm text-muted-foreground">Tap to view and accept</p>
                  </div>
                </div>
                <Badge variant="secondary">{stats.pendingRequests}</Badge>
              </CardContent>
            </Card>
          </Link>
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
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    {booking.status === "in_progress" ? (
                      <Button className="flex-1" size="sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Mark Complete
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          Navigate
                        </Button>
                        <Button size="sm" className="flex-1">
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
    </ProviderLayout>
  );
};

export default ProviderDashboard;

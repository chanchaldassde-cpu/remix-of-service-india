import { useState } from "react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle,
  Navigation,
  User
} from "lucide-react";

// Mock booking data
const mockRequests = [
  {
    id: "req-1",
    customerName: "Amit Kumar",
    phone: "+91 98765 43210",
    service: "Wiring problem",
    category: "Electrical",
    date: "Tomorrow",
    time: "11:00 AM",
    address: "BTM Layout 2nd Stage, Bangalore",
    distance: 2.5,
    price: 349,
  },
  {
    id: "req-2",
    customerName: "Sneha Reddy",
    phone: "+91 87654 32109",
    service: "Light installation",
    category: "Electrical",
    date: "Jan 28",
    time: "3:00 PM",
    address: "Jayanagar 4th Block, Bangalore",
    distance: 4.2,
    price: 399,
  },
];

const mockUpcoming = [
  {
    id: "up-1",
    customerName: "Rahul Sharma",
    phone: "+91 98765 43210",
    service: "Fan not working",
    category: "Electrical",
    date: "Today",
    time: "10:00 AM",
    address: "Koramangala 4th Block",
    status: "confirmed",
    price: 349,
  },
  {
    id: "up-2",
    customerName: "Priya Patel",
    phone: "+91 87654 32109",
    service: "Switch/Socket issue",
    category: "Electrical",
    date: "Today",
    time: "2:00 PM",
    address: "HSR Layout Sector 2",
    status: "in_progress",
    price: 299,
  },
];

const mockCompleted = [
  {
    id: "comp-1",
    customerName: "Vikram Singh",
    service: "AC service",
    date: "Jan 25",
    price: 699,
    rating: 5,
    penalty: 0,
    earned: 440, // 63% of 699
  },
  {
    id: "comp-2",
    customerName: "Meera Nair",
    service: "Fan not working",
    date: "Jan 24",
    price: 349,
    rating: 4,
    penalty: 10, // 2x 10min late = ₹10
    earned: 210, // 63% of 349 - ₹10
  },
];

const ProviderBookings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <ProviderLayout>
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">My Bookings</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests" className="relative">
              Requests
              {mockRequests.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {mockRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* New Requests */}
          <TabsContent value="requests" className="mt-4 space-y-3">
            {mockRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No new requests</p>
                </CardContent>
              </Card>
            ) : (
              mockRequests.map((request) => (
                <Card key={request.id} className="border-gold/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{request.customerName}</h3>
                            <p className="text-sm text-muted-foreground">{request.service}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">₹{request.price}</p>
                        <p className="text-xs text-muted-foreground">{request.distance} km away</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{request.date}, {request.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{request.address}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-destructive border-destructive hover:bg-destructive/10">
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button size="sm" className="flex-1">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming" className="mt-4 space-y-3">
            {mockUpcoming.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No upcoming bookings</p>
                </CardContent>
              </Card>
            ) : (
              mockUpcoming.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{booking.customerName}</h3>
                          <Badge 
                            variant={booking.status === "in_progress" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {booking.status === "in_progress" ? "In Progress" : "Confirmed"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{booking.service}</p>
                      </div>
                      <p className="font-bold text-primary">₹{booking.price}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{booking.date}, {booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.address}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Navigation className="h-4 w-4 mr-1" />
                        Navigate
                      </Button>
                      {booking.status === "in_progress" ? (
                        <Button size="sm" className="flex-1">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1">
                          Start Job
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Completed Bookings */}
          <TabsContent value="completed" className="mt-4 space-y-3">
            {mockCompleted.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{booking.customerName}</h3>
                      <p className="text-sm text-muted-foreground">{booking.service}</p>
                      <p className="text-xs text-muted-foreground mt-1">{booking.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">+₹{booking.earned}</p>
                      {booking.penalty > 0 && (
                        <p className="text-xs text-destructive">-₹{booking.penalty} penalty</p>
                      )}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`text-xs ${i < booking.rating ? 'text-gold' : 'text-muted-foreground'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </ProviderLayout>
  );
};

export default ProviderBookings;

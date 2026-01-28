import { useState } from "react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Calendar, 
  IndianRupee, 
  Star,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";

interface Notification {
  id: string;
  type: "booking" | "payment" | "review" | "alert" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "New Booking Request",
    message: "Rahul Sharma has requested Fan Installation service",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    message: "₹349 received for completed job #1234",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "review",
    title: "New Review",
    message: "Priya Patel gave you a 5-star rating",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "alert",
    title: "Upcoming Booking",
    message: "You have a booking in 30 minutes at Koramangala",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Profile Incomplete",
    message: "Complete your profile to get more bookings",
    time: "1 day ago",
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "booking":
      return Calendar;
    case "payment":
      return IndianRupee;
    case "review":
      return Star;
    case "alert":
      return Clock;
    default:
      return AlertCircle;
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case "booking":
      return "text-primary bg-primary/10";
    case "payment":
      return "text-success bg-success/10";
    case "review":
      return "text-gold bg-gold/10";
    case "alert":
      return "text-destructive bg-destructive/10";
    default:
      return "text-muted-foreground bg-muted";
  }
};

const ProviderNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <ProviderLayout>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map(notification => {
            const Icon = getIcon(notification.type);
            const iconClass = getIconColor(notification.type);

            return (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-colors ${
                  !notification.read ? "bg-primary/5 border-primary/20" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">{notification.title}</p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderNotifications;

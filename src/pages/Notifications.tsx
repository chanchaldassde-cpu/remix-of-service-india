import { AppLayout } from "@/components/layout/AppLayout";
import { Bell, CheckCircle, Clock, AlertTriangle, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "booking" | "reminder" | "completion" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your electrical service booking with Rajesh Kumar is confirmed for Jan 28 at 10:00 AM",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "reminder",
    title: "Service Tomorrow",
    message: "Reminder: AC service scheduled for tomorrow at 2:00 PM",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "completion",
    title: "Service Completed",
    message: "Mohammad Iqbal has marked your AC service as complete. Please confirm and pay the remaining amount.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "alert",
    title: "Provider Running Late",
    message: "Your service provider is running 10 minutes late. ₹5 penalty has been applied.",
    time: "2 days ago",
    read: true,
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "booking":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "reminder":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "completion":
      return <Wrench className="h-5 w-5 text-primary" />;
    case "alert":
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function Notifications() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <AppLayout>
      <div className="space-y-4 px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm">
            Mark all read
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 rounded-xl border p-4 transition-colors ${
                !notification.read ? "border-primary/20 bg-primary/5" : "border-border bg-card"
              }`}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read && (
                    <Badge variant="default" className="h-5 px-1.5 text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>

        {mockNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

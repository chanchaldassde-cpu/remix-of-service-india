import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Bell, CheckCircle, Clock, AlertTriangle, Star, Truck, XCircle, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/data/bookingsData";
import { NotificationType } from "@/types/services";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const iconMap: Record<NotificationType, React.ReactNode> = {
  booking_accepted: <CheckCircle className="h-5 w-5 text-success" />,
  provider_on_way: <Truck className="h-5 w-5 text-primary" />,
  job_completed: <CheckCircle className="h-5 w-5 text-primary" />,
  rating_reminder: <Star className="h-5 w-5 text-gold" />,
  booking_cancelled: <XCircle className="h-5 w-5 text-destructive" />,
  provider_late: <AlertTriangle className="h-5 w-5 text-gold-foreground" />,
  payment_received: <CreditCard className="h-5 w-5 text-success" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

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
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              to={notification.bookingId ? `/booking/${notification.bookingId}` : "#"}
              onClick={() => handleMarkRead(notification.id)}
              className={cn(
                "flex gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/30",
                !notification.read 
                  ? "border-primary/20 bg-primary/5" 
                  : "border-border bg-card"
              )}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background">
                {iconMap[notification.type]}
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read && (
                    <Badge variant="default" className="h-5 px-1.5 text-xs shrink-0">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(notification.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
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

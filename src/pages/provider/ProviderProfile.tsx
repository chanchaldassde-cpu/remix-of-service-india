import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Star, 
  MapPin, 
  Briefcase,
  ChevronRight,
  Shield,
  Clock,
  IndianRupee,
  Settings,
  FileText,
  HelpCircle,
  LogOut,
  Edit,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock provider profile data
const providerProfile = {
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  email: "rajesh.k@email.com",
  avatar: null,
  verified: true,
  experience: "8 years",
  rating: 4.8,
  reviewCount: 234,
  completedJobs: 512,
  location: "Koramangala, Bangalore",
  specializations: ["Electrical", "Wiring", "Fan Repair"],
  joinedDate: "Jan 2022",
  responseRate: 95,
  onTimeRate: 92,
};

const menuItems = [
  { icon: Briefcase, label: "My Services & Pricing", to: "/provider/services", badge: "3 active" },
  { icon: Clock, label: "Availability Schedule", to: "/provider/availability" },
  { icon: MapPin, label: "Service Areas", to: "/provider/areas" },
  { icon: FileText, label: "Documents", to: "/provider/documents", badge: "Verified" },
  { icon: Settings, label: "Account Settings", to: "/provider/settings" },
  { icon: HelpCircle, label: "Help & Support", to: "/provider/help" },
];

const ProviderProfile = () => {
  return (
    <ProviderLayout>
      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              {providerProfile.name.charAt(0)}
            </div>
            {providerProfile.verified && (
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{providerProfile.name}</h1>
              {providerProfile.verified && (
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{providerProfile.phone}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="font-medium">{providerProfile.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({providerProfile.reviewCount} reviews)
              </span>
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-2">
          {providerProfile.specializations.map((spec) => (
            <Badge key={spec} variant="outline">
              {spec}
            </Badge>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Briefcase className="h-5 w-5 mx-auto text-primary" />
              <p className="text-2xl font-bold mt-1">{providerProfile.completedJobs}</p>
              <p className="text-xs text-muted-foreground">Jobs Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-5 w-5 mx-auto text-primary" />
              <p className="text-2xl font-bold mt-1">{providerProfile.experience}</p>
              <p className="text-xs text-muted-foreground">Experience</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-5 w-5 mx-auto text-success font-bold">%</div>
              <p className="text-2xl font-bold mt-1">{providerProfile.responseRate}%</p>
              <p className="text-xs text-muted-foreground">Response Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-5 w-5 mx-auto text-success" />
              <p className="text-2xl font-bold mt-1">{providerProfile.onTimeRate}%</p>
              <p className="text-xs text-muted-foreground">On-Time</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Alert */}
        {providerProfile.onTimeRate < 95 && (
          <Card className="border-gold/30 bg-gold/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gold-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Improve your on-time rate!</p>
                  <p className="text-sm text-muted-foreground">
                    Arriving late affects your earnings (₹5 per 10 mins). Keep your on-time rate above 95% to get more bookings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.label} to={item.to}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Switch to Customer Mode */}
        <Link to="/">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Switch to Customer Mode</p>
                  <p className="text-sm text-muted-foreground">Book services for yourself</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>GrowIndia Provider v1.0.0</p>
          <p className="mt-1">Member since {providerProfile.joinedDate}</p>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default ProviderProfile;

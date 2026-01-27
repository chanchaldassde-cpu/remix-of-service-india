import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  User, 
  MapPin, 
  CreditCard, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronRight,
  Star,
  Briefcase,
  LogIn
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const menuItems = [
  { icon: MapPin, label: "Saved Addresses", to: "/profile/addresses" },
  { icon: CreditCard, label: "Payment Methods", to: "/profile/payments" },
  { icon: HelpCircle, label: "Help & Support", to: "/profile/help" },
  { icon: Settings, label: "Settings", to: "/profile/settings" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Sign in to your account</h2>
          <p className="text-muted-foreground text-center mb-6">
            Access your bookings, saved addresses, and more
          </p>
          <Button onClick={() => navigate("/auth")} className="gap-2">
            <LogIn className="h-4 w-4" />
            Sign In / Sign Up
          </Button>
        </div>
      </AppLayout>
    );
  }

  const userInitial = user.email?.charAt(0).toUpperCase() || "U";
  const userEmail = user.email || "No email";

  return (
    <AppLayout>
      <div className="px-4 py-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {userInitial}
          </div>
          <div>
            <h1 className="text-lg font-bold">{userEmail}</h1>
            <p className="text-sm text-muted-foreground">Member</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-card p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Bookings</p>
          </div>
          <div className="rounded-lg bg-card p-3 text-center shadow-sm">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="text-2xl font-bold">4.8</span>
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div className="rounded-lg bg-card p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-secondary">₹8.5K</p>
            <p className="text-xs text-muted-foreground">Spent</p>
          </div>
        </div>

        {/* Become Provider CTA */}
        <Link to="/become-provider">
          <div className="mt-6 flex items-center gap-4 rounded-xl bg-gradient-to-r from-secondary to-secondary/80 p-4 text-secondary-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-foreground/20">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Become a Provider</h3>
              <p className="text-sm text-secondary-foreground/80">
                Earn money by offering your skills
              </p>
            </div>
            <ChevronRight className="h-5 w-5" />
          </div>
        </Link>

        {/* Menu Items */}
        <div className="mt-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 font-medium">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          className="mt-6 w-full justify-start gap-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>

        {/* App Info */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>GrowIndia v1.0.0</p>
          <p className="mt-1">Made with ❤️ in India</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;

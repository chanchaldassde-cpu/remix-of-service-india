import { Home, Calendar, Wallet, User, Briefcase } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/provider", icon: Home, label: "Home" },
  { to: "/provider/bookings", icon: Calendar, label: "Bookings" },
  { to: "/provider/jobs", icon: Briefcase, label: "Jobs" },
  { to: "/provider/earnings", icon: Wallet, label: "Earnings" },
  { to: "/provider/profile", icon: User, label: "Profile" },
];

export function ProviderNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-area-bottom md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = 
            item.to === "/provider" 
              ? location.pathname === "/provider"
              : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              <span className={cn("text-xs", isActive && "font-medium")}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

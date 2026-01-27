import { Bell, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ProviderHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card safe-area-top">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/provider" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">G</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">GrowIndia</span>
            <span className="text-xs text-muted-foreground">Provider</span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/provider/notifications")}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              3
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/provider/settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

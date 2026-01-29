import { useParams, Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { 
  jobRoles, 
  getSubTasksForRole 
} from "@/data/jobMockData";
import { JobRole } from "@/types/jobServices";
import * as LucideIcons from "lucide-react";

// Icon mapping for job roles
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield: LucideIcons.Shield,
  Car: LucideIcons.Car,
  UtensilsCrossed: LucideIcons.UtensilsCrossed,
  Home: LucideIcons.Home,
  Store: LucideIcons.Store,
};

const JobServicesCategory = () => {
  const navigate = useNavigate();

  return (
    <AppLayout showHeader={false}>
      {/* Custom Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/services">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold">Job-Based Services</h1>
            <p className="text-xs text-muted-foreground">
              Hire staff daily or monthly
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <h2 className="mb-4 text-lg font-semibold">
          What type of help do you need?
        </h2>

        <div className="space-y-3">
          {jobRoles.map((role) => {
            const IconComponent = iconMap[role.icon] || LucideIcons.Briefcase;
            const subTasks = getSubTasksForRole(role.id);

            return (
              <Link
                key={role.id}
                to={`/job-services/${role.id}`}
                className="flex items-center justify-between rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {subTasks.length} services available
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default JobServicesCategory;

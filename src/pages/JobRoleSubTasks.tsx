import { useParams, Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { 
  jobRoles, 
  getSubTasksForRole,
  getProvidersForRole
} from "@/data/jobMockData";
import { JobRole } from "@/types/jobServices";

const JobRoleSubTasks = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  const role = jobRoles.find((r) => r.id === roleId);
  const subTasks = roleId ? getSubTasksForRole(roleId as JobRole) : [];
  const providerCount = roleId ? getProvidersForRole(roleId as JobRole).length : 0;

  if (!role) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">Role not found</p>
          <Link to="/services/job-services">
            <Button variant="link" className="mt-2">
              Back to Job Services
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showHeader={false}>
      {/* Custom Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/services/job-services">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold">{role.name}</h1>
            <p className="text-xs text-muted-foreground">
              {providerCount} providers available
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <h2 className="mb-4 text-lg font-semibold">
          Select required services
        </h2>

        <div className="space-y-3">
          {subTasks.map((task) => (
            <Link
              key={task.id}
              to={`/job-services/${roleId}/book?task=${task.id}`}
              className="flex items-center justify-between rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex-1">
                <h3 className="font-medium">{task.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* Or Hire for All */}
        <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-4">
          <p className="font-medium text-primary mb-2">Need multiple services?</p>
          <p className="text-sm text-muted-foreground mb-3">
            Hire a {role.name.toLowerCase()} for all available tasks
          </p>
          <Link to={`/job-services/${roleId}/book?task=all`}>
            <Button className="w-full">
              View All Providers
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default JobRoleSubTasks;

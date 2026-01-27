import { AppLayout } from "@/components/layout/AppLayout";
import { serviceCategories } from "@/data/mockData";
import { Link } from "react-router-dom";
import { 
  Zap, 
  Droplets, 
  Tv, 
  Hammer, 
  Paintbrush, 
  Sparkles,
  LucideIcon,
  ChevronRight
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Droplets,
  Tv,
  Hammer,
  Paintbrush,
  Sparkles,
};

const Services = () => {
  return (
    <AppLayout>
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold">All Services</h1>
        <p className="text-sm text-muted-foreground">
          Choose a category to find the help you need
        </p>

        <div className="mt-6 space-y-3">
          {serviceCategories.map((category) => {
            const IconComponent = iconMap[category.icon] || Zap;
            return (
              <Link
                key={category.id}
                to={`/services/${category.id}`}
                className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                  <IconComponent className="h-7 w-7 text-secondary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-medium">{category.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
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

export default Services;

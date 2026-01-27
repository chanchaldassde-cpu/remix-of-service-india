import { Link } from "react-router-dom";
import { serviceCategories } from "@/data/mockData";
import { 
  Zap, 
  Droplets, 
  Tv, 
  Hammer, 
  Paintbrush, 
  Sparkles,
  LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Droplets,
  Tv,
  Hammer,
  Paintbrush,
  Sparkles,
};

export function ServiceCategoryGrid() {
  return (
    <section className="px-4 py-6">
      <h2 className="mb-4 text-lg font-semibold">What do you need help with?</h2>
      
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {serviceCategories.map((category) => {
          const IconComponent = iconMap[category.icon] || Zap;
          return (
            <Link
              key={category.id}
              to={`/services/${category.id}`}
              className="group flex flex-col items-center gap-2 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-95"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 transition-colors group-hover:bg-secondary/20">
                <IconComponent className="h-6 w-6 text-secondary" />
              </div>
              <span className="text-center text-xs font-medium leading-tight">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

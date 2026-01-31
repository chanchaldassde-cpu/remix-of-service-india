import { Link } from "react-router-dom";
import { 
  Wrench, 
  Home, 
  Users, 
  ChevronRight,
  LucideIcon
} from "lucide-react";
import { mainCategoryInfo } from "@/data/categoriesData";

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Home,
  Users,
};

const colorMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary hover:bg-primary/20",
  success: "bg-success/10 text-success hover:bg-success/20",
  secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20",
};

export function MainCategoryCards() {
  const categories = Object.entries(mainCategoryInfo) as [string, typeof mainCategoryInfo.skilled][];

  return (
    <section className="px-4 py-6">
      <h2 className="mb-4 text-lg font-semibold">Choose a Service Type</h2>
      
      <div className="space-y-3">
        {categories.map(([key, category]) => {
          const IconComponent = iconMap[category.icon] || Wrench;
          const colorClass = colorMap[category.color] || colorMap.primary;
          
          return (
            <Link
              key={key}
              to={`/category/${key}`}
              className="group flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors ${colorClass}`}>
                <IconComponent className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

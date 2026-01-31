import { Link } from "react-router-dom";
import { serviceProblems, serviceCategories } from "@/data/categoriesData";
import { ChevronRight } from "lucide-react";

export function PopularProblems() {
  // Get a mix of popular problems from different categories
  const popularProblems = serviceProblems
    .filter(p => ["electrical", "plumbing", "cleaning", "driver"].includes(p.categoryId))
    .slice(0, 6);

  return (
    <section className="px-4 py-4 pb-24">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Popular Services</h2>
        <Link
          to="/category/skilled"
          className="flex items-center text-sm text-primary"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-2">
        {popularProblems.map((problem) => {
          const category = serviceCategories.find(c => c.id === problem.categoryId);
          return (
            <Link
              key={problem.id}
              to={`/category/${category?.mainCategory || 'skilled'}?select=${problem.categoryId}`}
              className="flex items-center justify-between rounded-lg bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex-1">
                <h3 className="font-medium">{problem.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {problem.description}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  <span className="font-medium text-primary">₹{problem.basePrice}</span>
                  {problem.estimatedTime && (
                    <span className="text-muted-foreground">
                      {problem.estimatedTime}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { serviceProblems } from "@/data/mockData";
import { ChevronRight } from "lucide-react";

export function PopularProblems() {
  const popularProblems = serviceProblems.slice(0, 6);

  return (
    <section className="px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Popular Problems</h2>
        <Link
          to="/services"
          className="flex items-center text-sm text-primary"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-2">
        {popularProblems.map((problem) => (
          <Link
            key={problem.id}
            to={`/book/${problem.categoryId}/${problem.id}`}
            className="flex items-center justify-between rounded-lg bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
          >
            <div className="flex-1">
              <h3 className="font-medium">{problem.name}</h3>
              <p className="text-sm text-muted-foreground">
                {problem.description}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">
                  {problem.estimatedTime}
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </section>
  );
}

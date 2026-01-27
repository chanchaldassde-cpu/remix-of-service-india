import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { serviceCategories, serviceProblems } from "@/data/mockData";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServiceCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const category = serviceCategories.find((c) => c.id === categoryId);
  const problems = serviceProblems.filter((p) => p.categoryId === categoryId);

  if (!category) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">Category not found</p>
          <Link to="/services">
            <Button variant="link" className="mt-2">
              Back to Services
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
          <Link to="/services">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold">{category.name}</h1>
            <p className="text-xs text-muted-foreground">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <h2 className="mb-4 text-lg font-semibold">
          What's the problem?
        </h2>

        <div className="space-y-3">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/book/${categoryId}/${problem.id}`}
              className="flex items-center justify-between rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex-1">
                <h3 className="font-medium">{problem.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {problem.description}
                </p>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {problem.estimatedTime}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {problems.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <p className="text-muted-foreground">No problems listed yet</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ServiceCategory;

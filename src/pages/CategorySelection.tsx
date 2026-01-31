import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ChevronRight, 
  Check,
  Zap,
  Droplets,
  Tv,
  Hammer,
  Paintbrush,
  Sparkles,
  ChefHat,
  Baby,
  HeartPulse,
  Car,
  Shield,
  UtensilsCrossed,
  Store,
  Briefcase,
  Home,
  LucideIcon
} from "lucide-react";
import { 
  mainCategoryInfo, 
  getCategoriesByMain, 
  getProblemsByCategory,
  SELECTION_LIMITS
} from "@/data/categoriesData";
import { cn } from "@/lib/utils";
import { HiringType, MainCategory } from "@/types/services";

const iconMap: Record<string, LucideIcon> = {
  Zap, Droplets, Tv, Hammer, Paintbrush, Sparkles,
  ChefHat, Baby, HeartPulse, Car, Shield, UtensilsCrossed,
  Store, Briefcase, Home,
};

const CategorySelection = () => {
  const { mainCategory } = useParams<{ mainCategory: string }>();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [hiringType, setHiringType] = useState<HiringType>("task");

  const categoryInfo = mainCategoryInfo[mainCategory as keyof typeof mainCategoryInfo];
  const categories = getCategoriesByMain(mainCategory || "");
  const problems = selectedCategory ? getProblemsByCategory(selectedCategory) : [];

  const isStaffOrDomestic = mainCategory === "domestic" || mainCategory === "staff";
  
  // Get selection limit based on category and hiring type
  const getSelectionLimit = () => {
    if (mainCategory === "skilled") return SELECTION_LIMITS.skilled;
    if (mainCategory === "domestic") {
      if (hiringType === "monthly") return SELECTION_LIMITS.domestic_monthly;
      return SELECTION_LIMITS.domestic_daily;
    }
    if (mainCategory === "staff") {
      if (hiringType === "monthly") return SELECTION_LIMITS.staff_monthly;
      return SELECTION_LIMITS.staff_daily;
    }
    return 3;
  };

  const selectionLimit = getSelectionLimit();

  const handleProblemToggle = (problemId: string) => {
    if (selectedProblems.includes(problemId)) {
      setSelectedProblems(prev => prev.filter(id => id !== problemId));
    } else if (selectedProblems.length < selectionLimit) {
      setSelectedProblems(prev => [...prev, problemId]);
    }
  };

  const handleContinue = () => {
    if (selectedCategory && selectedProblems.length > 0) {
      const params = new URLSearchParams({
        category: selectedCategory,
        problems: selectedProblems.join(","),
        ...(isStaffOrDomestic && { hiringType }),
      });
      navigate(`/book-service?${params.toString()}`);
    }
  };

  if (!categoryInfo) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">Category not found</p>
          <Link to="/">
            <Button variant="link" className="mt-2">Back to Home</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold">{categoryInfo.name}</h1>
            <p className="text-xs text-muted-foreground">{categoryInfo.description}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-32">
        {/* Hiring Type Toggle (for domestic/staff) */}
        {isStaffOrDomestic && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Hiring Type</h3>
            <div className="flex gap-2">
              {mainCategory === "domestic" && (
                <Button
                  variant={hiringType === "task" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setHiringType("task");
                    setSelectedProblems([]);
                  }}
                >
                  One-time Task
                </Button>
              )}
              <Button
                variant={hiringType === "daily" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setHiringType("daily");
                  setSelectedProblems([]);
                }}
              >
                Daily (₹/day)
              </Button>
              <Button
                variant={hiringType === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setHiringType("monthly");
                  setSelectedProblems([]);
                }}
              >
                Monthly (₹/mo)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {hiringType === "monthly" 
                ? "Select up to 5 tasks • First 7 days trial period"
                : `Select up to ${hiringType === "task" ? 3 : 3} tasks`
              }
            </p>
          </div>
        )}

        {/* Category Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Select Service</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const IconComponent = iconMap[cat.icon] || Zap;
              const isSelected = selectedCategory === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedProblems([]);
                  }}
                  className={cn(
                    "flex shrink-0 flex-col items-center gap-2 rounded-xl border px-4 py-3 transition-all min-w-[90px]",
                    isSelected 
                      ? "border-primary bg-primary/10" 
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <IconComponent className={cn("h-6 w-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs font-medium text-center", isSelected && "text-primary")}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Problems/Tasks Selection */}
        {selectedCategory && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {mainCategory === "skilled" ? "Select Problems" : "Select Tasks"}
              </h3>
              <Badge variant="outline">
                {selectedProblems.length}/{selectionLimit}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {problems.map((problem) => {
                const isSelected = selectedProblems.includes(problem.id);
                const isDisabled = !isSelected && selectedProblems.length >= selectionLimit;
                
                return (
                  <button
                    key={problem.id}
                    onClick={() => handleProblemToggle(problem.id)}
                    disabled={isDisabled}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all",
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : isDisabled
                        ? "border-border bg-muted/30 opacity-50"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{problem.name}</h4>
                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {problem.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="font-medium text-primary">₹{problem.basePrice}</span>
                        {problem.estimatedTime && (
                          <span className="text-muted-foreground">{problem.estimatedTime}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      {selectedProblems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 safe-area-bottom">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              {selectedProblems.length} {selectedProblems.length === 1 ? "item" : "items"} selected
            </span>
            <span className="font-semibold">
              ₹{problems
                .filter(p => selectedProblems.includes(p.id))
                .reduce((sum, p) => sum + p.basePrice, 0)
              }
            </span>
          </div>
          <Button className="w-full" size="lg" onClick={handleContinue}>
            Find Providers
          </Button>
        </div>
      )}
    </AppLayout>
  );
};

export default CategorySelection;

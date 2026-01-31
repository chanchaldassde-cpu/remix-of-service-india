import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { serviceCategories, serviceProblems, serviceProviders } from "@/data/categoriesData";
import { Link } from "react-router-dom";

interface SearchResult {
  type: "category" | "problem" | "provider";
  id: string;
  name: string;
  description: string;
  link: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const getSearchResults = (): SearchResult[] => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search categories
    serviceCategories.forEach((cat) => {
      if (cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q)) {
        results.push({
          type: "category",
          id: cat.id,
          name: cat.name,
          description: cat.description,
          link: `/category/${cat.mainCategory}`,
        });
      }
    });

    // Search problems/tasks
    serviceProblems.forEach((prob) => {
      if (prob.name.toLowerCase().includes(q) || prob.description.toLowerCase().includes(q)) {
        const cat = serviceCategories.find(c => c.id === prob.categoryId);
        results.push({
          type: "problem",
          id: prob.id,
          name: prob.name,
          description: `₹${prob.basePrice} • ${prob.estimatedTime || "Flexible"}`,
          link: cat ? `/category/${cat.mainCategory}?select=${prob.categoryId}` : "/",
        });
      }
    });

    // Search providers
    serviceProviders.forEach((prov) => {
      if (prov.name.toLowerCase().includes(q) || prov.specializations.some(s => s.toLowerCase().includes(q))) {
        results.push({
          type: "provider",
          id: prov.id,
          name: prov.name,
          description: `★ ${prov.rating} • ${prov.experience} exp`,
          link: `/provider-profile/${prov.id}`,
        });
      }
    });

    return results.slice(0, 8); // Limit results
  };

  const results = getSearchResults();
  const showResults = isFocused && query.trim().length > 0;

  return (
    <div className="relative px-4 py-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search services, tasks, or providers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute left-4 right-4 top-full z-50 mt-1 rounded-xl border border-border bg-card shadow-lg">
          {results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto py-2">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.link}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase text-muted-foreground">
                        {result.type}
                      </span>
                    </div>
                    <p className="font-medium">{result.name}</p>
                    <p className="text-sm text-muted-foreground">{result.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

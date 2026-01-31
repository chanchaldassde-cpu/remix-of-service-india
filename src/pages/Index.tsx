import { AppLayout } from "@/components/layout/AppLayout";
import { HeroBanner } from "@/components/home/HeroBanner";
import { MainCategoryCards } from "@/components/home/MainCategoryCards";
import { SearchBar } from "@/components/home/SearchBar";
import { QuickActions } from "@/components/home/QuickActions";
import { PopularProblems } from "@/components/home/PopularProblems";

const Index = () => {
  return (
    <AppLayout>
      <HeroBanner />
      <SearchBar />
      <MainCategoryCards />
      <QuickActions />
      <PopularProblems />
    </AppLayout>
  );
};

export default Index;

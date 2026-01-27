import { AppLayout } from "@/components/layout/AppLayout";
import { HeroBanner } from "@/components/home/HeroBanner";
import { ServiceCategoryGrid } from "@/components/home/ServiceCategoryGrid";
import { QuickActions } from "@/components/home/QuickActions";
import { PopularProblems } from "@/components/home/PopularProblems";

const Index = () => {
  return (
    <AppLayout>
      <HeroBanner />
      <ServiceCategoryGrid />
      <QuickActions />
      <PopularProblems />
    </AppLayout>
  );
};

export default Index;

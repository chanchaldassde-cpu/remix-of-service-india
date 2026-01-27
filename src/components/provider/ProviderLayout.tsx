import { ReactNode } from "react";
import { ProviderNav } from "./ProviderNav";
import { ProviderHeader } from "./ProviderHeader";

interface ProviderLayoutProps {
  children: ReactNode;
}

export function ProviderLayout({ children }: ProviderLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <ProviderHeader />
      <main className="pb-20 md:pb-0">{children}</main>
      <ProviderNav />
    </div>
  );
}

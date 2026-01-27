import { ReactNode } from "react";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export function AppLayout({ children, showHeader = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header />}
      <main className="pb-20 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}

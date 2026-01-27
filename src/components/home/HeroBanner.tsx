import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 px-4 py-8 text-primary-foreground">
      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary-foreground/10" />
      
      <div className="relative z-10">
        <h1 className="text-2xl font-bold leading-tight md:text-3xl">
          Home Repairs &<br />
          Services Made Easy
        </h1>
        <p className="mt-2 text-sm text-primary-foreground/90 md:text-base">
          Trusted professionals at your doorstep
        </p>
        <Link to="/services">
          <Button 
            size="lg"
            className="mt-4 bg-card text-foreground hover:bg-card/90"
          >
            Explore Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Trust badges */}
      <div className="relative z-10 mt-6 flex items-center gap-4 text-xs text-primary-foreground/80">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-primary-foreground">50K+</span>
          <span>Services</span>
        </div>
        <div className="h-3 w-px bg-primary-foreground/30" />
        <div className="flex items-center gap-1">
          <span className="font-semibold text-primary-foreground">4.8</span>
          <span>Rating</span>
        </div>
        <div className="h-3 w-px bg-primary-foreground/30" />
        <div className="flex items-center gap-1">
          <span className="font-semibold text-primary-foreground">10K+</span>
          <span>Experts</span>
        </div>
      </div>
    </div>
  );
}

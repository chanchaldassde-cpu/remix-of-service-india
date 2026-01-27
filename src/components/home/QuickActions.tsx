import { Clock, Shield, Headphones, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Quick Response",
    description: "Service within 2 hours",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Pay after service",
  },
  {
    icon: BadgeCheck,
    title: "Verified Experts",
    description: "Background checked",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
  },
];

export function QuickActions() {
  return (
    <section className="px-4 py-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start gap-3 rounded-lg bg-card p-3 shadow-sm"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium">{feature.title}</p>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

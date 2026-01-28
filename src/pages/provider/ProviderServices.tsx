import { useState } from "react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  IndianRupee, 
  Edit2, 
  Check,
  X,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Paintbrush
} from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  enabled: boolean;
  icon: React.ElementType;
}

const initialServices: Service[] = [
  { id: "1", name: "Fan Installation", category: "Electrical", basePrice: 349, enabled: true, icon: Zap },
  { id: "2", name: "Fan Repair", category: "Electrical", basePrice: 299, enabled: true, icon: Zap },
  { id: "3", name: "Switch/Socket Repair", category: "Electrical", basePrice: 199, enabled: true, icon: Zap },
  { id: "4", name: "Wiring Work", category: "Electrical", basePrice: 499, enabled: true, icon: Zap },
  { id: "5", name: "MCB/Fuse Repair", category: "Electrical", basePrice: 249, enabled: false, icon: Zap },
  { id: "6", name: "Tap Repair", category: "Plumbing", basePrice: 199, enabled: true, icon: Droplets },
  { id: "7", name: "Pipe Leakage Fix", category: "Plumbing", basePrice: 349, enabled: true, icon: Droplets },
  { id: "8", name: "AC Service", category: "Appliances", basePrice: 499, enabled: false, icon: Wind },
  { id: "9", name: "AC Gas Refill", category: "Appliances", basePrice: 1499, enabled: false, icon: Wind },
  { id: "10", name: "Wall Painting", category: "Home", basePrice: 2499, enabled: false, icon: Paintbrush },
];

const ProviderServices = () => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const toggleService = (id: string) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, enabled: !service.enabled } : service
      )
    );
    toast.success("Service updated!");
  };

  const startEditing = (service: Service) => {
    setEditingId(service.id);
    setEditPrice(service.basePrice);
  };

  const savePrice = (id: string) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, basePrice: editPrice } : service
      )
    );
    setEditingId(null);
    toast.success("Price updated!");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditPrice(0);
  };

  const enabledServices = services.filter(s => s.enabled);
  const availableServices = services.filter(s => !s.enabled);

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <ProviderLayout>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold">Manage Services & Pricing</h1>
          <p className="text-sm text-muted-foreground">
            Set your prices and enable/disable services
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{enabledServices.length}</p>
              <p className="text-sm text-muted-foreground">Active Services</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{availableServices.length}</p>
              <p className="text-sm text-muted-foreground">Available to Add</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Services */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wrench className="h-5 w-5" />
              Your Active Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {enabledServices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active services. Enable services below to start receiving bookings.
              </p>
            ) : (
              enabledServices.map(service => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <service.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {editingId === service.id ? (
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          <span className="text-sm mr-1">₹</span>
                          <Input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-20 h-8"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-success"
                          onClick={() => savePrice(service.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-primary">₹{service.basePrice}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => startEditing(service)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={service.enabled}
                          onCheckedChange={() => toggleService(service.id)}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Available Services by Category */}
        {categories.map(category => {
          const categoryServices = availableServices.filter(s => s.category === category);
          if (categoryServices.length === 0) return null;
          
          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryServices.map(service => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg opacity-75"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <service.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Starting at ₹{service.basePrice}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleService(service.id)}
                    >
                      Enable
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ProviderLayout>
  );
};

export default ProviderServices;

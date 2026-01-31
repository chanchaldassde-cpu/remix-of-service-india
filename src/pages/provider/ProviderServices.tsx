import { useState } from "react";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  IndianRupee, 
  Edit2, 
  Check,
  X,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Sparkles,
  Car,
  Shield,
  UtensilsCrossed
} from "lucide-react";
import { toast } from "sonner";

interface TaskService {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  enabled: boolean;
  icon: React.ElementType;
}

interface StaffService {
  id: string;
  name: string;
  category: string;
  dailyRate: number;
  monthlyRate: number;
  enabled: boolean;
  icon: React.ElementType;
  tasks: string[];
}

const initialTaskServices: TaskService[] = [
  { id: "1", name: "Fan Installation", category: "Electrical", basePrice: 349, enabled: true, icon: Zap },
  { id: "2", name: "Fan Repair", category: "Electrical", basePrice: 299, enabled: true, icon: Zap },
  { id: "3", name: "Switch/Socket Repair", category: "Electrical", basePrice: 199, enabled: true, icon: Zap },
  { id: "4", name: "Wiring Work", category: "Electrical", basePrice: 499, enabled: true, icon: Zap },
  { id: "5", name: "MCB/Fuse Repair", category: "Electrical", basePrice: 249, enabled: false, icon: Zap },
  { id: "6", name: "Tap Repair", category: "Plumbing", basePrice: 199, enabled: true, icon: Droplets },
  { id: "7", name: "Pipe Leakage Fix", category: "Plumbing", basePrice: 349, enabled: true, icon: Droplets },
  { id: "8", name: "AC Service", category: "Appliances", basePrice: 499, enabled: false, icon: Wind },
  { id: "9", name: "Deep Cleaning", category: "Cleaning", basePrice: 1499, enabled: false, icon: Sparkles },
];

const initialStaffServices: StaffService[] = [
  { 
    id: "s1", 
    name: "Driver", 
    category: "Staff", 
    dailyRate: 800, 
    monthlyRate: 18000, 
    enabled: true, 
    icon: Car,
    tasks: ["Office commute", "Daily errands", "Airport transfer"]
  },
  { 
    id: "s2", 
    name: "Security Guard", 
    category: "Staff", 
    dailyRate: 700, 
    monthlyRate: 15000, 
    enabled: false, 
    icon: Shield,
    tasks: ["Day security", "Night security"]
  },
  { 
    id: "s3", 
    name: "Waiter", 
    category: "Staff", 
    dailyRate: 600, 
    monthlyRate: 12000, 
    enabled: false, 
    icon: UtensilsCrossed,
    tasks: ["Party service", "Event catering"]
  },
  { 
    id: "s4", 
    name: "Cleaner/Maid", 
    category: "Domestic", 
    dailyRate: 500, 
    monthlyRate: 10000, 
    enabled: true, 
    icon: Sparkles,
    tasks: ["Regular cleaning", "Kitchen cleaning", "Dish washing"]
  },
];

const ProviderServices = () => {
  const [taskServices, setTaskServices] = useState<TaskService[]>(initialTaskServices);
  const [staffServices, setStaffServices] = useState<StaffService[]>(initialStaffServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDailyRate, setEditDailyRate] = useState<number>(0);
  const [editMonthlyRate, setEditMonthlyRate] = useState<number>(0);

  const toggleTaskService = (id: string) => {
    setTaskServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, enabled: !service.enabled } : service
      )
    );
    toast.success("Service updated!");
  };

  const toggleStaffService = (id: string) => {
    setStaffServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, enabled: !service.enabled } : service
      )
    );
    toast.success("Service updated!");
  };

  const startEditingTask = (service: TaskService) => {
    setEditingId(service.id);
    setEditPrice(service.basePrice);
  };

  const startEditingStaff = (service: StaffService) => {
    setEditingId(service.id);
    setEditDailyRate(service.dailyRate);
    setEditMonthlyRate(service.monthlyRate);
  };

  const saveTaskPrice = (id: string) => {
    setTaskServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, basePrice: editPrice } : service
      )
    );
    setEditingId(null);
    toast.success("Price updated!");
  };

  const saveStaffRates = (id: string) => {
    setStaffServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, dailyRate: editDailyRate, monthlyRate: editMonthlyRate } : service
      )
    );
    setEditingId(null);
    toast.success("Rates updated!");
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const enabledTaskServices = taskServices.filter(s => s.enabled);
  const availableTaskServices = taskServices.filter(s => !s.enabled);
  const enabledStaffServices = staffServices.filter(s => s.enabled);
  const availableStaffServices = staffServices.filter(s => !s.enabled);

  return (
    <ProviderLayout>
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold">Manage Services & Pricing</h1>
          <p className="text-sm text-muted-foreground">
            Set your task prices and daily/monthly rates
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{enabledTaskServices.length}</p>
              <p className="text-sm text-muted-foreground">Task Services</p>
            </CardContent>
          </Card>
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{enabledStaffServices.length}</p>
              <p className="text-sm text-muted-foreground">Staff Roles</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Task Pricing</TabsTrigger>
            <TabsTrigger value="rates">Daily/Monthly Rates</TabsTrigger>
          </TabsList>

          {/* Task-based Services */}
          <TabsContent value="tasks" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench className="h-5 w-5" />
                  Active Task Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {enabledTaskServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No active services. Enable services below to start receiving bookings.
                  </p>
                ) : (
                  enabledTaskServices.map(service => (
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
                              onClick={() => saveTaskPrice(service.id)}
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
                              onClick={() => startEditingTask(service)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Switch
                              checked={service.enabled}
                              onCheckedChange={() => toggleTaskService(service.id)}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Available to enable */}
            {availableTaskServices.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Available Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {availableTaskServices.map(service => (
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
                        onClick={() => toggleTaskService(service.id)}
                      >
                        Enable
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Daily/Monthly Rate Services */}
          <TabsContent value="rates" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IndianRupee className="h-5 w-5" />
                  Active Staff Roles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {enabledStaffServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No active staff roles. Enable roles below.
                  </p>
                ) : (
                  enabledStaffServices.map(service => (
                    <div
                      key={service.id}
                      className="p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <service.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {service.tasks.join(", ")}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={service.enabled}
                          onCheckedChange={() => toggleStaffService(service.id)}
                        />
                      </div>
                      
                      {editingId === service.id ? (
                        <div className="mt-3 pt-3 border-t border-border space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm w-16">Daily:</span>
                            <span className="text-sm">₹</span>
                            <Input
                              type="number"
                              value={editDailyRate}
                              onChange={(e) => setEditDailyRate(Number(e.target.value))}
                              className="w-24 h-8"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm w-16">Monthly:</span>
                            <span className="text-sm">₹</span>
                            <Input
                              type="number"
                              value={editMonthlyRate}
                              onChange={(e) => setEditMonthlyRate(Number(e.target.value))}
                              className="w-24 h-8"
                            />
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" onClick={() => saveStaffRates(service.id)}>
                              <Check className="h-4 w-4 mr-1" /> Save
                            </Button>
                            <Button variant="outline" size="sm" onClick={cancelEditing}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex gap-4">
                            <Badge variant="outline">₹{service.dailyRate}/day</Badge>
                            <Badge variant="secondary">₹{service.monthlyRate}/month</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingStaff(service)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Available staff roles */}
            {availableStaffServices.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Available Roles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {availableStaffServices.map(service => (
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
                            ₹{service.dailyRate}/day • ₹{service.monthlyRate}/month
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStaffService(service.id)}
                      >
                        Enable
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProviderLayout>
  );
};

export default ProviderServices;

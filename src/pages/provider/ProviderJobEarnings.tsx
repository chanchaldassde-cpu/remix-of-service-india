import { useState } from "react";
import { Link } from "react-router-dom";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  IndianRupee,
  TrendingUp,
  Calendar,
  User,
  Check,
  Clock,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { providerJobEarnings, providerJobHirings } from "@/data/providerJobMockData";

const ProviderJobEarnings = () => {
  const { thisMonth, lastMonth, breakdown } = providerJobEarnings;
  
  const percentChange = lastMonth.totalEarned > 0 
    ? ((thisMonth.totalEarned - lastMonth.totalEarned) / lastMonth.totalEarned * 100).toFixed(1)
    : 0;
  const isPositive = Number(percentChange) >= 0;

  return (
    <ProviderLayout>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/provider/jobs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Job Earnings</h1>
        </div>

        {/* Main Earnings Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">This Month</p>
                <p className="text-3xl font-bold mt-1">
                  ₹{thisMonth.totalEarned.toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
                <IndianRupee className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-primary-foreground/20">
              <div>
                <p className="text-xs opacity-70">Active Clients</p>
                <p className="font-semibold">{thisMonth.activeClients}</p>
              </div>
              <div className="h-8 w-px bg-primary-foreground/20" />
              <div>
                <p className="text-xs opacity-70">Days Worked</p>
                <p className="font-semibold">{thisMonth.verifiedDays}</p>
              </div>
              <div className="h-8 w-px bg-primary-foreground/20" />
              <Badge 
                variant="secondary" 
                className={`gap-1 ${isPositive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}
              >
                <TrendingUp className="h-3 w-3" />
                {isPositive ? '+' : ''}{percentChange}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-success">
                <Check className="h-4 w-4" />
                <span className="text-sm">Verified</span>
              </div>
              <p className="text-2xl font-bold mt-1">{thisMonth.verifiedDays}</p>
              <p className="text-xs text-muted-foreground">days this month</p>
            </CardContent>
          </Card>
          <Card className="bg-gold/10 border-gold/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-gold-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Pending</span>
              </div>
              <p className="text-2xl font-bold mt-1">{thisMonth.pendingDays}</p>
              <p className="text-xs text-muted-foreground">awaiting confirm</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for breakdown */}
        <Tabs defaultValue="clients">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clients">By Client</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="mt-4 space-y-3">
            {breakdown.map((client, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{client.clientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {client.daysWorked} days worked
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">₹{client.amount}</p>
                      <Badge variant="secondary" className="text-xs">
                        {client.status === "trial" ? "Trial" : 
                         client.status === "monthly" ? "Monthly" : "Completed"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">January 2024</h3>
                      <p className="text-sm text-muted-foreground">
                        {thisMonth.verifiedDays} days · {thisMonth.activeClients} clients
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">₹{thisMonth.totalEarned}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">December 2023</h3>
                      <p className="text-sm text-muted-foreground">
                        {lastMonth.verifiedDays} days · {lastMonth.activeClients} clients
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">₹{lastMonth.totalEarned}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/provider/jobs">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto text-primary" />
                <p className="mt-2 font-medium text-sm">Mark Attendance</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/provider/earnings">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <ArrowUpRight className="h-8 w-8 mx-auto text-primary" />
                <p className="mt-2 font-medium text-sm">All Earnings</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default ProviderJobEarnings;

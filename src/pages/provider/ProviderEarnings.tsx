import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Clock,
  Calendar,
  Wallet,
  Download
} from "lucide-react";

// Mock earnings data
const earningsData = {
  currentBalance: 4520,
  pendingPayout: 2180,
  thisWeek: 8750,
  lastWeek: 7200,
  thisMonth: 32450,
  totalPenalties: 45,
};

const recentTransactions = [
  {
    id: "1",
    type: "credit",
    description: "Completed: Fan repair - Rahul S.",
    amount: 220,
    date: "Today, 4:30 PM",
  },
  {
    id: "2",
    type: "credit",
    description: "Completed: AC service - Vikram K.",
    amount: 440,
    date: "Today, 12:15 PM",
  },
  {
    id: "3",
    type: "debit",
    description: "Late penalty: 20 mins late",
    amount: -10,
    date: "Yesterday",
  },
  {
    id: "4",
    type: "payout",
    description: "Bank transfer - HDFC ****1234",
    amount: -3500,
    date: "Jan 24",
  },
  {
    id: "5",
    type: "credit",
    description: "Completed: Wiring fix - Sneha R.",
    amount: 280,
    date: "Jan 24",
  },
];

const weeklyBreakdown = [
  { day: "Mon", earnings: 1200, jobs: 3 },
  { day: "Tue", earnings: 1450, jobs: 4 },
  { day: "Wed", earnings: 980, jobs: 2 },
  { day: "Thu", earnings: 1680, jobs: 4 },
  { day: "Fri", earnings: 1540, jobs: 3 },
  { day: "Sat", earnings: 1900, jobs: 5 },
  { day: "Sun", earnings: 0, jobs: 0 },
];

const ProviderEarnings = () => {
  const weeklyChange = ((earningsData.thisWeek - earningsData.lastWeek) / earningsData.lastWeek * 100).toFixed(1);
  const isPositiveChange = parseFloat(weeklyChange) > 0;

  return (
    <ProviderLayout>
      <div className="px-4 py-6 space-y-6">
        <h1 className="text-xl font-bold">Earnings</h1>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Available Balance</p>
                <p className="text-3xl font-bold mt-1">₹{earningsData.currentBalance.toLocaleString()}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary-foreground/20">
              <div>
                <p className="text-xs opacity-70">Pending Payout</p>
                <p className="font-semibold">₹{earningsData.pendingPayout}</p>
              </div>
              <Button size="sm" variant="secondary" className="gap-1">
                <ArrowUpRight className="h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <Badge 
                  variant={isPositiveChange ? "default" : "destructive"} 
                  className="text-xs gap-0.5"
                >
                  {isPositiveChange ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {weeklyChange}%
                </Badge>
              </div>
              <p className="text-2xl font-bold mt-1">₹{earningsData.thisWeek.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-1">₹{earningsData.thisMonth.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyBreakdown.map((day, index) => {
                const maxEarnings = Math.max(...weeklyBreakdown.map(d => d.earnings));
                const height = day.earnings > 0 ? (day.earnings / maxEarnings) * 100 : 5;
                const isToday = index === 5; // Assuming Saturday is today
                
                return (
                  <div key={day.day} className="flex flex-col items-center flex-1">
                    <span className="text-xs text-muted-foreground mb-1">
                      {day.jobs > 0 ? day.jobs : '-'}
                    </span>
                    <div 
                      className={`w-full rounded-t-md transition-all ${
                        isToday ? 'bg-primary' : 'bg-muted'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className={`text-xs mt-2 ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Penalties Info */}
        {earningsData.totalPenalties > 0 && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-medium">Late Penalties</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
              <p className="font-bold text-destructive">-₹{earningsData.totalPenalties}</p>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0 divide-y">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      transaction.type === "credit" 
                        ? "bg-success/10 text-success" 
                        : transaction.type === "debit"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <IndianRupee className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${
                    transaction.amount > 0 ? "text-success" : "text-destructive"
                  }`}>
                    {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default ProviderEarnings;

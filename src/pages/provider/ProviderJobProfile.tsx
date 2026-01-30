import { useState } from "react";
import { Link } from "react-router-dom";
import { ProviderLayout } from "@/components/provider/ProviderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  IndianRupee,
  Briefcase,
  CheckCircle2,
  Edit2,
  Save,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { currentProviderProfile } from "@/data/providerJobMockData";
import { jobRoles, jobSubTasks } from "@/data/jobMockData";
import { JobRole } from "@/types/jobServices";

const ProviderJobProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<JobRole>(currentProviderProfile.jobRole);
  const [selectedSubTasks, setSelectedSubTasks] = useState<string[]>(currentProviderProfile.subTasks);
  const [dailyRate, setDailyRate] = useState(currentProviderProfile.dailyRate);
  const [monthlyRate, setMonthlyRate] = useState(currentProviderProfile.monthlyRate);

  const availableSubTasks = jobSubTasks.filter((t) => t.jobRoleId === selectedRole);

  const handleRoleChange = (roleId: JobRole) => {
    setSelectedRole(roleId);
    setSelectedSubTasks([]); // Reset sub-tasks when role changes
  };

  const handleSubTaskToggle = (taskId: string) => {
    setSelectedSubTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSave = () => {
    if (selectedSubTasks.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    if (dailyRate <= 0 || monthlyRate <= 0) {
      toast.error("Please enter valid rates");
      return;
    }
    
    setIsEditing(false);
    toast.success("Job profile updated!", {
      description: "Your new rates and services are now active",
    });
  };

  const selectedRoleData = jobRoles.find((r) => r.id === selectedRole);

  return (
    <ProviderLayout>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/provider/jobs">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">My Job Profile</h1>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
        </div>

        {/* Profile Stats */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                {currentProviderProfile.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{currentProviderProfile.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-gold text-gold" />
                    <span className="font-medium">{currentProviderProfile.rating}</span>
                    <span className="text-muted-foreground">
                      ({currentProviderProfile.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold">{currentProviderProfile.completedJobs}</p>
                <p className="text-xs text-muted-foreground">Jobs Done</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{currentProviderProfile.experience}</p>
                <p className="text-xs text-muted-foreground">Experience</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Active Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Role Selection */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Job Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                {jobRoles.map((role) => (
                  <Button
                    key={role.id}
                    variant={selectedRole === role.id ? "default" : "outline"}
                    className="justify-start h-auto py-3"
                    onClick={() => handleRoleChange(role.id)}
                  >
                    <div className="text-left">
                      <p className="font-medium">{role.name}</p>
                      <p className="text-xs opacity-70">{role.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Briefcase className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedRoleData?.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedRoleData?.description}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services/Sub-Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Services You Offer</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                {availableSubTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={task.id}
                      checked={selectedSubTasks.includes(task.id)}
                      onCheckedChange={() => handleSubTaskToggle(task.id)}
                    />
                    <Label htmlFor={task.id} className="flex-1 cursor-pointer">
                      <p className="font-medium">{task.name}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSubTasks.map((taskId) => {
                  const task = jobSubTasks.find((t) => t.id === taskId);
                  return (
                    <Badge key={taskId} variant="secondary" className="py-1.5 px-3">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {task?.name}
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rates */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Your Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">Daily Rate (₹)</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyRate">Monthly Rate (₹)</Label>
                  <Input
                    id="monthlyRate"
                    type="number"
                    value={monthlyRate}
                    onChange={(e) => setMonthlyRate(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Monthly rate should typically be 20-25x daily rate for best value
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">₹{dailyRate}</p>
                  <p className="text-sm text-muted-foreground">Per Day</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">₹{monthlyRate}</p>
                  <p className="text-sm text-muted-foreground">Per Month</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Earnings Preview */}
        {!isEditing && (
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4">
              <h3 className="font-medium text-success mb-3">Potential Earnings</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">If 1 monthly client</span>
                  <span className="font-medium">₹{monthlyRate}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">If 3 monthly clients</span>
                  <span className="font-medium">₹{monthlyRate * 3}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">If 5 daily jobs/week</span>
                  <span className="font-medium">₹{dailyRate * 5 * 4}/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderJobProfile;

import { useState } from "react";
import { JobHiring } from "@/types/jobServices";
import { calculateTerminationCost } from "@/data/jobMockData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Calculator, IndianRupee } from "lucide-react";

interface TerminationDialogProps {
  hiring: JobHiring;
  onConfirmTermination: () => void;
  children: React.ReactNode;
}

export function TerminationDialog({ 
  hiring, 
  onConfirmTermination,
  children 
}: TerminationDialogProps) {
  const [open, setOpen] = useState(false);

  // Calculate costs
  const monthlyPrepaid = hiring.status === "monthly_confirmed" ? hiring.monthlyRate : 0;
  const { amountForWorkedDays, refundAmount, finalSettlement } = calculateTerminationCost(
    hiring.daysWorked,
    hiring.dailyRate,
    monthlyPrepaid
  );

  const handleConfirm = () => {
    onConfirmTermination();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            End Hiring
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to terminate this hiring? Here's the settlement breakdown:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Provider Info */}
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
              <span className="text-sm font-semibold text-secondary">
                {hiring.provider?.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium">{hiring.provider?.name}</p>
              <p className="text-sm text-muted-foreground">
                {hiring.isTrialPeriod ? "Trial Period" : "Monthly Hire"}
              </p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              Settlement Breakdown
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days Worked</span>
                <span className="font-medium">{hiring.daysWorked} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Rate</span>
                <span className="font-medium">₹{hiring.dailyRate}/day</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Amount for Worked Days</span>
                <span className="font-medium">₹{amountForWorkedDays}</span>
              </div>

              {monthlyPrepaid > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Prepaid</span>
                    <span className="font-medium">₹{monthlyPrepaid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Refund Amount</span>
                    <span className="font-medium text-success">₹{refundAmount}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-medium">Final Settlement</span>
                <span className={`font-bold ${finalSettlement > 0 ? "text-destructive" : "text-success"}`}>
                  <IndianRupee className="inline h-4 w-4" />
                  {Math.abs(finalSettlement)}
                  {finalSettlement > 0 ? " to pay" : " refund"}
                </span>
              </div>
            </div>
          </div>

          {hiring.isTrialPeriod && (
            <p className="text-xs text-muted-foreground">
              * During trial period, you're only charged for days worked at the daily rate.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm Termination
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

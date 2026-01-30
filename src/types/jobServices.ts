// Job-Based Services Type Definitions

export type JobRole = 
  | "night-guard"
  | "driver"
  | "waiter"
  | "maid"
  | "shop-representative";

export type HiringType = "daily" | "monthly";

export interface JobServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  isJobBased: true;
}

export interface JobSubTask {
  id: string;
  jobRoleId: JobRole;
  name: string;
  description: string;
}

export interface JobProvider {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  experience: string;
  verified: boolean;
  jobRole: JobRole;
  subTasks: string[]; // IDs of sub-tasks they can do
  dailyRate: number; // ₹ per day
  monthlyRate: number; // ₹ per month
  location: string;
  latitude: number;
  longitude: number;
  completedJobs: number;
}

export interface JobHiring {
  id: string;
  userId: string;
  providerId: string;
  provider?: JobProvider;
  jobRoleId: JobRole;
  subTaskIds: string[];
  hiringType: HiringType;
  status: JobHiringStatus;
  startDate: string;
  endDate?: string; // For monthly, when terminated
  trialEndDate?: string; // 7 days after start for monthly
  isTrialPeriod: boolean;
  address: string;
  notes?: string;
  // Pricing
  dailyRate: number;
  monthlyRate: number;
  // Payment tracking
  totalPaid: number;
  daysWorked: number;
  // Timestamps
  createdAt: string;
  updatedAt: string;
  // Provider view - customer info
  customerName?: string;
  customerPhone?: string;
}

export type JobHiringStatus = 
  | "pending"
  | "active"
  | "trial" // First 7 days of monthly
  | "monthly_confirmed" // After trial, confirmed for monthly
  | "terminated"
  | "completed";

export interface AttendanceRecord {
  id: string;
  hiringId: string;
  date: string; // YYYY-MM-DD
  providerMarked: boolean;
  providerMarkedAt?: string;
  userConfirmed: boolean;
  userConfirmedAt?: string;
  isVerified: boolean; // true only if both marked
  notes?: string;
}

export interface MonthlyAttendanceSummary {
  hiringId: string;
  month: string; // YYYY-MM
  totalDays: number;
  presentDays: number;
  missedDays: number;
  pendingConfirmation: number;
  amountDue: number;
}

// Termination calculation
export interface TerminationPreview {
  hiringId: string;
  daysWorked: number;
  dailyRate: number;
  amountForWorkedDays: number;
  monthlyPrepaid: number;
  refundAmount: number;
  finalSettlement: number;
}

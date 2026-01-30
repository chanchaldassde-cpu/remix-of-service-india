import { JobHiring, AttendanceRecord, JobRole } from "@/types/jobServices";
import { jobRoles, jobSubTasks } from "./jobMockData";

// Current provider's profile (mock logged-in provider)
export const currentProviderProfile = {
  id: "provider-current",
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  email: "rajesh.kumar@email.com",
  jobRole: "maid" as JobRole,
  subTasks: ["full-house-cleaning", "cooking", "dish-washing"],
  dailyRate: 500,
  monthlyRate: 12000,
  experience: "8 years",
  verified: true,
  rating: 4.8,
  reviewCount: 156,
  completedJobs: 342,
  location: "Koramangala, Bangalore",
};

// Mock hirings where this provider is hired by customers
export const providerJobHirings: JobHiring[] = [
  {
    id: "prov-hiring-1",
    userId: "customer-1",
    providerId: "provider-current",
    jobRoleId: "maid",
    subTaskIds: ["full-house-cleaning", "cooking"],
    hiringType: "monthly",
    status: "trial",
    startDate: "2024-01-25",
    trialEndDate: "2024-02-01",
    isTrialPeriod: true,
    address: "123, 4th Cross, Koramangala, Bangalore - 560034",
    dailyRate: 500,
    monthlyRate: 12000,
    totalPaid: 2500,
    daysWorked: 5,
    createdAt: "2024-01-25T10:30:00Z",
    updatedAt: "2024-01-29T10:00:00Z",
    // Customer info for provider view
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 12345",
  },
  {
    id: "prov-hiring-2",
    userId: "customer-2",
    providerId: "provider-current",
    jobRoleId: "maid",
    subTaskIds: ["full-house-cleaning", "dish-washing", "laundry"],
    hiringType: "monthly",
    status: "monthly_confirmed",
    startDate: "2024-01-10",
    trialEndDate: "2024-01-17",
    isTrialPeriod: false,
    address: "456, 2nd Main, HSR Layout, Bangalore - 560102",
    dailyRate: 500,
    monthlyRate: 12000,
    totalPaid: 12000,
    daysWorked: 19,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-29T08:00:00Z",
    customerName: "Priya Patel",
    customerPhone: "+91 87654 32109",
  },
  {
    id: "prov-hiring-3",
    userId: "customer-3",
    providerId: "provider-current",
    jobRoleId: "maid",
    subTaskIds: ["cooking"],
    hiringType: "daily",
    status: "completed",
    startDate: "2024-01-28",
    address: "789, 5th Block, Jayanagar, Bangalore - 560041",
    isTrialPeriod: false,
    dailyRate: 500,
    monthlyRate: 12000,
    totalPaid: 500,
    daysWorked: 1,
    createdAt: "2024-01-27T14:00:00Z",
    updatedAt: "2024-01-28T22:00:00Z",
    customerName: "Vikram Singh",
    customerPhone: "+91 76543 21098",
  },
];

// Provider's attendance records
export const providerAttendanceRecords: AttendanceRecord[] = [
  // Hiring 1 attendance
  { id: "patt-1", hiringId: "prov-hiring-1", date: "2024-01-25", providerMarked: true, providerMarkedAt: "2024-01-25T09:00:00Z", userConfirmed: true, userConfirmedAt: "2024-01-25T18:00:00Z", isVerified: true },
  { id: "patt-2", hiringId: "prov-hiring-1", date: "2024-01-26", providerMarked: true, providerMarkedAt: "2024-01-26T09:15:00Z", userConfirmed: true, userConfirmedAt: "2024-01-26T18:30:00Z", isVerified: true },
  { id: "patt-3", hiringId: "prov-hiring-1", date: "2024-01-27", providerMarked: true, providerMarkedAt: "2024-01-27T09:00:00Z", userConfirmed: true, userConfirmedAt: "2024-01-27T19:00:00Z", isVerified: true },
  { id: "patt-4", hiringId: "prov-hiring-1", date: "2024-01-28", providerMarked: true, providerMarkedAt: "2024-01-28T09:30:00Z", userConfirmed: true, userConfirmedAt: "2024-01-28T17:45:00Z", isVerified: true },
  { id: "patt-5", hiringId: "prov-hiring-1", date: "2024-01-29", providerMarked: true, providerMarkedAt: "2024-01-29T09:00:00Z", userConfirmed: false, isVerified: false },
  
  // Hiring 2 attendance
  { id: "patt-10", hiringId: "prov-hiring-2", date: "2024-01-28", providerMarked: true, providerMarkedAt: "2024-01-28T08:00:00Z", userConfirmed: true, userConfirmedAt: "2024-01-28T20:00:00Z", isVerified: true },
  { id: "patt-11", hiringId: "prov-hiring-2", date: "2024-01-29", providerMarked: true, providerMarkedAt: "2024-01-29T08:15:00Z", userConfirmed: true, userConfirmedAt: "2024-01-29T19:30:00Z", isVerified: true },
];

// Provider job earnings data
export const providerJobEarnings = {
  thisMonth: {
    totalEarned: 15500,
    verifiedDays: 24,
    pendingDays: 2,
    activeClients: 2,
  },
  lastMonth: {
    totalEarned: 14000,
    verifiedDays: 28,
    pendingDays: 0,
    activeClients: 2,
  },
  breakdown: [
    { clientName: "Rahul Sharma", daysWorked: 5, amount: 2500, status: "trial" },
    { clientName: "Priya Patel", daysWorked: 19, amount: 12000, status: "monthly" },
    { clientName: "Vikram Singh", daysWorked: 1, amount: 500, status: "completed" },
  ],
};

// New job requests for the provider
export const providerJobRequests = [
  {
    id: "job-req-1",
    customerName: "Anita Desai",
    customerPhone: "+91 99887 76655",
    jobRole: "maid" as JobRole,
    subTaskIds: ["full-house-cleaning", "cooking"],
    hiringType: "monthly" as const,
    address: "101, Palm Heights, Whitefield, Bangalore",
    distance: 3.2,
    dailyRate: 500,
    monthlyRate: 12000,
    requestedAt: "2024-01-29T14:30:00Z",
  },
  {
    id: "job-req-2",
    customerName: "Suresh Reddy",
    customerPhone: "+91 88776 65544",
    jobRole: "maid" as JobRole,
    subTaskIds: ["dish-washing", "laundry"],
    hiringType: "daily" as const,
    address: "202, Green Valley, Electronic City, Bangalore",
    distance: 8.5,
    dailyRate: 500,
    monthlyRate: 12000,
    requestedAt: "2024-01-29T10:15:00Z",
  },
];

// Helper functions
export function getJobRoleName(roleId: JobRole): string {
  return jobRoles.find((r) => r.id === roleId)?.name || roleId;
}

export function getSubTaskNames(subTaskIds: string[]): string[] {
  return subTaskIds.map((id) => {
    const task = jobSubTasks.find((t) => t.id === id);
    return task?.name || id;
  });
}

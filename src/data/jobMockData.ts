import { 
  JobServiceCategory, 
  JobSubTask, 
  JobProvider, 
  JobHiring, 
  AttendanceRecord,
  JobRole 
} from "@/types/jobServices";

// Job-Based Services Category
export const jobServiceCategory: JobServiceCategory = {
  id: "job-services",
  name: "Job-Based Services",
  icon: "Briefcase",
  description: "Hire staff daily or monthly",
  isJobBased: true,
};

// Job Roles (sub-categories under Job-Based Services)
export const jobRoles: { id: JobRole; name: string; icon: string; description: string }[] = [
  {
    id: "night-guard",
    name: "Night Guard",
    icon: "Shield",
    description: "Security & night watch services",
  },
  {
    id: "driver",
    name: "Driver",
    icon: "Car",
    description: "Personal & commercial driving",
  },
  {
    id: "waiter",
    name: "Waiter",
    icon: "UtensilsCrossed",
    description: "Event & party service staff",
  },
  {
    id: "maid",
    name: "Maid",
    icon: "Home",
    description: "Household help & cleaning",
  },
  {
    id: "shop-representative",
    name: "Shop Representative",
    icon: "Store",
    description: "Sales & customer service",
  },
];

// Sub-tasks for each job role
export const jobSubTasks: JobSubTask[] = [
  // Maid sub-tasks
  { id: "full-house-cleaning", jobRoleId: "maid", name: "Full House Cleaning", description: "Complete home cleaning" },
  { id: "cooking", jobRoleId: "maid", name: "Cooking", description: "Daily meal preparation" },
  { id: "dish-washing", jobRoleId: "maid", name: "Dish Washing", description: "Utensils & kitchen cleanup" },
  { id: "baby-care", jobRoleId: "maid", name: "Baby Care", description: "Child supervision & care" },
  { id: "laundry", jobRoleId: "maid", name: "Laundry", description: "Washing & ironing clothes" },
  
  // Driver sub-tasks
  { id: "office-commute", jobRoleId: "driver", name: "Office Commute", description: "Daily office drop & pickup" },
  { id: "outstation-trip", jobRoleId: "driver", name: "Outstation Trip", description: "Long-distance travel" },
  { id: "daily-pickup-drop", jobRoleId: "driver", name: "Daily Pickup/Drop", description: "School, tuition, etc." },
  { id: "on-call", jobRoleId: "driver", name: "On-Call Service", description: "Available when needed" },
  
  // Night Guard sub-tasks
  { id: "apartment-security", jobRoleId: "night-guard", name: "Apartment Security", description: "Building security patrol" },
  { id: "office-security", jobRoleId: "night-guard", name: "Office Security", description: "Commercial premises watch" },
  { id: "event-security", jobRoleId: "night-guard", name: "Event Security", description: "Party & function security" },
  
  // Waiter sub-tasks
  { id: "party-service", jobRoleId: "waiter", name: "Party Service", description: "Serving at home parties" },
  { id: "event-catering", jobRoleId: "waiter", name: "Event Catering", description: "Large event service" },
  { id: "fine-dining", jobRoleId: "waiter", name: "Fine Dining Service", description: "Professional table service" },
  
  // Shop Representative sub-tasks
  { id: "customer-service", jobRoleId: "shop-representative", name: "Customer Service", description: "Handle customer queries" },
  { id: "sales-assistance", jobRoleId: "shop-representative", name: "Sales Assistance", description: "Product demos & sales" },
  { id: "inventory-management", jobRoleId: "shop-representative", name: "Inventory Management", description: "Stock tracking & display" },
];

// Mock Job Providers
export const jobProviders: JobProvider[] = [
  // Maids
  {
    id: "job-provider-1",
    name: "Lakshmi Devi",
    rating: 4.9,
    reviewCount: 156,
    experience: "10 years",
    verified: true,
    jobRole: "maid",
    subTasks: ["full-house-cleaning", "cooking", "dish-washing"],
    dailyRate: 500,
    monthlyRate: 12000,
    location: "Koramangala, Bangalore",
    latitude: 12.9352,
    longitude: 77.6245,
    completedJobs: 420,
  },
  {
    id: "job-provider-2",
    name: "Meena Kumari",
    rating: 4.7,
    reviewCount: 98,
    experience: "6 years",
    verified: true,
    jobRole: "maid",
    subTasks: ["full-house-cleaning", "laundry", "baby-care"],
    dailyRate: 600,
    monthlyRate: 15000,
    location: "HSR Layout, Bangalore",
    latitude: 12.9116,
    longitude: 77.6389,
    completedJobs: 245,
  },
  // Drivers
  {
    id: "job-provider-3",
    name: "Ramesh Gowda",
    rating: 4.8,
    reviewCount: 234,
    experience: "12 years",
    verified: true,
    jobRole: "driver",
    subTasks: ["office-commute", "outstation-trip", "on-call"],
    dailyRate: 800,
    monthlyRate: 20000,
    location: "Indiranagar, Bangalore",
    latitude: 12.9784,
    longitude: 77.6408,
    completedJobs: 512,
  },
  {
    id: "job-provider-4",
    name: "Sunil Kumar",
    rating: 4.6,
    reviewCount: 167,
    experience: "8 years",
    verified: true,
    jobRole: "driver",
    subTasks: ["daily-pickup-drop", "office-commute"],
    dailyRate: 700,
    monthlyRate: 18000,
    location: "Whitefield, Bangalore",
    latitude: 12.9698,
    longitude: 77.7500,
    completedJobs: 328,
  },
  // Night Guards
  {
    id: "job-provider-5",
    name: "Raju Singh",
    rating: 4.7,
    reviewCount: 89,
    experience: "15 years",
    verified: true,
    jobRole: "night-guard",
    subTasks: ["apartment-security", "office-security"],
    dailyRate: 600,
    monthlyRate: 15000,
    location: "BTM Layout, Bangalore",
    latitude: 12.9166,
    longitude: 77.6101,
    completedJobs: 156,
  },
  // Waiters
  {
    id: "job-provider-6",
    name: "Prakash Shetty",
    rating: 4.9,
    reviewCount: 212,
    experience: "7 years",
    verified: true,
    jobRole: "waiter",
    subTasks: ["party-service", "event-catering", "fine-dining"],
    dailyRate: 700,
    monthlyRate: 18000,
    location: "Jayanagar, Bangalore",
    latitude: 12.9299,
    longitude: 77.5838,
    completedJobs: 389,
  },
  // Shop Representatives
  {
    id: "job-provider-7",
    name: "Divya Sharma",
    rating: 4.8,
    reviewCount: 134,
    experience: "5 years",
    verified: true,
    jobRole: "shop-representative",
    subTasks: ["customer-service", "sales-assistance"],
    dailyRate: 550,
    monthlyRate: 14000,
    location: "MG Road, Bangalore",
    latitude: 12.9757,
    longitude: 77.6063,
    completedJobs: 198,
  },
];

// Mock Active Hirings
export const mockJobHirings: JobHiring[] = [
  {
    id: "hiring-1",
    userId: "user-1",
    providerId: "job-provider-1",
    provider: jobProviders[0],
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
    totalPaid: 2500, // 5 days × ₹500
    daysWorked: 5,
    createdAt: "2024-01-25T10:30:00Z",
    updatedAt: "2024-01-29T10:00:00Z",
  },
  {
    id: "hiring-2",
    userId: "user-1",
    providerId: "job-provider-3",
    provider: jobProviders[2],
    jobRoleId: "driver",
    subTaskIds: ["office-commute"],
    hiringType: "monthly",
    status: "monthly_confirmed",
    startDate: "2024-01-10",
    trialEndDate: "2024-01-17",
    isTrialPeriod: false,
    address: "123, 4th Cross, Koramangala, Bangalore - 560034",
    dailyRate: 800,
    monthlyRate: 20000,
    totalPaid: 20000,
    daysWorked: 19,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-29T08:00:00Z",
  },
  {
    id: "hiring-3",
    userId: "user-1",
    providerId: "job-provider-6",
    provider: jobProviders[5],
    jobRoleId: "waiter",
    subTaskIds: ["party-service"],
    hiringType: "daily",
    status: "completed",
    startDate: "2024-01-28",
    address: "123, 4th Cross, Koramangala, Bangalore - 560034",
    isTrialPeriod: false,
    dailyRate: 700,
    monthlyRate: 18000,
    totalPaid: 700,
    daysWorked: 1,
    createdAt: "2024-01-27T14:00:00Z",
    updatedAt: "2024-01-28T22:00:00Z",
  },
];

// Mock Attendance Records for January 2024
export const mockAttendanceRecords: AttendanceRecord[] = [
  // Maid attendance (hiring-1)
  { id: "att-1", hiringId: "hiring-1", date: "2024-01-25", providerMarked: true, providerMarkedAt: "2024-01-25T09:00:00Z", userConfirmed: true, userConfirmedAt: "2024-01-25T18:00:00Z", isVerified: true },
  { id: "att-2", hiringId: "hiring-1", date: "2024-01-26", providerMarked: true, providerMarkedAt: "2024-01-26T09:15:00Z", userConfirmed: true, userConfirmedAt: "2024-01-26T18:30:00Z", isVerified: true },
  { id: "att-3", hiringId: "hiring-1", date: "2024-01-27", providerMarked: true, providerMarkedAt: "2024-01-27T09:00:00Z", userConfirmed: true, userConfirmedAt: "2024-01-27T19:00:00Z", isVerified: true },
  { id: "att-4", hiringId: "hiring-1", date: "2024-01-28", providerMarked: true, providerMarkedAt: "2024-01-28T09:30:00Z", userConfirmed: true, userConfirmedAt: "2024-01-28T17:45:00Z", isVerified: true },
  { id: "att-5", hiringId: "hiring-1", date: "2024-01-29", providerMarked: true, providerMarkedAt: "2024-01-29T09:00:00Z", userConfirmed: false, isVerified: false },
  // Driver attendance (hiring-2) - sample days
  { id: "att-10", hiringId: "hiring-2", date: "2024-01-28", providerMarked: true, providerMarkedAt: "2024-01-28T08:00:00Z", userConfirmed: true, userConfirmedAt: "2024-01-28T20:00:00Z", isVerified: true },
  { id: "att-11", hiringId: "hiring-2", date: "2024-01-29", providerMarked: true, providerMarkedAt: "2024-01-29T08:15:00Z", userConfirmed: true, userConfirmedAt: "2024-01-29T19:30:00Z", isVerified: true },
];

// Helper to get sub-tasks for a job role
export function getSubTasksForRole(roleId: JobRole): JobSubTask[] {
  return jobSubTasks.filter((t) => t.jobRoleId === roleId);
}

// Helper to get providers for a job role
export function getProvidersForRole(roleId: JobRole): JobProvider[] {
  return jobProviders.filter((p) => p.jobRole === roleId);
}

// Helper to calculate termination cost
export function calculateTerminationCost(
  daysWorked: number,
  dailyRate: number,
  monthlyPrepaid: number
): { amountForWorkedDays: number; refundAmount: number; finalSettlement: number } {
  const amountForWorkedDays = daysWorked * dailyRate;
  const refundAmount = Math.max(0, monthlyPrepaid - amountForWorkedDays);
  const finalSettlement = monthlyPrepaid > amountForWorkedDays ? -refundAmount : amountForWorkedDays - monthlyPrepaid;
  
  return { amountForWorkedDays, refundAmount, finalSettlement };
}

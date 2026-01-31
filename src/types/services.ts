// GrowIndia Service Categories Type System

// Main category types
export type MainCategory = "skilled" | "domestic" | "staff";

// Hiring type for domestic and staff categories
export type HiringType = "task" | "daily" | "monthly";

// Service category structure
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  mainCategory: MainCategory;
  image?: string;
}

// Problem/Task for Skilled Services and Domestic tasks
export interface ServiceProblem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  estimatedTime?: string;
  basePrice: number;
}

// Provider with category-specific pricing
export interface ServiceProvider {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  experience: string;
  verified: boolean;
  specializations: string[];
  categoryIds: string[]; // Categories they can serve
  location: string;
  latitude: number;
  longitude: number;
  completedJobs: number;
  // Pricing based on service type
  taskPrices: Record<string, number>; // problemId -> price
  dailyRate?: number;
  monthlyRate?: number;
  distance?: number;
}

// Selection limits based on category/hiring type
export const SELECTION_LIMITS = {
  skilled: 3, // Max 3 problems
  domestic_task: 3, // Max 3 tasks for one-time
  domestic_daily: 3, // Max 3 tasks for daily
  domestic_monthly: 5, // Max 5 tasks for monthly
  staff_daily: 3, // Max 3 tasks for daily
  staff_monthly: 5, // Max 5 tasks for monthly
} as const;

// Booking status
export type BookingStatus = 
  | "pending"
  | "accepted"
  | "in_progress"
  | "provider_completed"
  | "completed"
  | "cancelled";

// Unified booking structure
export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  provider?: ServiceProvider;
  categoryId: string;
  category?: ServiceCategory;
  mainCategory: MainCategory;
  // Selected problems/tasks
  selectedProblemIds: string[];
  selectedProblems?: ServiceProblem[];
  // Hiring type (for domestic/staff)
  hiringType?: HiringType;
  // Trial tracking for monthly
  isTrialPeriod?: boolean;
  trialEndDate?: string;
  // Schedule
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  notes?: string;
  // Pricing
  itemPrices: Record<string, number>; // problemId -> price
  totalPrice: number;
  advanceAmount: number;
  remainingAmount: number;
  // Status
  status: BookingStatus;
  providerCompletedAt?: string;
  userConfirmedAt?: string;
  // Rating
  userRating?: number;
  userReview?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Notification types
export type NotificationType = 
  | "booking_accepted"
  | "provider_on_way"
  | "job_completed"
  | "rating_reminder"
  | "booking_cancelled"
  | "provider_late"
  | "payment_received";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  bookingId?: string;
  read: boolean;
  createdAt: string;
}

// Review structure
export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// Provider earnings summary
export interface ProviderEarnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalEarnings: number;
  pendingPayments: number;
  completedJobs: number;
}

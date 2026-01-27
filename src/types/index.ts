// GrowIndia Type Definitions

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  image?: string;
}

export interface ServiceProblem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  estimatedTime: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  experience: string;
  verified: boolean;
  specializations: string[];
  fixedPrice: number; // Fixed price set by provider
  location: string;
  latitude: number;
  longitude: number;
  completedJobs: number;
}

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  provider?: ServiceProvider;
  categoryId: string;
  problemId: string;
  problem?: ServiceProblem;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  notes?: string;
  totalPrice: number;
  advanceAmount: number; // 37% of total
  remainingAmount: number; // 63% of total
  latePenalty: number; // ₹5 per 10 mins late
  providerCompletedAt?: string;
  userConfirmedAt?: string;
  userRating?: number;
  userReview?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'provider_completed' // Provider marked work as done
  | 'completed' // User confirmed and paid
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: UserAddress[];
  createdAt: string;
}

export interface UserAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface Location {
  city: string;
  area: string;
  pincode: string;
}

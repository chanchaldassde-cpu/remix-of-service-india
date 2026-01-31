import { Booking, Notification, Review } from "@/types/services";

// ============================================
// MOCK BOOKINGS
// ============================================

export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    providerId: "provider-1",
    categoryId: "electrical",
    mainCategory: "skilled",
    selectedProblemIds: ["fan-not-working", "switch-socket"],
    itemPrices: {
      "fan-not-working": 349,
      "switch-socket": 249,
    },
    scheduledDate: "2024-01-28",
    scheduledTime: "10:00 AM",
    address: "123, 4th Cross, Koramangala, Bangalore - 560034",
    notes: "Two ceiling fans in bedroom not working",
    totalPrice: 598,
    advanceAmount: 221,
    remainingAmount: 377,
    status: "accepted",
    createdAt: "2024-01-25T10:30:00Z",
    updatedAt: "2024-01-25T11:00:00Z",
  },
  {
    id: "booking-2",
    userId: "user-1",
    providerId: "provider-3",
    categoryId: "appliance",
    mainCategory: "skilled",
    selectedProblemIds: ["ac-service"],
    itemPrices: {
      "ac-service": 699,
    },
    scheduledDate: "2024-01-20",
    scheduledTime: "02:00 PM",
    address: "123, 4th Cross, Koramangala, Bangalore - 560034",
    totalPrice: 699,
    advanceAmount: 259,
    remainingAmount: 440,
    status: "completed",
    providerCompletedAt: "2024-01-20T16:00:00Z",
    userConfirmedAt: "2024-01-20T16:30:00Z",
    userRating: 5,
    userReview: "Excellent service! Very professional.",
    createdAt: "2024-01-18T14:00:00Z",
    updatedAt: "2024-01-20T16:30:00Z",
  },
  {
    id: "booking-3",
    userId: "user-1",
    providerId: "provider-6",
    categoryId: "cleaning",
    mainCategory: "domestic",
    hiringType: "task",
    selectedProblemIds: ["deep-cleaning", "kitchen-cleaning"],
    itemPrices: {
      "deep-cleaning": 1699,
      "kitchen-cleaning": 549,
    },
    scheduledDate: "2024-01-29",
    scheduledTime: "09:00 AM",
    address: "456, 2nd Main, HSR Layout, Bangalore - 560102",
    totalPrice: 2248,
    advanceAmount: 832,
    remainingAmount: 1416,
    status: "pending",
    createdAt: "2024-01-27T09:00:00Z",
    updatedAt: "2024-01-27T09:00:00Z",
  },
  {
    id: "booking-4",
    userId: "user-1",
    providerId: "provider-9",
    categoryId: "driver",
    mainCategory: "staff",
    hiringType: "monthly",
    isTrialPeriod: true,
    trialEndDate: "2024-02-05",
    selectedProblemIds: ["office-commute", "daily-errands"],
    itemPrices: {
      "office-commute": 349,
      "daily-errands": 449,
    },
    scheduledDate: "2024-01-29",
    scheduledTime: "08:00 AM",
    address: "789, 5th Block, Jayanagar, Bangalore - 560041",
    totalPrice: 18000,
    advanceAmount: 6660,
    remainingAmount: 11340,
    status: "in_progress",
    createdAt: "2024-01-29T08:00:00Z",
    updatedAt: "2024-01-29T08:00:00Z",
  },
  {
    id: "booking-5",
    userId: "user-1",
    providerId: "provider-2",
    categoryId: "plumbing",
    mainCategory: "skilled",
    selectedProblemIds: ["tap-leak", "drain-cleaning"],
    itemPrices: {
      "tap-leak": 249,
      "drain-cleaning": 349,
    },
    scheduledDate: "2024-01-22",
    scheduledTime: "11:00 AM",
    address: "123, 4th Cross, Koramangala, Bangalore - 560034",
    totalPrice: 598,
    advanceAmount: 221,
    remainingAmount: 377,
    status: "provider_completed",
    providerCompletedAt: "2024-01-22T13:00:00Z",
    createdAt: "2024-01-21T15:00:00Z",
    updatedAt: "2024-01-22T13:00:00Z",
  },
];

// ============================================
// MOCK NOTIFICATIONS
// ============================================

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    type: "booking_accepted",
    title: "Booking Accepted",
    message: "Rajesh Kumar has accepted your electrical service booking for Jan 28 at 10:00 AM",
    bookingId: "booking-1",
    read: false,
    createdAt: "2024-01-25T11:00:00Z",
  },
  {
    id: "notif-2",
    userId: "user-1",
    type: "provider_on_way",
    title: "Provider On The Way",
    message: "Ramesh Driver is on the way to your location. ETA: 15 mins",
    bookingId: "booking-4",
    read: false,
    createdAt: "2024-01-29T07:45:00Z",
  },
  {
    id: "notif-3",
    userId: "user-1",
    type: "job_completed",
    title: "Service Completed",
    message: "Suresh Sharma has marked your plumbing service as complete. Please confirm and rate.",
    bookingId: "booking-5",
    read: false,
    createdAt: "2024-01-22T13:00:00Z",
  },
  {
    id: "notif-4",
    userId: "user-1",
    type: "rating_reminder",
    title: "Rate Your Experience",
    message: "How was your AC service with Mohammad Iqbal? Leave a rating to help others.",
    bookingId: "booking-2",
    read: true,
    createdAt: "2024-01-20T17:00:00Z",
  },
  {
    id: "notif-5",
    userId: "user-1",
    type: "provider_late",
    title: "Provider Running Late",
    message: "Your service provider is running 10 minutes late. ₹5 penalty will be applied.",
    bookingId: "booking-1",
    read: true,
    createdAt: "2024-01-27T10:10:00Z",
  },
];

// ============================================
// MOCK REVIEWS
// ============================================

export const mockReviews: Review[] = [
  {
    id: "review-1",
    bookingId: "booking-2",
    userId: "user-1",
    providerId: "provider-3",
    rating: 5,
    comment: "Excellent service! Very professional and thorough. AC works perfectly now.",
    createdAt: "2024-01-20T16:30:00Z",
  },
  {
    id: "review-2",
    bookingId: "booking-old-1",
    userId: "user-2",
    providerId: "provider-1",
    rating: 4,
    comment: "Good work, fixed the fan quickly. Slightly late but overall satisfied.",
    createdAt: "2024-01-15T14:00:00Z",
  },
  {
    id: "review-3",
    bookingId: "booking-old-2",
    userId: "user-3",
    providerId: "provider-6",
    rating: 5,
    comment: "Best cleaning service! House looks spotless. Will hire again.",
    createdAt: "2024-01-18T11:00:00Z",
  },
];

// Helper functions
export const getBookingById = (id: string) => 
  mockBookings.find(b => b.id === id);

export const getBookingsByStatus = (status: string) =>
  mockBookings.filter(b => b.status === status);

export const getUnreadNotifications = () =>
  mockNotifications.filter(n => !n.read);

export const getReviewsByProvider = (providerId: string) =>
  mockReviews.filter(r => r.providerId === providerId);

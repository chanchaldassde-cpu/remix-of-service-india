import { ServiceCategory, ServiceProblem, ServiceProvider, SELECTION_LIMITS } from "@/types/services";

// Re-export for convenience
export { SELECTION_LIMITS };

// ============================================
// MAIN CATEGORIES
// ============================================

export const mainCategoryInfo = {
  skilled: {
    name: "Skilled Services",
    description: "Electrical, Plumbing, Repairs & more",
    icon: "Wrench",
    color: "primary",
  },
  domestic: {
    name: "Domestic Help",
    description: "Cleaning, Cooking, Childcare",
    icon: "Home",
    color: "success",
  },
  staff: {
    name: "Staff & Helpers",
    description: "Driver, Guard, Waiter & more",
    icon: "Users",
    color: "secondary",
  },
};

// ============================================
// SERVICE CATEGORIES
// ============================================

export const serviceCategories: ServiceCategory[] = [
  // Skilled Services
  {
    id: "electrical",
    name: "Electrical",
    icon: "Zap",
    description: "Wiring, switches, fans & more",
    mainCategory: "skilled",
  },
  {
    id: "plumbing",
    name: "Plumbing",
    icon: "Droplets",
    description: "Leaks, pipes, taps & fixtures",
    mainCategory: "skilled",
  },
  {
    id: "appliance",
    name: "Appliance Repair",
    icon: "Tv",
    description: "AC, fridge, washing machine",
    mainCategory: "skilled",
  },
  {
    id: "carpentry",
    name: "Carpentry",
    icon: "Hammer",
    description: "Furniture, doors, cabinets",
    mainCategory: "skilled",
  },
  {
    id: "painting",
    name: "Painting",
    icon: "Paintbrush",
    description: "Walls, doors, touch-ups",
    mainCategory: "skilled",
  },
  // Domestic Help
  {
    id: "cleaning",
    name: "House Cleaning",
    icon: "Sparkles",
    description: "Deep cleaning, daily cleaning",
    mainCategory: "domestic",
  },
  {
    id: "cooking",
    name: "Cook",
    icon: "ChefHat",
    description: "Meal preparation, catering",
    mainCategory: "domestic",
  },
  {
    id: "babysitter",
    name: "Babysitter",
    icon: "Baby",
    description: "Childcare, nanny services",
    mainCategory: "domestic",
  },
  {
    id: "eldercare",
    name: "Elder Care",
    icon: "HeartPulse",
    description: "Senior companion, assistance",
    mainCategory: "domestic",
  },
  // Staff & Helpers
  {
    id: "driver",
    name: "Driver",
    icon: "Car",
    description: "Personal, office, outstation",
    mainCategory: "staff",
  },
  {
    id: "guard",
    name: "Security Guard",
    icon: "Shield",
    description: "Day/Night security, watchman",
    mainCategory: "staff",
  },
  {
    id: "waiter",
    name: "Waiter/Server",
    icon: "UtensilsCrossed",
    description: "Event service, catering help",
    mainCategory: "staff",
  },
  {
    id: "shop-helper",
    name: "Shop Helper",
    icon: "Store",
    description: "Shop assistance, inventory",
    mainCategory: "staff",
  },
  {
    id: "office-boy",
    name: "Office Boy",
    icon: "Briefcase",
    description: "Office errands, assistance",
    mainCategory: "staff",
  },
];

// ============================================
// SERVICE PROBLEMS / TASKS
// ============================================

export const serviceProblems: ServiceProblem[] = [
  // Electrical Problems
  {
    id: "fan-not-working",
    categoryId: "electrical",
    name: "Fan not working",
    description: "Ceiling or table fan repair",
    estimatedTime: "30-60 mins",
    basePrice: 299,
  },
  {
    id: "switch-socket",
    categoryId: "electrical",
    name: "Switch/Socket issue",
    description: "Repair or replace switches & sockets",
    estimatedTime: "20-45 mins",
    basePrice: 199,
  },
  {
    id: "wiring-issue",
    categoryId: "electrical",
    name: "Wiring problem",
    description: "Short circuit, loose wiring",
    estimatedTime: "45-90 mins",
    basePrice: 449,
  },
  {
    id: "light-installation",
    categoryId: "electrical",
    name: "Light installation",
    description: "Install new lights or fixtures",
    estimatedTime: "30-60 mins",
    basePrice: 349,
  },
  {
    id: "mcb-issue",
    categoryId: "electrical",
    name: "MCB/Fuse problem",
    description: "MCB tripping, fuse replacement",
    estimatedTime: "30-45 mins",
    basePrice: 249,
  },

  // Plumbing Problems
  {
    id: "tap-leak",
    categoryId: "plumbing",
    name: "Tap leaking",
    description: "Fix dripping or leaking taps",
    estimatedTime: "20-40 mins",
    basePrice: 199,
  },
  {
    id: "pipe-leak",
    categoryId: "plumbing",
    name: "Pipe leakage",
    description: "Repair or replace leaking pipes",
    estimatedTime: "45-90 mins",
    basePrice: 399,
  },
  {
    id: "toilet-issue",
    categoryId: "plumbing",
    name: "Toilet repair",
    description: "Flush, seat, blockage issues",
    estimatedTime: "30-60 mins",
    basePrice: 349,
  },
  {
    id: "drain-cleaning",
    categoryId: "plumbing",
    name: "Drain cleaning",
    description: "Blocked drain or slow drainage",
    estimatedTime: "30-60 mins",
    basePrice: 299,
  },
  {
    id: "water-tank",
    categoryId: "plumbing",
    name: "Water tank issue",
    description: "Tank cleaning, overflow valve",
    estimatedTime: "60-90 mins",
    basePrice: 499,
  },

  // Appliance Problems
  {
    id: "ac-service",
    categoryId: "appliance",
    name: "AC service",
    description: "Cleaning, gas refill, repair",
    estimatedTime: "60-120 mins",
    basePrice: 599,
  },
  {
    id: "fridge-repair",
    categoryId: "appliance",
    name: "Fridge not cooling",
    description: "Cooling issues, gas, compressor",
    estimatedTime: "60-120 mins",
    basePrice: 699,
  },
  {
    id: "washing-machine",
    categoryId: "appliance",
    name: "Washing machine",
    description: "Not spinning, draining, or starting",
    estimatedTime: "45-90 mins",
    basePrice: 549,
  },
  {
    id: "geyser-repair",
    categoryId: "appliance",
    name: "Geyser repair",
    description: "Not heating, leaking",
    estimatedTime: "30-60 mins",
    basePrice: 399,
  },

  // Carpentry Problems
  {
    id: "furniture-repair",
    categoryId: "carpentry",
    name: "Furniture repair",
    description: "Fix broken furniture, hinges",
    estimatedTime: "30-90 mins",
    basePrice: 399,
  },
  {
    id: "door-repair",
    categoryId: "carpentry",
    name: "Door repair",
    description: "Door hinges, locks, alignment",
    estimatedTime: "30-60 mins",
    basePrice: 349,
  },
  {
    id: "cabinet-install",
    categoryId: "carpentry",
    name: "Cabinet installation",
    description: "Install or fix cabinets",
    estimatedTime: "60-120 mins",
    basePrice: 599,
  },

  // Painting Problems
  {
    id: "wall-touch-up",
    categoryId: "painting",
    name: "Wall touch-up",
    description: "Small area paint touch-up",
    estimatedTime: "60-90 mins",
    basePrice: 499,
  },
  {
    id: "room-painting",
    categoryId: "painting",
    name: "Room painting",
    description: "Full room paint service",
    estimatedTime: "4-8 hours",
    basePrice: 2999,
  },

  // Cleaning Tasks
  {
    id: "deep-cleaning",
    categoryId: "cleaning",
    name: "Deep cleaning",
    description: "Thorough house cleaning",
    estimatedTime: "3-5 hours",
    basePrice: 1499,
  },
  {
    id: "bathroom-cleaning",
    categoryId: "cleaning",
    name: "Bathroom cleaning",
    description: "Bathroom deep clean",
    estimatedTime: "45-60 mins",
    basePrice: 399,
  },
  {
    id: "kitchen-cleaning",
    categoryId: "cleaning",
    name: "Kitchen cleaning",
    description: "Kitchen and appliances clean",
    estimatedTime: "60-90 mins",
    basePrice: 499,
  },
  {
    id: "regular-cleaning",
    categoryId: "cleaning",
    name: "Regular cleaning",
    description: "Daily/weekly house upkeep",
    estimatedTime: "2-3 hours",
    basePrice: 599,
  },
  {
    id: "dish-washing",
    categoryId: "cleaning",
    name: "Dish washing",
    description: "Daily utensils cleaning",
    estimatedTime: "30-45 mins",
    basePrice: 149,
  },

  // Cooking Tasks
  {
    id: "meal-prep",
    categoryId: "cooking",
    name: "Meal preparation",
    description: "Daily meal cooking",
    estimatedTime: "1-2 hours",
    basePrice: 399,
  },
  {
    id: "party-cooking",
    categoryId: "cooking",
    name: "Party/Event cooking",
    description: "Large meal preparation",
    estimatedTime: "3-6 hours",
    basePrice: 1499,
  },
  {
    id: "tiffin-service",
    categoryId: "cooking",
    name: "Tiffin service",
    description: "Lunch box preparation",
    estimatedTime: "1 hour",
    basePrice: 299,
  },

  // Babysitter Tasks
  {
    id: "baby-care",
    categoryId: "babysitter",
    name: "Baby care",
    description: "Infant care and feeding",
    estimatedTime: "Flexible",
    basePrice: 499,
  },
  {
    id: "child-supervision",
    categoryId: "babysitter",
    name: "Child supervision",
    description: "Watch kids, help with homework",
    estimatedTime: "Flexible",
    basePrice: 399,
  },
  {
    id: "night-nanny",
    categoryId: "babysitter",
    name: "Night nanny",
    description: "Overnight child care",
    estimatedTime: "8-12 hours",
    basePrice: 999,
  },

  // Elder Care Tasks
  {
    id: "companion-care",
    categoryId: "eldercare",
    name: "Companion care",
    description: "Company and conversation",
    estimatedTime: "Flexible",
    basePrice: 399,
  },
  {
    id: "medical-assistance",
    categoryId: "eldercare",
    name: "Medical assistance",
    description: "Medicine reminders, appointments",
    estimatedTime: "Flexible",
    basePrice: 499,
  },
  {
    id: "mobility-help",
    categoryId: "eldercare",
    name: "Mobility help",
    description: "Walking, moving assistance",
    estimatedTime: "Flexible",
    basePrice: 449,
  },

  // Driver Tasks
  {
    id: "office-commute",
    categoryId: "driver",
    name: "Office commute",
    description: "Daily office pick-up/drop",
    estimatedTime: "1-2 hours",
    basePrice: 299,
  },
  {
    id: "outstation-trip",
    categoryId: "driver",
    name: "Outstation trip",
    description: "Long distance driving",
    estimatedTime: "Full day",
    basePrice: 1999,
  },
  {
    id: "daily-errands",
    categoryId: "driver",
    name: "Daily errands",
    description: "Shopping, appointments, school",
    estimatedTime: "Flexible",
    basePrice: 399,
  },
  {
    id: "airport-transfer",
    categoryId: "driver",
    name: "Airport transfer",
    description: "Airport pick-up/drop",
    estimatedTime: "2-3 hours",
    basePrice: 699,
  },

  // Security Guard Tasks
  {
    id: "day-security",
    categoryId: "guard",
    name: "Day security",
    description: "Daytime watchman duty",
    estimatedTime: "8-12 hours",
    basePrice: 599,
  },
  {
    id: "night-security",
    categoryId: "guard",
    name: "Night security",
    description: "Overnight security duty",
    estimatedTime: "8-12 hours",
    basePrice: 699,
  },
  {
    id: "event-security",
    categoryId: "guard",
    name: "Event security",
    description: "Security for events/parties",
    estimatedTime: "4-8 hours",
    basePrice: 799,
  },

  // Waiter Tasks
  {
    id: "party-service",
    categoryId: "waiter",
    name: "Party service",
    description: "Serve guests at parties",
    estimatedTime: "4-8 hours",
    basePrice: 599,
  },
  {
    id: "event-catering",
    categoryId: "waiter",
    name: "Event catering",
    description: "Full event service",
    estimatedTime: "6-10 hours",
    basePrice: 899,
  },
  {
    id: "home-service",
    categoryId: "waiter",
    name: "Home service",
    description: "Serve meals at home",
    estimatedTime: "2-4 hours",
    basePrice: 399,
  },

  // Shop Helper Tasks
  {
    id: "shop-assistance",
    categoryId: "shop-helper",
    name: "Shop assistance",
    description: "Customer service, billing",
    estimatedTime: "Full day",
    basePrice: 499,
  },
  {
    id: "inventory-help",
    categoryId: "shop-helper",
    name: "Inventory management",
    description: "Stock counting, arrangement",
    estimatedTime: "4-8 hours",
    basePrice: 399,
  },
  {
    id: "delivery-help",
    categoryId: "shop-helper",
    name: "Delivery assistance",
    description: "Local deliveries",
    estimatedTime: "Flexible",
    basePrice: 299,
  },

  // Office Boy Tasks
  {
    id: "office-errands",
    categoryId: "office-boy",
    name: "Office errands",
    description: "Document delivery, tasks",
    estimatedTime: "Full day",
    basePrice: 399,
  },
  {
    id: "pantry-service",
    categoryId: "office-boy",
    name: "Pantry service",
    description: "Tea, coffee, snacks service",
    estimatedTime: "Full day",
    basePrice: 349,
  },
  {
    id: "office-maintenance",
    categoryId: "office-boy",
    name: "Office maintenance",
    description: "Basic cleaning, setup",
    estimatedTime: "Full day",
    basePrice: 399,
  },
];

// ============================================
// SERVICE PROVIDERS
// ============================================

export const serviceProviders: ServiceProvider[] = [
  // Skilled Service Providers
  {
    id: "provider-1",
    name: "Rajesh Kumar",
    rating: 4.8,
    reviewCount: 234,
    experience: "8 years",
    verified: true,
    specializations: ["Electrical", "Wiring"],
    categoryIds: ["electrical"],
    location: "Koramangala, Bangalore",
    latitude: 12.9352,
    longitude: 77.6245,
    completedJobs: 512,
    taskPrices: {
      "fan-not-working": 349,
      "switch-socket": 249,
      "wiring-issue": 499,
      "light-installation": 399,
      "mcb-issue": 299,
    },
  },
  {
    id: "provider-2",
    name: "Suresh Sharma",
    rating: 4.6,
    reviewCount: 189,
    experience: "5 years",
    verified: true,
    specializations: ["Plumbing", "Sanitary"],
    categoryIds: ["plumbing"],
    location: "HSR Layout, Bangalore",
    latitude: 12.9116,
    longitude: 77.6389,
    completedJobs: 328,
    taskPrices: {
      "tap-leak": 249,
      "pipe-leak": 449,
      "toilet-issue": 399,
      "drain-cleaning": 349,
      "water-tank": 549,
    },
  },
  {
    id: "provider-3",
    name: "Mohammad Iqbal",
    rating: 4.9,
    reviewCount: 312,
    experience: "12 years",
    verified: true,
    specializations: ["AC Repair", "Appliances"],
    categoryIds: ["appliance"],
    location: "Indiranagar, Bangalore",
    latitude: 12.9784,
    longitude: 77.6408,
    completedJobs: 756,
    taskPrices: {
      "ac-service": 699,
      "fridge-repair": 799,
      "washing-machine": 649,
      "geyser-repair": 449,
    },
  },
  {
    id: "provider-4",
    name: "Venkat Reddy",
    rating: 4.7,
    reviewCount: 156,
    experience: "6 years",
    verified: true,
    specializations: ["Electrical", "Fans"],
    categoryIds: ["electrical"],
    location: "Whitefield, Bangalore",
    latitude: 12.9698,
    longitude: 77.7500,
    completedJobs: 289,
    taskPrices: {
      "fan-not-working": 299,
      "switch-socket": 199,
      "wiring-issue": 449,
      "light-installation": 349,
      "mcb-issue": 249,
    },
  },
  {
    id: "provider-5",
    name: "Ganesh Nair",
    rating: 4.5,
    reviewCount: 98,
    experience: "4 years",
    verified: true,
    specializations: ["Carpentry", "Furniture"],
    categoryIds: ["carpentry"],
    location: "JP Nagar, Bangalore",
    latitude: 12.9063,
    longitude: 77.5857,
    completedJobs: 167,
    taskPrices: {
      "furniture-repair": 449,
      "door-repair": 399,
      "cabinet-install": 649,
    },
  },
  // Domestic Help Providers
  {
    id: "provider-6",
    name: "Lakshmi Devi",
    rating: 4.9,
    reviewCount: 287,
    experience: "10 years",
    verified: true,
    specializations: ["Cleaning", "Cooking"],
    categoryIds: ["cleaning", "cooking"],
    location: "BTM Layout, Bangalore",
    latitude: 12.9166,
    longitude: 77.6101,
    completedJobs: 823,
    taskPrices: {
      "deep-cleaning": 1699,
      "bathroom-cleaning": 449,
      "kitchen-cleaning": 549,
      "regular-cleaning": 649,
      "dish-washing": 179,
      "meal-prep": 449,
      "tiffin-service": 349,
    },
    dailyRate: 600,
    monthlyRate: 12000,
  },
  {
    id: "provider-7",
    name: "Sunita Patil",
    rating: 4.7,
    reviewCount: 143,
    experience: "7 years",
    verified: true,
    specializations: ["Babysitting", "Childcare"],
    categoryIds: ["babysitter"],
    location: "Marathahalli, Bangalore",
    latitude: 12.9591,
    longitude: 77.6974,
    completedJobs: 234,
    taskPrices: {
      "baby-care": 549,
      "child-supervision": 449,
      "night-nanny": 1099,
    },
    dailyRate: 700,
    monthlyRate: 15000,
  },
  {
    id: "provider-8",
    name: "Kavitha R.",
    rating: 4.8,
    reviewCount: 178,
    experience: "8 years",
    verified: true,
    specializations: ["Elder Care", "Companion"],
    categoryIds: ["eldercare"],
    location: "Jayanagar, Bangalore",
    latitude: 12.9308,
    longitude: 77.5838,
    completedJobs: 312,
    taskPrices: {
      "companion-care": 449,
      "medical-assistance": 549,
      "mobility-help": 499,
    },
    dailyRate: 650,
    monthlyRate: 14000,
  },
  // Staff & Helper Providers
  {
    id: "provider-9",
    name: "Ramesh Driver",
    rating: 4.8,
    reviewCount: 256,
    experience: "15 years",
    verified: true,
    specializations: ["Personal Driver", "Outstation"],
    categoryIds: ["driver"],
    location: "Electronic City, Bangalore",
    latitude: 12.8456,
    longitude: 77.6603,
    completedJobs: 1234,
    taskPrices: {
      "office-commute": 349,
      "outstation-trip": 2199,
      "daily-errands": 449,
      "airport-transfer": 749,
    },
    dailyRate: 800,
    monthlyRate: 18000,
  },
  {
    id: "provider-10",
    name: "Mohan Singh",
    rating: 4.6,
    reviewCount: 89,
    experience: "10 years",
    verified: true,
    specializations: ["Security", "Night Watch"],
    categoryIds: ["guard"],
    location: "Yelahanka, Bangalore",
    latitude: 13.1007,
    longitude: 77.5963,
    completedJobs: 156,
    taskPrices: {
      "day-security": 649,
      "night-security": 749,
      "event-security": 849,
    },
    dailyRate: 700,
    monthlyRate: 15000,
  },
  {
    id: "provider-11",
    name: "Prakash Kumar",
    rating: 4.5,
    reviewCount: 67,
    experience: "5 years",
    verified: true,
    specializations: ["Waiter", "Catering"],
    categoryIds: ["waiter"],
    location: "Hebbal, Bangalore",
    latitude: 13.0358,
    longitude: 77.5970,
    completedJobs: 189,
    taskPrices: {
      "party-service": 649,
      "event-catering": 949,
      "home-service": 449,
    },
    dailyRate: 600,
    monthlyRate: 12000,
  },
  {
    id: "provider-12",
    name: "Anil Kumar",
    rating: 4.4,
    reviewCount: 45,
    experience: "3 years",
    verified: true,
    specializations: ["Shop Helper", "Inventory"],
    categoryIds: ["shop-helper"],
    location: "Banashankari, Bangalore",
    latitude: 12.9255,
    longitude: 77.5468,
    completedJobs: 98,
    taskPrices: {
      "shop-assistance": 549,
      "inventory-help": 449,
      "delivery-help": 349,
    },
    dailyRate: 500,
    monthlyRate: 10000,
  },
  {
    id: "provider-13",
    name: "Vijay Kumar",
    rating: 4.6,
    reviewCount: 78,
    experience: "4 years",
    verified: true,
    specializations: ["Office Boy", "Errands"],
    categoryIds: ["office-boy"],
    location: "MG Road, Bangalore",
    latitude: 12.9757,
    longitude: 77.6064,
    completedJobs: 234,
    taskPrices: {
      "office-errands": 449,
      "pantry-service": 399,
      "office-maintenance": 449,
    },
    dailyRate: 450,
    monthlyRate: 9000,
  },
];

// Helper functions
export const getCategoryById = (id: string) => 
  serviceCategories.find(c => c.id === id);

export const getCategoriesByMain = (mainCategory: string) => 
  serviceCategories.filter(c => c.mainCategory === mainCategory);

export const getProblemsByCategory = (categoryId: string) => 
  serviceProblems.filter(p => p.categoryId === categoryId);

export const getProvidersByCategory = (categoryId: string) => 
  serviceProviders.filter(p => p.categoryIds.includes(categoryId));

export const getProviderPrice = (provider: ServiceProvider, problemId: string) => 
  provider.taskPrices[problemId] || 0;

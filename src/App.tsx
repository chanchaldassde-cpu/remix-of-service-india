import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Main Pages
import Index from "./pages/Index";
import CategorySelection from "./pages/CategorySelection";
import BookServiceFlow from "./pages/BookServiceFlow";
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import AuthVerify from "./pages/AuthVerify";
import NotFound from "./pages/NotFound";

// Job-Based Services (Staff Hirings) - keeping for staff management
import JobHirings from "./pages/JobHirings";
import JobHiringAttendance from "./pages/JobHiringAttendance";

// Provider Pages
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderEarnings from "./pages/provider/ProviderEarnings";
import ProviderProfile from "./pages/provider/ProviderProfile";
import ProviderAvailability from "./pages/provider/ProviderAvailability";
import ProviderServices from "./pages/provider/ProviderServices";
import ProviderNotifications from "./pages/provider/ProviderNotifications";
import ProviderSettings from "./pages/provider/ProviderSettings";
import ProviderJobHirings from "./pages/provider/ProviderJobHirings";
import ProviderJobAttendance from "./pages/provider/ProviderJobAttendance";
import ProviderJobProfile from "./pages/provider/ProviderJobProfile";
import ProviderJobEarnings from "./pages/provider/ProviderJobEarnings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/verify" element={<AuthVerify />} />
            
            {/* Customer Routes */}
            <Route path="/" element={<Index />} />
            
            {/* New Category-based booking flow */}
            <Route path="/category/:mainCategory" element={<CategorySelection />} />
            <Route path="/book-service" element={<BookServiceFlow />} />
            
            {/* Bookings */}
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/booking/:bookingId" element={<BookingDetails />} />
            
            {/* Staff Hirings (Monthly/Daily workers) */}
            <Route path="/job-hirings" element={<JobHirings />} />
            <Route path="/job-hirings/:hiringId/attendance" element={<JobHiringAttendance />} />
            
            {/* Profile & Notifications */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            
            {/* Provider Routes */}
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/provider/bookings" element={<ProviderBookings />} />
            <Route path="/provider/earnings" element={<ProviderEarnings />} />
            <Route path="/provider/profile" element={<ProviderProfile />} />
            <Route path="/provider/availability" element={<ProviderAvailability />} />
            <Route path="/provider/services" element={<ProviderServices />} />
            <Route path="/provider/notifications" element={<ProviderNotifications />} />
            <Route path="/provider/settings" element={<ProviderSettings />} />
            
            {/* Provider Job-Based Services Routes */}
            <Route path="/provider/jobs" element={<ProviderJobHirings />} />
            <Route path="/provider/jobs/:hiringId/attendance" element={<ProviderJobAttendance />} />
            <Route path="/provider/jobs/profile" element={<ProviderJobProfile />} />
            <Route path="/provider/jobs/earnings" element={<ProviderJobEarnings />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

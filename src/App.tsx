import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceCategory from "./pages/ServiceCategory";
import BookService from "./pages/BookService";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AuthVerify from "./pages/AuthVerify";

// Provider Pages
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderEarnings from "./pages/provider/ProviderEarnings";
import ProviderProfile from "./pages/provider/ProviderProfile";
import ProviderAvailability from "./pages/provider/ProviderAvailability";
import ProviderServices from "./pages/provider/ProviderServices";
import ProviderNotifications from "./pages/provider/ProviderNotifications";
import ProviderSettings from "./pages/provider/ProviderSettings";

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
            <Route path="/services" element={<Services />} />
            <Route path="/services/:categoryId" element={<ServiceCategory />} />
            <Route path="/book/:categoryId/:problemId" element={<BookService />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:bookingId" element={<Bookings />} />
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
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

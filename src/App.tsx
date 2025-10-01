import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ServiceProvider } from "./contexts/ServiceContext";
import { AdminProvider } from "./contexts/AdminContext";
import ProtectedRoute from "./components/ProtectedRoute";
import FirebaseSetup from "./components/FirebaseSetup";
import MobileNav from "./components/MobileNav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import ServiceRequest from "./pages/ServiceRequest";
import Status from "./pages/Status";

const queryClient = new QueryClient();

const App = () => {
  // Check if Firebase is configured
  const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
    import.meta.env.VITE_FIREBASE_API_KEY !== 'your_api_key_here';

  if (!isFirebaseConfigured) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <FirebaseSetup />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ServiceProvider>
          <AdminProvider>
            <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/request" element={<ServiceRequest />} />
              <Route path="/status" element={<Status />} />
              
              {/* Protected customer routes */}
              <Route 
                path="/customer/dashboard" 
                element={
                  <ProtectedRoute>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected admin routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect root to appropriate dashboard */}
              <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileNav />
          </BrowserRouter>
            </TooltipProvider>
          </AdminProvider>
        </ServiceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

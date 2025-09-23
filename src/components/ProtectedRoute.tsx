import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  // If user is admin but trying to access customer routes
  if (isAdmin && location.pathname.startsWith('/customer')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If user is customer but trying to access admin routes
  if (!isAdmin && location.pathname.startsWith('/admin')) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;





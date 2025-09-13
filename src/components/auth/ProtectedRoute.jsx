import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import Loader from '@/assets/Loader.svg';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src={Loader} alt="Loading..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
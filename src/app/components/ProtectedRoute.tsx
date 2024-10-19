// src/app/components/ProtectedRoute.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth'; // Ensure this path is correct
import { Routes } from '../route/routes';
import PulsingLoader from './PulsingLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string; // Optional prop for custom redirect path
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectPath = Routes.DASHBOARD }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectPath); // Redirect if not authenticated
    }
  }, [isAuthenticated, loading, redirectPath]); // Remove router from dependencies

  // Show the loader while loading
  if (loading) {
    return <PulsingLoader />;
  }

  // Render the children if authenticated
  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;

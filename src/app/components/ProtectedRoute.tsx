// src/app/components/ProtectedRoute.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;

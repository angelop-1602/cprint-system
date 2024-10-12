"use client"; // Client-side rendering required for hooks

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { auth } from '@/app/firebase/Config';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Check if user is not authenticated and not already on sign-in page
      if (!user && !pathname.includes('/pages/signin')) {
        router.push('/pages/signin');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router, pathname]);

  // Render the children if the user is authenticated, else nothing
  return <>{children}</>;
};

export default ProtectedRoute;

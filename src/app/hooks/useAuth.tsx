import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'; // Import usePathname
import { auth, provider } from '../firebase/Config';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
      
      // Only redirect if not loading
      if (!loading) {
        if (user) {
          // Check if the current route is not the dashboard or other protected route
          if (pathname === '/') { // Adjust the condition according to your routes
            router.push('/pages/dashboard'); // Redirect to dashboard if on home page
          }
        } else {
          router.push('/'); // Redirect to sign-in page if not authenticated
        }
      }
    });

    return () => unsubscribe();
  }, [router, loading, pathname]); // Add pathname to the dependency array

  const signInWithMicrosoft = async () => {
    setIsSigningIn(true);
    try {
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      console.log("Sign-in result:", result);
    } catch (error) {
      console.error("Error during sign-in:", error);
      setErrorMessage("Sign-in failed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return { isAuthenticated, loading, signInWithMicrosoft, errorMessage, setErrorMessage, isSigningIn };
};

export default useAuth;

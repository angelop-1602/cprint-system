import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { auth, provider } from '../firebase/Config';
import { Routes } from '../route/routes';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);

      // Redirect logic based on user authentication status
      if (!loading) {
        if (user && pathname === '/') {
          router.push(Routes.DASHBOARD);
        } else if (!user) {
          router.push(Routes.HOME);
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]); // Excluding loading from dependencies

  const signInWithMicrosoft = async () => {
    setIsSigningIn(true);
    try {
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      setErrorMessage("Sign-in failed. Please try again.");
      console.error("Sign-in error:", error); // Log the error for debugging
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth); // Properly sign out the user
      console.log('User signed out successfully.');
      setIsAuthenticated(false); // Update the authentication state
      router.push(Routes.HOME); // Optional: redirect after sign-out
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return {
    isAuthenticated,
    loading,
    signInWithMicrosoft,
    errorMessage,
    setErrorMessage,
    isSigningIn,
    signOut,
  };
};

export default useAuth;

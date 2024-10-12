// src/hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { signInWithPopup, OAuthProvider } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth, provider } from '../firebase/Config';

export const signInWithMicrosoft = async () => {
  try {
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
    console.log("Sign-in result:", result);

    // If you need to redirect after sign-in:
    // const user = result.user;
    // router.push('/pages/rec'); // or whatever path you want to redirect to
  } catch (error) {
    console.error("Error during sign-in:", error);
    // You can add a toast or notification to inform the user about the error
  }
};

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Uncomment the following line if you want to redirect on auth state change
        // router.push('/pages/rec');
      } else {
        setIsAuthenticated(false);
        // Optionally redirect users if they are not authenticated
        // router.push('/signin'); // or whatever your sign-in page is
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return { isAuthenticated, loading };
};

export default useAuth;

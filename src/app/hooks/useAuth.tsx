// src/hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; // Firebase auth state listener
import { signInWithPopup, OAuthProvider } from "firebase/auth";
import { useRouter } from 'next/navigation'; // Import useRouter
import { auth, provider } from '../firebase/Config';

export const signInWithMicrosoft = async () => {
  try {
    provider.setCustomParameters({
      prompt: "select_account", // Prompt for account selection
    });

    const result = await signInWithPopup(auth, provider);
    console.log("Sign-in result:", result);
    
    // No need to redirect here since useAuth will handle it

  } catch (error) {
    console.error("Error during sign-in:", error);
  }
};

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        router.push('/pages/rec'); // Redirect to dashboard on successful login
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); // Set loading to false once auth status is known
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [router]); // Include router in dependency array

  return { isAuthenticated, loading };
};

export default useAuth;

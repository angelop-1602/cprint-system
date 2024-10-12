"use client"; // Required for client-side rendering

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/Config";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to the dashboard
        router.push("/pages/dashboard"); // Adjust this route as needed
      } else {
        // User is not signed in
        setLoading(false); // Set loading to false if user is not authenticated
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  // Show loading message while checking authentication state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the home page content for unauthenticated users
  return (
    <div>
      <h1>Welcome to My Next.js App</h1>
      <p>Sign in to access the dashboard.</p>
    </div>
  );
}

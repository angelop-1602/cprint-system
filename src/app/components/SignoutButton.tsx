import React, { useState } from 'react';
import { auth } from "@/app/firebase/Config";
import { signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { Routes } from '../route/routes';
import { Button } from '@mui/material'; // Using Material-UI for styling
import PulsingLoader from './PulsingLoader';
import ReusableButton from './reusable/Button';


const SignOutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State for loading

  const handleSignOut = async () => {
    setLoading(true); // Set loading state
    try {
      await signOut(auth);
      console.log("User signed out");
      router.push(Routes.HOME);
    } catch (error) {
      console.error("Error signing out:", error);
      // Optional: Show an error message to the user
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <ReusableButton
      customVariant="primary" // Example styling
      onClick={handleSignOut}
      sx={{
        position: 'relative', // Position for CircularProgress
      }}
    >
      {loading ? (
        <>
          <PulsingLoader/>
        </>
      ) : (
        'Sign Out'
      )}
    </ReusableButton>
  );
};

export default SignOutButton;

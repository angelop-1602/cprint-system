// src/app/components/SignOutButton.tsx
"use client"; // Required for client-side rendering

import React from 'react';
import { auth } from "@/app/firebase/Config";
import { signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    console.log("User signed out");
    router.push('/pages/signin'); 
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;

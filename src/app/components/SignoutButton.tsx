import React from 'react';
import { auth } from "@/app/firebase/Config";
import { signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { Routes } from '../route/routes';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    console.log("User signed out");
    router.push(Routes.HOME); 
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;

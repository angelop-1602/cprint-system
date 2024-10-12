// src/pages/signin/page.tsx
'use client'; // Required for client-side rendering

import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { signInWithMicrosoft } from '@/app/hooks/useAuth';

const SignInPage = () => {
  const handleSignIn = async () => {
    try {
      await signInWithMicrosoft(); // Handle sign-in
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Sign-in failed. Please try again.'); // Alert user on error
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Please Sign In
      </Typography>
      <Button variant="contained" onClick={handleSignIn}>
        Sign in with Microsoft
      </Button>
    </Box>
  );
};

export default SignInPage;

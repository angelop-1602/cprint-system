'use client'; // Required for client-side rendering

import React from 'react';
import { Button, Box, Typography, Snackbar } from '@mui/material';
import useAuth from '@/app/hooks/useAuth';
import PulsingLoader from './components/PulsingLoader';

const Page = () => {
  const { signInWithMicrosoft, errorMessage, setErrorMessage, isSigningIn, loading } = useAuth();

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
      {loading ? ( // Show loading spinner if loading
        <PulsingLoader message="Loading..." />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Please Sign In
          </Typography>
          <Button 
            variant="contained" 
            onClick={signInWithMicrosoft} 
            disabled={isSigningIn} // Disable button if signing in
          >
            {isSigningIn ? 'Signing In...' : 'Sign in with Microsoft'}
          </Button>
          <Snackbar
            open={!!errorMessage}
            autoHideDuration={6000}
            onClose={() => setErrorMessage(null)} // Close handler
            message={errorMessage}
          />
        </>
      )}
    </Box>
  );
};

export default Page;

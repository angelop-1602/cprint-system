'use client'
import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material'; 
import { useRouter } from 'next/navigation';
import ReusableButton from '@/app/components/reusable/Button';
import { Routes } from '@/app/route/routes';
import RecSubmission from '@/app/components/rec/recSubmission';
import { useTheme } from '@mui/material/styles'; // Import useTheme

export default function RecHome() {
  const router = useRouter();
  const theme = useTheme(); // Use useTheme to get the theme object
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check for small screen

  const handleSubmitClick = () => {
    router.push(Routes.REC_FORM);
  };

  return (
    <Box sx={{ padding: isSmallScreen ? 2 : 4 }}> 
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <Typography 
          variant={isSmallScreen ? "h5" : "h4"} 
          component="h1" 
          sx={{ fontWeight: 'bold', textAlign: isSmallScreen ? 'center' : 'left', width: '100%' }}
        >
          Research Ethics Committee (REC)
        </Typography>
        <Box sx={{ marginTop: isSmallScreen ? 2 : 0 }}> 
          <ReusableButton 
            onClick={handleSubmitClick} 
            customVariant="primary" 
            fullWidth={isSmallScreen}
          >
            New Submission
          </ReusableButton>
        </Box>
      </Box>
      <RecSubmission />
    </Box>
  );
}

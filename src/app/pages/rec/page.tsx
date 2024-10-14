'use client'
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import ReusableButton from '@/app/components/reusable/Button';
import { Routes } from '@/app/route/routes';
import RecSubmission from '@/app/components/rec/rec_submission';

export default function RecHome() {
  const router = useRouter();

  const handleSubmitClick = () => {
    router.push(Routes.REC_FORM);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Research Ethics Committee (REC)
        </Typography>

        <ReusableButton onClick={handleSubmitClick} customVariant="primary">
          New Submission
        </ReusableButton>
      </Box>

      <RecSubmission maxHeight="400px" /> {/* Adjust maxHeight as necessary */}
    </Box>
  );
}

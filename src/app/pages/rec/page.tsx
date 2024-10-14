// RecHome.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Routes } from '@/app/route/routes';
import { auth, db } from '@/app/firebase/Config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import RecSubmission from '@/app/components/rec/rec_submission';
import ReusableButton from '@/app/components/reusable/Button'; // Import ReusableButton

interface Submission {
  id: string;
  title: string;
  status: string;
  date: string;
}

export default function RecHome() {
  const router = useRouter();
  const [tableData, setTableData] = useState<Submission[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated: ", user);
        fetchSubmission(user.uid);
      } else {
        console.log("User is not authenticated");
        setSnackbarMessage('User is not authenticated.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false); // Stop loading when user is not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSubmission = async (userId: string) => {
    console.log("Current User ID: ", userId);
    setLoading(true); // Set loading state
    try {
      const docRef = doc(db, 'research_submissions', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTableData([{
          id: docSnap.id,
          title: data.researchTitle || 'Unknown',
          status: data.status || 'Pending',
          date: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
        }]);
      } else {
        console.log("No submissions found for user:", userId);
        setTableData([]);
      }
    } catch (error) {
      console.error('Error fetching submission: ', error);
      setSnackbarMessage(`Failed to fetch submission: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // Stop loading state here
    }
  };

  const handleSubmitClick = () => {
    router.push(Routes.REC_FORM);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

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
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold' }}
        >
          Research Ethics Committee (REC)
        </Typography>

        <ReusableButton
          customVariant="primary" // This should apply primary styles
          onClick={handleSubmitClick}
        >
          New Submission
        </ReusableButton>
      </Box>

      {loading ? ( // Show loading state
        <CircularProgress />
      ) : (
        <RecSubmission tableData={tableData} />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

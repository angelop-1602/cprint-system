'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Routes } from '@/app/route/routes';
import { auth, db } from '@/app/firebase/Config'; 
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function RecHome() {
  const router = useRouter();
  const [tableData, setTableData] = useState<any[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated: ", user);
        fetchSubmission(user.uid); // Fetch submission with user UID
      } else {
        console.log("User is not authenticated");
        setSnackbarMessage('User is not authenticated.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSubmission = async (userId: string) => {
    console.log("Current User ID: ", userId);
    try {
      const docRef = doc(db, 'research_submissions', userId); // Fetch by user's UID
      const docSnap = await getDoc(docRef); // Get document snapshot

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
    }
  };

  const handleSubmitClick = () => {
    router.push(Routes.REC_FORM);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false); 

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Research Ethics Committee (REC)
        </Typography>
        <Button variant="contained" color="primary" sx={{ height: 40 }} onClick={handleSubmitClick}>
          Submit
        </Button>
      </Box>
      <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
        <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>
          Submission/s
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Research Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.length > 0 ? (
                tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">No submissions found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

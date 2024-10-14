// RecSubmission.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReusableTable from '../reusable/Table';
import { Routes } from '@/app/route/routes';
import PulsingLoader from '../Loader';
import { auth, db } from '@/app/firebase/Config';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Snackbar, Alert } from '@mui/material';
import { Visibility as VisibilityIcon, EditNote as EditNoteIcon } from '@mui/icons-material';

interface Submission {
  id: string;
  title: string;
  status: string;
  date: string;
}

const RecSubmission: React.FC = () => {
  const router = useRouter();
  const [tableData, setTableData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchSubmissions();
      } else {
        setSnackbarMessage('User is not authenticated.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const submissionsRef = collection(db, 'research_submissions');
      const querySnapshot = await getDocs(submissionsRef);

      const submissions: Submission[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        submissions.push({
          id: doc.id,
          title: data.researchTitle || 'Unknown',
          status: data.status || 'Pending',
          date: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
        });
      });

      setTableData(submissions);
    } catch (error) {
      const err = error as Error;
      setSnackbarMessage(`Failed to fetch submissions: ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const columns: { id: keyof Submission; label: string }[] = [
    { id: 'title', label: 'Research Title' },
    { id: 'status', label: 'Status' },
    { id: 'date', label: 'Date' },
  ];

  const actions: {
    label: string;
    onClick: (item: Submission) => void;
    customVariant?: 'primary' | 'secondary' | 'light' | 'dark'; // Ensure correct types
    icon?: React.ReactNode; // Optional icon
  }[] = [
    {
      label: 'Review',
      onClick: (item: Submission) => router.push(`${Routes.REC}/${item.id}`),
      customVariant: 'primary', // Valid variant
      icon: <VisibilityIcon />, // Optional icon
    },
    {
      label: 'Edit',
      onClick: (item: Submission) => router.push(`${Routes.REC_EDIT}?id=${item.id}`),
      customVariant: 'secondary', // Valid variant
      icon: <EditNoteIcon />, // Optional icon
    },
  ];
  

  if (loading) {
    return <PulsingLoader />;
  }

  return (
    <>
      <ReusableTable
        data={tableData}
        columns={columns}
        actions={actions}
        emptyMessage="No submissions found."
      />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RecSubmission;

// recSubmission.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReusableTable from '../reusable/Table';
import { Routes } from '@/app/route/routes';
import PulsingLoader from '../PulsingLoader';
import { auth, db } from '@/app/firebase/Config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Snackbar, Alert } from '@mui/material';
import { Visibility as VisibilityIcon, EditNote as EditNoteIcon } from '@mui/icons-material';

interface Submission {
  id: string;
  title: string;
  status: string;
  date: string;
}

// Define an interface for the Firestore document structure if needed
interface FirestoreSubmission {
  researchTitle: string;
  status: string;
  createdAt: { toDate: () => Date }; // Adjust based on actual Firestore structure
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
        fetchSubmissions(user.uid); // Pass the user ID to fetch only the user's submissions
      } else {
        setSnackbarMessage('User is not authenticated.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const fetchSubmissions = async (userId: string) => {
    setLoading(true);
    try {
      // Reference to the research_submissions collection with a query filtering by user ID
      const submissionsRef = collection(db, 'research_submissions');
      const q = query(submissionsRef, where('userId', '==', userId)); // Filter by userId
  
      const querySnapshot = await getDocs(q);
  
      const submissions: Submission[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as FirestoreSubmission;
        return {
          id: doc.id,
          title: data.researchTitle || 'Unknown',
          status: data.status || 'Pending',
          date: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
        };
      });
  
      setTableData(submissions);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('An unknown error occurred.');
      setSnackbarMessage(`Failed to fetch submissions: ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const columns: { id: keyof Submission; label: string; width?: number }[] = [
    { id: 'title', label: 'Research Title', width: 200 },
    { id: 'status', label: 'Status', width: 100 },
    { id: 'date', label: 'Date', width: 150 },
  ];

// recSubmission.tsx
const actions = [
  {
    label: 'Review',
    onClick: (item: Submission) => router.push(`${Routes.REC_VIEW}?id=${item.id}`),
    customVariant: 'primary', // Must match one of 'primary' | 'secondary' | 'light' | 'dark'
    icon: <VisibilityIcon />,
  },
  {
    label: 'Edit',
    onClick: (item: Submission) => router.push(`${Routes.REC_EDIT}?id=${item.id}`),
    customVariant: 'secondary', // Must match one of 'primary' | 'secondary' | 'light' | 'dark'
    icon: <EditNoteIcon />,
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

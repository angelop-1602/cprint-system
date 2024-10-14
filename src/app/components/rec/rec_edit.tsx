
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import FileInput from '../reusable/FileInput'; // Reusable file input component
import { auth, db, storage } from '@/app/firebase/Config'; // Ensure this is your correct Firebase config path
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import StyledInput from '../reusable/StyledInput'; // Custom styled input component
import StyledLink from '../reusable/StyledLink'; // Custom styled link component
import { Routes } from '@/app/route/routes';
import { onAuthStateChanged } from 'firebase/auth'; // Importing the auth state listener

const RecEdit = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // To get query parameters like submission ID
  const submissionId = searchParams.get('id'); // Assume the submission id is passed as a query param 'id'

  const [researchTitle, setResearchTitle] = useState('');
  const [researcherName, setResearcherName] = useState('');
  const [courseProgram, setCourseProgram] = useState('');
  const [adviserName, setAdviserName] = useState('');
  const [userEmail, setUserEmail] = useState(''); // State for user email
  const [userName, setUserName] = useState(''); // State for user name
  const [files, setFiles] = useState<Record<string, File | null>>({
    protocolFile: null,
    endorsementFile: null,
    minutesFile: null,
    proposalFile: null,
    consentFile: null,
    technicalFile: null,
    questionnaireFile: null,
    cvFile: null,
    receiptFile: null,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    // Listen for user authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || ''); // Set user email
        setUserName(user.displayName || ''); // Set user name (if available)
        setResearcherName(user.displayName || ''); // Optionally set researcherName to user's display name
      } else {
        setUserEmail('');
        setUserName('');
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  useEffect(() => {
    // Fetch submission data for editing if an id is provided
    const fetchSubmission = async () => {
      if (!submissionId) return;

      const docRef = doc(db, 'research_submissions', submissionId); // Fetch by submission ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setResearchTitle(data.researchTitle || '');
        setResearcherName(data.researcherName || '');
        setCourseProgram(data.courseProgram || '');
        setAdviserName(data.adviserName || '');
      } else {
        console.log('No such document!');
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const handleFileChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!submissionId) {
      setSnackbarMessage('No submission ID found.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const docRef = doc(db, 'research_submissions', submissionId); // Use submission ID for the document
      await setDoc(docRef, {
        researchTitle,
        researcherName,
        userEmail, // Include user email in submission
        courseProgram,
        adviserName,
      }, { merge: true });

      // Upload files as before
      const uploadPromises = Object.entries(files).map(async ([key, file]) => {
        if (file) {
          const fileRef = ref(storage, `research_files/${submissionId}/${key}`); // Use submission ID in the path
          await uploadBytes(fileRef, file);
        }
      });

      await Promise.all(uploadPromises); // Wait for all uploads to complete

      setSnackbarMessage('Form updated successfully!');
      setSnackbarSeverity('success');
      router.push(Routes.REC); // Navigate to another page on success
    } catch (error) {
      console.error('Error updating form: ', error);
      setSnackbarMessage('Failed to update the form.');
      setSnackbarSeverity('error');
    }

    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: '600px',
        mx: 'auto',
        mt: 4,
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Edit REC Submission
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        Please update the form as needed.
      </Typography>
      <StyledInput
        label="Research Title"
        variant="outlined"
        required
        value={researchTitle}
        onChange={(e) => setResearchTitle(e.target.value)}
      />
      <StyledInput
        label="Lead Researcher/Group Leader/Name of Principal Investigator"
        variant="outlined"
        required
        value={researcherName}
        onChange={(e) => setResearcherName(e.target.value)}
      />
      <StyledInput
        label="Course/Program (Acronym)"
        variant="outlined"
        required
        value={courseProgram}
        onChange={(e) => setCourseProgram(e.target.value)}
      />
      <StyledInput
        label="Adviser (Including Extension Name)"
        variant="outlined"
        required
        value={adviserName}
        onChange={(e) => setAdviserName(e.target.value)}
      />
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" gutterBottom>
        Upload Documents:
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        Please upload the required documents or update the existing ones.
      </Typography>
      <FileInput id="protocol-file" label="Protocol Review Application" onChange={handleFileChange('protocolFile')} />
      <FileInput id="endorsement-file" label="Endorsement Letter/Adviser’s Certification" onChange={handleFileChange('endorsementFile')} />
      <FileInput id="minutes-file" label="Minutes of the Proposal Defense" onChange={handleFileChange('minutesFile')} />
      <FileInput id="proposal-file" label="Research Proposal" onChange={handleFileChange('proposalFile')} />
      <FileInput id="consent-file" label="Informed Consent of the Study" onChange={handleFileChange('consentFile')} />
      <FileInput id="technical-file" label="Technical Review Approval (if applicable)" onChange={handleFileChange('technicalFile')} />
      <FileInput id="questionnaire-file" label="Questionnaire" onChange={handleFileChange('questionnaireFile')} />
      <FileInput id="cv-file" label="Curriculum Vitae of Researchers" onChange={handleFileChange('cvFile')} />
      <FileInput id="receipt-file" label="Proof of Payment/Receipt" onChange={handleFileChange('receiptFile')} />

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Update Submission
      </Button>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecEdit;

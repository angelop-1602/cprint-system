// src/components/publication/PublicationForm.tsx
'use client';

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
import { useRouter } from 'next/navigation';
import StyledInput from '../reusable/StyledInput'; // Custom styled input component
import StyledLink from '../reusable/StyledLink'; // Custom styled link component
import { Routes } from '@/app/route/routes';
import { onAuthStateChanged } from 'firebase/auth'; // Importing the auth state listener

const PublicationForm = () => {
  const router = useRouter();
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
        console.log('User authenticated:', user); // Debugging line
        setUserEmail(user.email || ''); // Set user email
        setUserName(user.displayName || ''); // Set user name (if available)
        setResearcherName(user.displayName || ''); // Optionally set researcherName to user's display name
      } else {
        console.log('No user is authenticated'); // Debugging line
        setUserEmail('');
        setUserName('');
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  useEffect(() => {
    const fetchSubmission = async () => {
      const userId = auth.currentUser?.uid; // Get the current user's UID
      console.log('Current User ID:', userId); // Debugging line

      if (!userId) {
        console.log('User is not authenticated');
        return; // Ensure user is authenticated
      }

      const docRef = doc(db, 'publication_submissions', userId); // Use user's UID
      console.log('Document Reference:', docRef); // Debugging line

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Fetched data:', data); // Debugging line
          setResearchTitle(data.researchTitle || '');
          setCourseProgram(data.courseProgram || '');
          setAdviserName(data.adviserName || '');
        } else {
          console.log('No such document!'); // This will log if the document doesn't exist
        }
      } catch (error) {
        console.error('Error fetching document:', error); // Catch any errors while fetching
      }
    };

    fetchSubmission();
  }, [auth.currentUser]);

  const handleFileChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const userId = auth.currentUser?.uid; // Get the current user's UID
    if (!userId) {
      setSnackbarMessage('User is not authenticated.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const docRef = doc(db, 'publication_submissions', userId); // Use user's UID as the document ID
      await setDoc(docRef, {
        researchTitle,
        researcherName, // Use name from state
        userEmail,      // Include user email in submission
        courseProgram,
        adviserName,
      }, { merge: true });

      // Upload files as before
      const uploadPromises = Object.entries(files).map(async ([key, file]) => {
        if (file) {
          const fileRef = ref(storage, `publication_files/${userId}/${key}`); // Use user's UID in the path
          await uploadBytes(fileRef, file);
        }
      });

      await Promise.all(uploadPromises); // Wait for all uploads to complete

      setSnackbarMessage('Form submitted successfully!');
      setSnackbarSeverity('success');
      router.push(Routes.REC); // Navigate to another page on success
    } catch (error) {
      console.error('Error submitting form: ', error);
      setSnackbarMessage('Failed to submit the form.');
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
        Publication Submission
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        Please fill out accordingly
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
        Here is the file needed
        <StyledLink href="/needed"> needed </StyledLink>
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
        Submit
      </Button>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PublicationForm;

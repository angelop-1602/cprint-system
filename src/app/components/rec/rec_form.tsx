
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
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import StyledInput from '../reusable/StyledInput'; // Custom styled input component
import StyledLink from '../reusable/StyledLink'; // Custom styled link component
import { Routes } from '@/app/route/routes';
import { onAuthStateChanged } from 'firebase/auth'; // Importing the auth state listener

const RecForm = () => {
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is authenticated:', user); // Log user info
        setUserEmail(user.email || '');
        setUserName(user.displayName || '');
        setResearcherName(user.displayName || '');
      } else {
        console.log('No user is authenticated');
        setUserEmail('');
        setUserName('');
      }
    });
  
    return () => unsubscribe();
  }, []);
  
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
      // Check for existing submissions by the current user
      const submissionsRef = collection(db, 'research_submissions');
      const q = query(submissionsRef, where('userEmail', '==', userEmail)); // Query based on user email
      const querySnapshot = await getDocs(q);
      
      // Generate a unique document ID (you could use a timestamp or UUID)
      const submissionId = `${userId}_${Date.now()}`; // Unique submission ID
      const docRef = doc(db, 'research_submissions', submissionId); // Use the unique submission ID

      // Create the new submission regardless of previous submissions
      await setDoc(docRef, {
        researchTitle,
        researcherName,
        userEmail,
        courseProgram,
        adviserName,
        createdAt: new Date(), // Optional: Store the creation date
      });
  
      const currentDate = new Date().toISOString().split('T')[0];
  
      // Upload files logic remains the same
      const uploadPromises = Object.entries(files).map(async ([key, file]) => {
        if (file) {
          const fileLabel = {
            protocolFile: "Protocol Review Application",
            endorsementFile: "Endorsement Letter",
            minutesFile: "Minutes of the Proposal Defense",
            proposalFile: "Research Proposal",
            consentFile: "Informed Consent",
            technicalFile: "Technical Review Approval",
            questionnaireFile: "Questionnaire",
            cvFile: "Curriculum Vitae",
            receiptFile: "Proof of Payment",
          }[key];
  
          const fileName = `${fileLabel}_${userName}_${currentDate}`; 
          const fileRef = ref(storage, `research_files/${userId}/${fileName}`);
          await uploadBytes(fileRef, file);
        }
      });
  
      await Promise.all(uploadPromises);
  
      setSnackbarMessage('Form submitted successfully!');
      setSnackbarSeverity('success');
      router.push(Routes.REC);
    } catch (error) {
      console.error('Error submitting form: ', error);
      setSnackbarMessage('Failed to submit the form.');
      setSnackbarSeverity('error');
    }
  
    setSnackbarOpen(true);
  };
  
  const userId = auth.currentUser?.uid; 
  console.log('User ID:', userId);
  
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
        REC Submission
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

export default RecForm;

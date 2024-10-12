import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Divider,
  InputLabel,
  styled,
} from '@mui/material';
import { db, storage } from '@/app/firebase/Config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';

const StyledInput = styled(TextField)(({ theme }) => ({
  backgroundColor: 'white', // White background
  boxShadow: theme.shadows[2], // Add shadow from MUI theme
  borderRadius: theme.shape.borderRadius, // Rounded corners
  marginBottom: theme.spacing(2),
  width: '100%', // Full width
  maxWidth: '400px', // Set max width to make inputs smaller
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.grey[400], // Border color
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main, // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main, // Border color when focused
    },
  },
}));

const RecForm = () => {
  const router = useRouter();
  const [researchTitle, setResearchTitle] = useState('');
  const [researcherName, setResearcherName] = useState('');
  const [courseProgram, setCourseProgram] = useState('');
  const [adviserName, setAdviserName] = useState('');
  
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

  const [fileUrls, setFileUrls] = useState<Record<string, string | null>>({
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
    const fetchSubmission = async () => {
      const researcherId = researcherName;
      const docRef = doc(db, 'research_submissions', researcherId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setResearchTitle(data.researchTitle);
        setCourseProgram(data.courseProgram);
        setAdviserName(data.adviserName);

        const updatedUrls: Record<string, string | null> = { ...fileUrls };
        for (const key in files) {
          const fileRef = ref(storage, `research_files/${researcherId}/${key}`);
          try {
            const url = await getDownloadURL(fileRef);
            updatedUrls[key] = url;
          } catch (error) {
            console.error(`Failed to fetch URL for ${key}: `, error);
            updatedUrls[key] = null;
          }
        }
        setFileUrls(updatedUrls);
      } else {
        setSnackbarMessage('No existing submission found.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    if (researcherName) {
      fetchSubmission();
    }
  }, [researcherName]);

  const handleFileChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const docRef = doc(db, 'research_submissions', researcherName);
      await setDoc(docRef, {
        researchTitle,
        researcherName,
        courseProgram,
        adviserName,
      }, { merge: true });

      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const fileRef = ref(storage, `research_files/${researcherName}/${key}`);
          await uploadBytes(fileRef, file);
        }
      }

      setSnackbarMessage('Form submitted successfully!');
      setSnackbarSeverity('success');
      router.push('/rec-application');
    } catch (error) {
      console.error('Error submitting form: ', error);
      setSnackbarMessage('Failed to submit the form.');
      setSnackbarSeverity('error');
    }

    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '600px', mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Research Submission Form
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

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Existing Documents:</Typography>
      {Object.entries(fileUrls).map(([key, url]) => (
        <Typography key={key} variant="body2">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer">{key.replace(/File$/, '').replace(/([A-Z])/g, ' $1')}</a>
          ) : (
            <span>{key.replace(/File$/, '').replace(/([A-Z])/g, ' ')}: No file uploaded</span>
          )}
        </Typography>
      ))}

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Upload New Documents (if applicable):</Typography>

      <InputLabel htmlFor="protocol-file">Protocol Review Application</InputLabel>
      <input
        id="protocol-file"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange('protocolFile')}
        style={{ marginBottom: '16px' }}
      />

      <InputLabel htmlFor="endorsement-file">Endorsement Letter/Adviser’s Certification</InputLabel>
      <input
        id="endorsement-file"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange('endorsementFile')}
        style={{ marginBottom: '16px' }}
      />

      <InputLabel htmlFor="minutes-file">Minutes of the Proposal Defense</InputLabel>
      <input
        id="minutes-file"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange('minutesFile')}
        style={{ marginBottom: '16px' }}
      />

      <InputLabel htmlFor="proposal-file">Research Proposal</InputLabel>
      <input
        id="proposal-file"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange('proposalFile')}
        style={{ marginBottom: '16px' }}
      />

      <InputLabel htmlFor="consent-file">Informed Consent of the Study</InputLabel>
      <input
        id="consent-file"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange('consentFile')}
        style={{ marginBottom: '16px' }}
      />

      <InputLabel htmlFor="technical-file">Technical Review Approval (if applicable)</InputLabel>
      <input
        id="technical-file"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange('technicalFile')}
        style={{ marginBottom: '16px' }}
      />

      <InputLabel htmlFor="questionnaire-file">Questionnaire</InputLabel>
      <input
        id="questionnaire-file"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange('questionnaireFile')}
        style={{ marginBottom: '16px' }}
      />

      <InputLabel htmlFor="cv-file">Curriculum Vitae of Researchers</InputLabel>
      <input
        id="cv-file"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange('cvFile')}
        style={{ marginBottom: '16px' }}
      />

      <InputLabel htmlFor="receipt-file">Official Receipt/Proof of Payment for Ethics Review</InputLabel>
      <input
        id="receipt-file"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange('receiptFile')}
        style={{ marginBottom: '16px' }}
      />

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

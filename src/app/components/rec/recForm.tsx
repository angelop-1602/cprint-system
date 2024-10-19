import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import FileInput from '../reusable/FileInput';
import { auth, db, storage } from '@/app/firebase/Config';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import StyledInput from '../reusable/StyledInput';
import StyledLink from '../reusable/StyledLink';
import { Routes } from '@/app/route/routes';
import { onAuthStateChanged } from 'firebase/auth';
import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';
import PulsingLoader from '../PulsingLoader';

const RecForm = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    researchTitle: '',
    researcherName: '',
    courseProgram: '',
    adviserName: '',
    userEmail: '',
    userName: '',
  });

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

  const [fileNames, setFileNames] = useState<Record<string, string | null>>({});
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  const [loadingState, setLoadingState] = useState<'idle' | 'submitting' | 'converting'>('idle');

  const [fileCounters, setFileCounters] = useState<Record<string, number>>({
    protocolFile: 0,
    endorsementFile: 0,
    minutesFile: 0,
    proposalFile: 0,
    consentFile: 0,
    technicalFile: 0,
    questionnaireFile: 0,
    cvFile: 0,
    receiptFile: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData(prev => ({
          ...prev,
          userEmail: user.email || '',
          userName: user.displayName || '',
          researcherName: user.displayName || '',
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          userEmail: '',
          userName: '',
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const convertToPDF = useCallback(async (file: File): Promise<Blob> => {
    if (file.type === 'application/pdf') {
      return file; // Return the file directly if it's already a PDF
    }

    setLoadingState('converting');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          try {
            const result = await mammoth.convertToHtml({ arrayBuffer: event.target.result });
            const html = result.value;

            const pdfElement = document.createElement('div');
            pdfElement.innerHTML = html;
            document.body.appendChild(pdfElement);

            const options = {
              margin: 1,
              filename: `${file.name.split('.').slice(0, -1).join('.')}.pdf`,
              html2canvas: { scale: 2 },
              jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            };

            const pdf = html2pdf().from(pdfElement).set(options);
            pdf.outputPdf().then((pdfBlob: Blob) => {
              document.body.removeChild(pdfElement);
              setLoadingState('idle');
              resolve(pdfBlob);
            }).catch((error: unknown) => {
              document.body.removeChild(pdfElement);
              setLoadingState('idle');
              reject(error);
            });
          } catch (error: unknown) {
            setLoadingState('idle');
            reject(error);
          }
        } else {
          setLoadingState('idle');
          reject(new Error("File read error: result is not an ArrayBuffer."));
        }
      };

      reader.onerror = (error) => {
        setLoadingState('idle');
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleFileChange = useCallback((key: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
    setFileNames((prev) => ({ ...prev, [key]: file ? file.name : null }));

    // Increase the counter for the specific file type
    if (file) {
      setFileCounters((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    }

    if (file && (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/pdf')) {
      try {
        const pdfBlob = await convertToPDF(file);
        const pdfFile = new File([pdfBlob], `${file.name.split('.').slice(0, -1).join('.')}.pdf`, { type: 'application/pdf' });
        setFiles((prev) => ({ ...prev, [key]: pdfFile }));
        setFileNames((prev) => ({ ...prev, [key]: pdfFile.name }));
      } catch (error) {
        setSnackbarMessage('Error converting file to PDF.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage('Unsupported file type. Please upload a PDF or Word document.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [convertToPDF]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadingState('submitting');

    const userId = auth.currentUser?.uid;
    if (!userId) {
      setSnackbarMessage('User is not authenticated.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoadingState('idle');
      return;
    }

    try {
      const submissionId = `${userId}_${Date.now()}`;
      const currentDate = new Date().toISOString().split('T')[0];

      // Save the form data to Firestore
      const docRef = doc(db, 'research_submissions', submissionId);
      await setDoc(docRef, {
        researchTitle: formData.researchTitle,
        researcherName: formData.researcherName,
        userEmail: formData.userEmail,
        courseProgram: formData.courseProgram,
        adviserName: formData.adviserName,
        userId: userId,
        status: 'pending',
        createdAt: new Date(),
      });

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
            cvFile: "Curriculum Vitae of Researchers",
            receiptFile: "Proof of Payment",
          }[key];

          const fileCount = fileCounters[key]; // Get the current count for this file type
          const fileName = `${fileLabel}_${formData.userName}_${currentDate}_${fileCount}`; // Include the count in the filename
          const fileRef = ref(storage, `research_files/${userId}/${submissionId}/${fileName}`);
          await uploadBytes(fileRef, file);
        }
      });

      await Promise.all(uploadPromises);
      setSnackbarMessage('Form submitted successfully!');
      setSnackbarSeverity('success');
      router.push(Routes.REC);
    } catch (error) {
      setSnackbarMessage('Failed to submit the form.');
      setSnackbarSeverity('error');
    } finally {
      setLoadingState('idle');
      setSnackbarOpen(true);
    }
  }, [formData, files, router, fileCounters]);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const fileInputs = [
    { id: 'protocolFile', label: 'Protocol Review Application' },
    { id: 'endorsementFile', label: 'Endorsement Letter/Adviser’s Certification' },
    { id: 'minutesFile', label: 'Minutes of the Proposal Defense' },
    { id: 'proposalFile', label: 'Research Proposal' },
    { id: 'consentFile', label: 'Informed Consent of the Study' },
    { id: 'technicalFile', label: 'Technical Review Approval (if applicable)' },
    { id: 'questionnaireFile', label: 'Questionnaire' },
    { id: 'cvFile', label: 'Curriculum Vitae of Researchers' },
    { id: 'receiptFile', label: 'Proof of Payment/Receipt' },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '600px', mx: 'auto', mt: 4, backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0' }}>
      {loadingState !== 'idle' ? (
        <PulsingLoader />
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            REC Submission Form
          </Typography>
          <StyledInput
            label="Research Title"
            value={formData.researchTitle}
            onChange={(e) => setFormData({ ...formData, researchTitle: e.target.value })}
          />
          <StyledInput
            label="Researcher Name"
            value={formData.researcherName}
            onChange={(e) => setFormData({ ...formData, researcherName: e.target.value })}
          />
          <StyledInput
            label="Researcher Email"
            value={formData.userEmail}
            onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
          />
          <StyledInput
            label="Course Program"
            value={formData.courseProgram}
            onChange={(e) => setFormData({ ...formData, courseProgram: e.target.value })}
          />
          <StyledInput
            label="Adviser Name"
            value={formData.adviserName}
            onChange={(e) => setFormData({ ...formData, adviserName: e.target.value })}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" gutterBottom>
            Upload Documents:
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
            Here is the <StyledLink href="needed">file needed</StyledLink>
          </Typography>
          {fileInputs.map(({ id, label }) => (
            <FileInput
              key={id}
              id={id}
              label={label}
              onChange={handleFileChange(id)}
              fileName={fileNames[id] || null}
            />
          ))}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
};

export default RecForm;

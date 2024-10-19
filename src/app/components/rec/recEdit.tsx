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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import StyledInput from '../reusable/StyledInput';
import { Routes } from '@/app/route/routes';
import { onAuthStateChanged } from 'firebase/auth';
import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';
import PulsingLoader from '../PulsingLoader';

const RecEdit = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  interface FormData {
    researchTitle: string;
    researcherName: string;
    courseProgram: string;
    adviserName: string;
    userEmail: string;
    userName: string;
  }

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

  const [formData, setFormData] = useState<FormData>({
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

  const [fileNames, setFileNames] = useState<Record<string, string | null>>({
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

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [loadingState, setLoadingState] = useState<'idle' | 'submitting'>('idle');

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          userEmail: user.email || '',
          userName: user.displayName || '',
          researcherName: user.displayName || '',
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          userEmail: '',
          userName: '',
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!submissionId) return;

      const docRef = doc(db, 'research_submissions', submissionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData((prev) => ({
          ...prev,
          researchTitle: data.researchTitle || '',
          researcherName: data.researcherName || '',
          courseProgram: data.courseProgram || '',
          adviserName: data.adviserName || '',
        }));

        const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

        await Promise.all(
          Object.entries(files).map(async ([key]) => {
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

            // You might need to get the count from your file counters or maintain it elsewhere
            const fileCount = fileCounters[key] || 1;

            // Construct the expected filename
            const expectedFileName = `${fileLabel}_${data.researcherName}_${currentDate}_${fileCount}`;

            const fileRef = ref(storage, `research_files/${userId}/${submissionId}/${expectedFileName}`);
            try {
              const url = await getDownloadURL(fileRef);
              setFileNames((prev) => ({ ...prev, [key]: expectedFileName })); // Store the expected file name if it exists
            } catch (error) {
              console.log(`No existing file for ${key}`, error);
            }
          })
        );
      } else {
        console.log('No such document!');
        setSnackbar({ open: true, message: 'Failed to fetch submission data.', severity: 'error' });
      }
    };

    fetchSubmission();
  }, [submissionId, userId, files]);

  const convertToPDF = useCallback(async (file: File): Promise<Blob> => {
    if (file.type === 'application/pdf') {
      return file; // Return the file directly if it's already a PDF
    }

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
              resolve(pdfBlob);
            }).catch(reject);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error("File read error: result is not an ArrayBuffer."));
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleFileChange = useCallback((key: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
    setFileNames((prev) => ({ ...prev, [key]: file ? file.name : null }));

    if (file && (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/pdf')) {
      try {
        const pdfBlob = await convertToPDF(file);
        const pdfFile = new File([pdfBlob], `${file.name.split('.').slice(0, -1).join('.')}.pdf`, { type: 'application/pdf' });
        setFiles((prev) => ({ ...prev, [key]: pdfFile }));
        setFileNames((prev) => ({ ...prev, [key]: pdfFile.name }));
      } catch (error) {
        setSnackbar({ open: true, message: 'Error converting file to PDF.', severity: 'error' });
      }
    } else if (file) {
      setSnackbar({ open: true, message: 'Unsupported file type. Please upload a PDF or Word document.', severity: 'error' });
    }
  }, [convertToPDF]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadingState('submitting');

    if (!submissionId) {
      setSnackbar({ open: true, message: 'No submission ID found.', severity: 'error' });
      setLoadingState('idle');
      return;
    }

    try {
      const docRef = doc(db, 'research_submissions', submissionId);
      await setDoc(docRef, {
        ...formData,
        userEmail: formData.userEmail,
      }, { merge: true });

      const uploadPromises = Object.entries(files).map(async ([key, file]) => {
        if (file) {
          const fileRef = ref(storage, `research_files/${userId}/${submissionId}/${key}`);
          await uploadBytes(fileRef, file);
        }
      });

      await Promise.all(uploadPromises);
      setSnackbar({ open: true, message: 'Submission updated successfully!', severity: 'success' });
      router.push(Routes.REC);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update submission.', severity: 'error' });
    } finally {
      setLoadingState('idle');
    }
  }, [formData, files, submissionId, userId, router]);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

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
            Edit Submission Form
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
            Update Submission
          </Button>
          <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
};

export default RecEdit;

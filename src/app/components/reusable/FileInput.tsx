import React, { useState } from 'react';
import { InputLabel, Box, Button, Typography, CircularProgress } from '@mui/material';

interface FileInputProps {
  id: string;
  label: string;
  accept?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, fileName: string) => void;
  fileName?: string | null; // Prop to receive the file name
}

const FileInput: React.FC<FileInputProps> = ({ id, label, accept = '.pdf,.doc,.docx', onChange, fileName }) => {
  const [fileLoading, setFileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    document.getElementById(id)?.click(); // Trigger hidden file input
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    const selectedFileName = file ? file.name : '';

    if (file) {
      const acceptedTypes = accept.split(',').map(type => type.trim());

      if (!acceptedTypes.includes(file.type)) {
        const fileExtension = selectedFileName.split('.').pop()?.toLowerCase();
        const validExtensions = acceptedTypes.map(type => type.replace('.', '').toLowerCase());

        if (!validExtensions.includes(fileExtension || '')) {
          setError('Unsupported file type. Please upload a valid file.');
          return;
        }
      }

      setError(null);
      setFileLoading(true);

      // Simulate file loading process
      setTimeout(() => {
        setFileLoading(false);
        onChange(event, selectedFileName); // Call parent's onChange handler
      }, 1500); // Simulate a 1.5-second delay for the process
    } else {
      setError('No file selected.'); // Handle case where no file is selected
    }
  };

  return (
    <Box
      mb={2}
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        backgroundColor: 'white',
        boxShadow: (theme) => theme.shadows[2],
        '&:hover': {
          color: '#036635',
        },
      }}
    >
      <InputLabel
        htmlFor={id}
        sx={{
          color: '#000',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
      >
        {label}
      </InputLabel>

      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide default input
      />

      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={handleButtonClick}
        sx={{
          textTransform: 'none',
          fontSize: '0.875rem',
          padding: '4px 12px',
          marginTop: '8px',
          borderRadius: '4px',
          borderColor: '#ccc',
          '&:hover': {
            borderColor: '#036635',
          },
        }}
      >
        Choose File
      </Button>

      {fileLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
          <CircularProgress color="success" size={15} style={{ marginRight: '8px' }} />
          <Typography variant="body2">Converting...</Typography>
        </Box>
      ) : (
        <>
          {error && (
            <Typography variant="body2" sx={{ color: 'red', marginTop: '8px' }}>
              {error}
            </Typography>
          )}
          {fileName && (
            <Typography variant="body2" sx={{ marginTop: '8px' }}>
              Selected File: {fileName}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default FileInput;

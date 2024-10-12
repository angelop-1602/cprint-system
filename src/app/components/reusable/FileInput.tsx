import React from 'react';
import { InputLabel, Box, Button } from '@mui/material';

interface FileInputProps {
  id: string;
  label: string;
  accept?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<FileInputProps> = ({ id, label, accept = '.pdf,.doc,.docx', onChange }) => {
  const handleButtonClick = () => {
    // Trigger the hidden file input when the custom button is clicked
    document.getElementById(id)?.click();
  };

  return (
    <Box
      mb={2}
      sx={{
        border: '1px solid #ccc', // Gray border
        borderRadius: '4px', // Rounded corners
        padding: '8px', // Space between the content and the border
        backgroundColor: 'white', // White background
        boxShadow: (theme) => theme.shadows[2], 
        '&:hover': {
            color: '#036635', // Darker green on hover for emphasis
          },
      }}
    >
      <InputLabel
        htmlFor={id}
        sx={{
          color: '#000', // Black color for the label
          fontWeight: 'bold', // Make the label bold
          fontSize: '1rem', // Slightly larger font size
          
        }}
      >
        {label}
      </InputLabel>
      {/* Hidden file input */}
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={onChange}
        style={{ display: 'none' }} // Hide the default file input
      />
      {/* Custom button to trigger the file input */}
      <Button
        variant="outlined" // Changed to outlined for a cleaner look
        color="primary"
        size="small"
        onClick={handleButtonClick}
        sx={{
          textTransform: 'none', // Prevents text from being uppercase
          fontSize: '0.875rem', // Smaller font size
          padding: '4px 12px', // Custom padding for a smaller button
          marginTop: '8px', // Add margin for spacing
          borderRadius: '4px', // Match border radius
          borderColor: '#ccc', // Match border color
          '&:hover': {
            borderColor: '#036635', // Change border color on hover
          },
        }}
      >
        Choose File
      </Button>
    </Box>
  );
};

export default FileInput;

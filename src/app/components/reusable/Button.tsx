// ReusableButton.tsx
import React from 'react';
import { Button } from '@mui/material';
import { buttonStyles } from '@/app/theme/theme'; // Adjust the import path according to your project structure

interface ReusableButtonProps {
  onClick: () => void;
  customVariant?: 'primary' | 'secondary' | 'light' | 'dark';
  children: React.ReactNode;
  startIcon?: React.ReactNode; // Add this line if you haven't already
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  onClick,
  customVariant = 'primary', // Default to primary
  children,
  startIcon,
}) => {
  // Get styles for the specific variant
  const styles = buttonStyles(customVariant); // Get styles based on the variant

  return (
    <Button
      onClick={onClick}
      startIcon={startIcon} // Include icon here
      sx={{
        ...styles, // Spread the styles from buttonStyles
        marginRight: 1, // Add margin here (you can adjust the value)
      }}
    >
      {children}
    </Button>
  );
};

export default ReusableButton;

// ReusableButton.tsx
import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { buttonStyles } from '@/app/Theme/theme';

interface ReusableButtonProps extends ButtonProps {
  customVariant?: 'primary' | 'secondary'; // Custom variant prop for different styles
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  customVariant = 'primary', // Default to primary variant
  children,
  ...props
}) => {
  const styles = buttonStyles(customVariant); // Get styles based on variant

  return (
    <Button
      variant="contained" // Using the MUI contained variant
      sx={{ ...styles }} // Apply styles
      {...props} // Spread the rest of the props
    >
      {children}
    </Button>
  );
};

export default ReusableButton;

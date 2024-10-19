// ReusableButton.tsx
import React from 'react';
import { Button } from '@mui/material';
import { buttonStyles } from '@/app/theme/theme'; // Adjust the import path according to your project structure
import PulsingLoader from '../PulsingLoader';

// ReusableButton.tsx
interface ReusableButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  customVariant?: 'primary' | 'secondary' | 'light' | 'dark'; // Must be one of the allowed types
  children: React.ReactNode;
  startIcon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  sx?: React.CSSProperties;
}


const ReusableButton: React.FC<ReusableButtonProps> = ({
  onClick,
  customVariant = 'primary', // Default to primary
  children,
  startIcon,
  fullWidth = false, 
  loading = false, // Default loading to false
  ariaLabel,
  sx, // Accept additional styles
}) => {
  // Get styles for the specific variant
  const styles = buttonStyles(customVariant); // Get styles based on the variant

  return (
    <Button
      onClick={onClick}
      startIcon={startIcon} 
      fullWidth={fullWidth}
      aria-label={ariaLabel} // Include aria-label for accessibility
      sx={{
        ...styles, // Spread the styles from buttonStyles
        marginRight: 1, // Add margin here (you can adjust the value)
        ...sx, // Allow custom styles to be passed
      }}
      disabled={loading} // Disable the button while loading
    >
      {loading ? (
        <PulsingLoader /> 
      ) : (
        children
      )}
    </Button>
  );
};

export default ReusableButton;

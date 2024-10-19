import React from 'react';
import { Box } from '@mui/material';

interface PulsingLoaderProps {
  message?: string;
  loaderSrc?: string; // Allow loader image source to be customizable
  loaderSize?: string; // Allow loader size to be customizable
  backgroundColor?: string; // Allow background color to be customizable
}

const PulsingLoader: React.FC<PulsingLoaderProps> = ({
  message,
  loaderSrc = '/favicon.ico', // Default to favicon
  loaderSize = '100px', // Default size
  backgroundColor = 'rgba(255, 255, 255)', // Default background
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: backgroundColor,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999, // Ensure it's on top of everything
      }}
    >
      <Box
        component="img"
        src={loaderSrc} // Use the customizable loader source
        sx={{
          width: loaderSize, // Use the customizable loader size
          animation: 'pulse 1.5s infinite', // Animation properties
        }}
        alt="Loading" // Add alt text for accessibility
      />
      {message && (
        <div style={{ marginTop: '16px', fontSize: '18px', textAlign: 'center' }}>
          {message}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </Box>
  );
};

export default PulsingLoader;

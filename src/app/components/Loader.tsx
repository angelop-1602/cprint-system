import React from 'react';
import { Box } from '@mui/material';

const PulsingLoader: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999, // Ensure it's on top of everything
      }}
    >
      <Box
        component="img"
        src="/favicon.ico" // Path to your favicon
        sx={{
          width: '100px', // Starting size
          animation: 'pulse 1.5s infinite', // Animation properties
        }}
      />
      {message && (
        <div style={{ marginTop: '16px', fontSize: '18px' }}>{message}</div>
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

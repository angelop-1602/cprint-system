// src/app/components/Notification.tsx
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface NotificationProps {
  open: boolean;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void; // Updated to handle reasons
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  autoHideDuration?: number; // Optional custom duration
}

const Notification: React.FC<NotificationProps> = ({
  open,
  onClose,
  message,
  severity,
  autoHideDuration = 6000, // Default duration
}) => {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
      <Alert 
        onClose={onClose} 
        severity={severity} 
        sx={{ width: '100%' }} 
        aria-live="assertive" // Announce alert to screen readers
        role="alert" // Indicate that this is an alert
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;

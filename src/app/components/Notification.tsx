// src/app/components/Notification.tsx
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface NotificationProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const Notification: React.FC<NotificationProps> = ({ open, onClose, message, severity }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;

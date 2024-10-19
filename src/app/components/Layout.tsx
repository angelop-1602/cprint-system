'use client'; // This should be removed if this is used for the entire document

import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import useAuth from '@/app/hooks/useAuth';
import { ThemeProvider } from '@mui/material/styles';
import ProtectedRoute from './ProtectedRoute';
import theme from '../theme/theme';
import Page from '../page';
import PulsingLoader from './PulsingLoader'; // Fixed typo in import
import useInactivitySignout from '../hooks/useInactivitySignout';
import AuthenticatedLayout from './AuthenicatedLayout';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  const timeoutDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  useInactivitySignout(timeoutDuration);

  const handleDrawerToggle = () => setOpen((prev) => !prev); // Toggle the state

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
        >
          <PulsingLoader />
        </Box>
      ) : isAuthenticated ? (
        <ProtectedRoute>
          <AuthenticatedLayout onMenuClick={handleDrawerToggle} open={open}>
            {children}
          </AuthenticatedLayout>
        </ProtectedRoute>
      ) : (
        <Page />
      )}
    </ThemeProvider>
  );
}

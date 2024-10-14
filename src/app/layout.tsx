'use client'; 
import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute';
import './globals.css';
import useAuth from '@/app/hooks/useAuth';
import theme from './Theme/theme';
import { ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import AuthenticatedLayout from './components/AuthenicatedLayout';
import Page from './page';
import PulsingLoader from './components/Loader';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  const handleDrawerToggle = () => setOpen(!open);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <PulsingLoader />
      </Box>
    );
  }

  return (
    <html lang="en">
      <Head>
        <title>CPRINT</title>
        <meta name="description" content="My application description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {isAuthenticated ? (
            <ProtectedRoute>
              <AuthenticatedLayout onMenuClick={handleDrawerToggle} open={open}>
                {children}
              </AuthenticatedLayout>
            </ProtectedRoute>
          ) : (
            <Page />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}

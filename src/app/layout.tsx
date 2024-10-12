"use client"; // Required for client-side rendering

import { useState } from 'react';
import { Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import TopBar from './components/TopBar';
import ProtectedRoute from './components/ProtectedRoute';
import SignInPage from './pages/signin/page';
import SideBar from './components/SideBar';
import './globals.css';
import useAuth from '@/app/hooks/useAuth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width:600px)');
  const { isAuthenticated, loading } = useAuth(); // Use the hook to check auth status

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Render loading spinner while waiting for auth status
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <html lang="en">
      <body style={{ backgroundColor: '#f0f0f0', minHeight: '100%' }}> {/* Set the body background to a darker color */}
        {isAuthenticated ? (
          <ProtectedRoute>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
              <TopBar onMenuClick={handleDrawerToggle} />
              <SideBar
                open={isDesktop ? true : open}
                onClose={handleDrawerToggle}
                variant={isDesktop ? 'permanent' : 'temporary'}
              />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  bgcolor: 'background.default',
                  p: 3,
                }}
              >
                <Toolbar />
                {children}
              </Box>
            </Box>
          </ProtectedRoute>
        ) : (
          <SignInPage /> // Render sign-in page if not authenticated
        )}
      </body>
    </html>
  );
}

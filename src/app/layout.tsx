"use client"; // Only if you need client-side functionality in this component.

import { useState } from 'react';
import { Box, CssBaseline, Toolbar, useMediaQuery, CircularProgress } from '@mui/material';
import TopBar from './components/TopBar';
import ProtectedRoute from './components/ProtectedRoute';
import SignInPage from './pages/signin/page';
import SideBar from './components/SideBar';
import './globals.css'; // Global styles
import useAuth from '@/app/hooks/useAuth'; // Custom hook for authentication
import theme from './Theme/theme'; // Your MUI theme
import { ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import { usePathname } from 'next/navigation'; // Import usePathname

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width:600px)');
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname(); // Get the current pathname
  const currentPath = pathname.split('/').pop().toLowerCase(); // Use lowercase for comparison

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <html lang="en"> {/* Required html tag */}
      <Head>
        <title>CPRINT</title>
        <meta name="description" content="My application description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {isAuthenticated ? (
            <ProtectedRoute>
              <Box sx={{ display: 'flex' }}>
                <TopBar onMenuClick={handleDrawerToggle} />
                <SideBar
                  open={isDesktop ? true : open}
                  onClose={handleDrawerToggle}
                  variant={isDesktop ? 'permanent' : 'temporary'}
                  activeItem={currentPath} // Pass the active item to the SideBar
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
            <SignInPage />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}

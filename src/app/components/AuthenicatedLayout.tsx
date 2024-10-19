import React, { useState } from 'react';
import { Box, Toolbar, useMediaQuery } from '@mui/material';
import TopBar from './TopBar';
import SideBar from './SideBar';
import { usePathname } from 'next/navigation';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  onMenuClick: () => void;
  open: boolean;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  onMenuClick,
  open,
}) => {
  const isDesktop = useMediaQuery('(min-width:1030px)');
  const pathname = usePathname();
  const currentPath = pathname.split('/').pop()?.toLowerCase() || '';

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar onMenuClick={onMenuClick} />
      <SideBar
        open={isDesktop ? true : open} // Sidebar is permanently open on desktop
        onClose={onMenuClick}
        variant={isDesktop ? 'permanent' : 'temporary'}
        activeItem={currentPath}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3, // Adjust padding based on content requirements
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AuthenticatedLayout;

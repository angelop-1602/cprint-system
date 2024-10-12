// src/app/components/TopBar.tsx
"use client"; // Required for client-side rendering

import React from 'react';
import { AppBar, Toolbar, IconButton, useMediaQuery, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface TopBarProps {
  onMenuClick: () => void; // Callback for menu button click
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  // Use media query to check if the screen size is mobile
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#026635', // Set the background color to the specified color
      }}
    >
      <Toolbar>
     
        {isMobile && ( // Render the menu button only if in mobile view
          <IconButton
            edge="start"
            color="inherit"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )} <Typography variant="h6" sx={{ padding: '16px', fontWeight: 'bold' }}>
        CPRINT System
      </Typography>
        <span style={{ flexGrow: 1 }} /> 
        
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

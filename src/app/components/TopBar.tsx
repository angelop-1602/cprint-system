import React from 'react';
import { AppBar, Toolbar, IconButton, useMediaQuery, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SignOutButton from './SignoutButton';
interface TopBarProps {
  onMenuClick: () => void; // Callback for menu button click
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const isMobile = useMediaQuery('(max-width:1024px)'); // Display menu only on mobile

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#026635' }}>
      <Toolbar>
        {isMobile && (
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={onMenuClick} 
            sx={{ mr: 2 }} 
            aria-label="open menu" // Accessibility improvement
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1, padding: '16px', fontWeight: 'bold' }}>
          CPRINT System
        </Typography>
        <Box sx={{ flexGrow: 1 }} /> {/* Spacer using Box for better layout control */}
        <SignOutButton />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

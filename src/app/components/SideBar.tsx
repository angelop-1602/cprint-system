"use client"; // Required for client-side rendering

import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import TaskIcon from '@mui/icons-material/Task';
// Width of the drawer
const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon /> },
  { text: 'REC', icon: <ArticleIcon /> },
  { text: 'Publication', icon: <LocalLibraryIcon /> },
  { text: 'Student Clearance', icon: <TaskIcon /> },
  { text: 'Faculty Clearance', icon: <TaskIcon /> },
];

const SideBar = ({
  open,
  onClose,
  activeItem, // Accept active item prop
  variant = 'temporary', // Default to temporary variant for mobile
}: {
  open: boolean; // State to control whether the sidebar is open
  onClose: () => void; // Callback to close the sidebar
  activeItem: string; // Current active item text
  variant: 'permanent' | 'temporary'; // Type to control the variant for desktop/mobile
}) => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#F7F7F7', // Light gray background
          color: '#333', // Dark text color
          borderRight: '1px solid #DDDDDD', // Light border
        },
      }}
      variant={variant} // Use the appropriate variant based on screen size
      anchor="left" // Sidebar opens from the left
      open={open} // Control the open state
      onClose={onClose} // Function to call when closing the drawer
    >
      <Toolbar />
      <Box
        sx={{
          padding: '16px',
          textAlign: 'center',
          borderBottom: '1px solid #DDDDDD', // Light border for separation
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
          Services
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#DDDDDD', marginBottom: '8px' }} />
      <List>
        {menuItems.map(({ text, icon }) => (
          <Link href={`/pages/${text.toLowerCase()}`} passHref onClick={onClose}>
            <ListItemButton
              key={text}
              sx={{
                '&:hover': {
                  backgroundColor: '#03663566',
                  transition: 'background-color 0.3s',
                },
                backgroundColor: activeItem === text.toLowerCase() ? '#036635CC' : 'transparent', // Match case
                color: activeItem === text.toLowerCase() ? '#fff' : '#333', 
                marginBottom: '8px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {icon}
                <ListItemText primary={text} sx={{ marginLeft: '8px', color: activeItem === text.toLowerCase() ? '#fff' : '#333',  }} />
              </Box>
            </ListItemButton>
          </Link>
        ))}
      </List>

    </Drawer>
  );
};

export default SideBar;

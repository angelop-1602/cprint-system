"use client"; // Required for client-side rendering

import React from 'react';
import { Drawer, List, ListItemButton, ListItemText, Toolbar, Divider, Typography } from '@mui/material';
import Link from 'next/link';

// Width of the drawer
const drawerWidth = 240;

const SideBar = ({
  open,
  onClose,
  variant = 'temporary', // Default to temporary variant for mobile
}: {
  open: boolean; // State to control whether the sidebar is open
  onClose: () => void; // Callback to close the sidebar
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
          boxShadow: open ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none', // Add shadow when open
          backgroundColor: '#fff', // Set the drawer background to white
          borderRight: '1px solid #ccc', // Light border for separation
        },
      }}
      variant={variant} // Use the appropriate variant based on screen size
      anchor="left" // Sidebar opens from the left
      open={open} // Control the open state
      onClose={onClose} // Function to call when closing the drawer
    >
      <Toolbar />
      
      <Divider sx={{ marginBottom: '8px' }} />
      <List>
        {['R.E.C', 'Publication', 'Clearance'].map((text) => (
          <ListItemButton
            key={text}
            onClick={onClose}
            sx={{
              '&:hover': {
                backgroundColor: '#e0f7fa', // Light blue background on hover
                transition: 'background-color 0.3s', // Smooth transition
              },
              borderRadius: '8px', // Rounded corners
              marginBottom: '8px', // Space between buttons
            }}
          >
            <Link href={`/pages/${text.toLowerCase()}`} passHref>
              <ListItemText primary={text} sx={{ color: '#333' }} /> {/* Dark text color */}
            </Link>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;

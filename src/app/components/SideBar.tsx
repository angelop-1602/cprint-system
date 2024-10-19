import React from 'react';
import { Drawer, List, ListItemButton, ListItemText, Toolbar, Divider, Box, Typography } from '@mui/material';
import Link from 'next/link';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import TaskIcon from '@mui/icons-material/Task';

const drawerWidth = 240;

const menuItems = [
  { id: '1', text: 'Dashboard', icon: <DashboardIcon />, path: '/pages/dashboard' },
  { id: '2', text: 'REC', icon: <ArticleIcon />, path: '/pages/rec' },
  { id: '3', text: 'Publication', icon: <LocalLibraryIcon />, path: '/pages/publication' },
  { id: '4', text: 'Student Clearance', icon: <TaskIcon />, path: '/pages/student-clearance' },
  { id: '5', text: 'Faculty Clearance', icon: <TaskIcon />, path: '/pages/faculty-clearance' },
];

interface SideBarProps {
  open: boolean; // Open state of the sidebar
  onClose: () => void; // Function to close the sidebar
  activeItem: string; // Currently active item
  variant?: 'temporary' | 'permanent' | 'persistent'; // Drawer variant
}

const SideBar: React.FC<SideBarProps> = ({ open, onClose, activeItem, variant = 'temporary' }) => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#F7F7F7',
          color: '#333',
          borderRight: '1px solid #DDDDDD',
        },
      }}
      variant={variant}
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <Toolbar />
      <Box sx={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #DDDDDD' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
          Services
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#DDDDDD', marginBottom: '8px' }} />
      <List>
        {menuItems.map(({ id, text, icon, path }) => (
          <Link href={path} passHref key={id}>
            <ListItemButton
              onClick={onClose}
              sx={{
                '&:hover': { backgroundColor: '#03663566', transition: 'background-color 0.3s, color 0.3s' },
                backgroundColor: activeItem === text.toLowerCase() ? '#036635CC' : 'transparent',
                color: activeItem === text.toLowerCase() ? '#fff' : '#333',
                marginBottom: '8px',
              }}
              aria-label={text} // Add aria-label for accessibility
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {icon}
                <ListItemText primary={text} sx={{ marginLeft: '8px', color: activeItem === text.toLowerCase() ? '#fff' : '#333' }} />
              </Box>
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;

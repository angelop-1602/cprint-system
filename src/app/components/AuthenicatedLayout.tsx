import { Box, CssBaseline, Toolbar } from '@mui/material';
import TopBar from './TopBar';
import SideBar from './SideBar';
import { useMediaQuery } from '@mui/material';
import { usePathname } from 'next/navigation';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  onMenuClick: () => void;
  open: boolean;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, onMenuClick, open }) => {
  const isDesktop = useMediaQuery('(min-width:600px)');
  const pathname = usePathname();
  
  // Fix: Add a check to avoid 'undefined' when calling toLowerCase
  const currentPath = pathname.split('/').pop()?.toLowerCase() || ''; // Default to empty string if undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar onMenuClick={onMenuClick} />
      <SideBar
        open={isDesktop ? true : open}
        onClose={onMenuClick}
        variant={isDesktop ? 'permanent' : 'temporary'}
        activeItem={currentPath}
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
        <main>{children}</main>
      </Box>
    </Box>
  );
};

export default AuthenticatedLayout;

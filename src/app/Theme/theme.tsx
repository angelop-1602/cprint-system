// src/app/theme/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#036635', // Main dark green color
      light: '#4CAF50', // Lighter green with 80% opacity ()
      dark: '#003300', // Dark green color
      contrastText: '#ffffff', // White text for contrast
    },
    secondary: {
      main: '#FECC07', // Main secondary color
      light: '#FFF176', // Lighter secondary color
      dark: '#C6A700', // Darker secondary color
      contrastText: '#000000', // Black text for contrast
    },
    error: {
      main: '#f44336', // Error color
    },
    warning: {
      main: '#ff9800', // Warning color
    },
    info: {
      main: '#2196F3', // Info color
    },
    success: {
      main: '#4CAF50', // Success color
    },
  },
  shape: {
    borderRadius: 8, // Border radius for components
  },
  typography: {
    button: {
      textTransform: 'none', // Disable text transformation for buttons
    },
  },
});

// Button styles using the theme
export const buttonStyles = (variant: 'primary' | 'secondary' | 'light' | 'dark') => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.light, // Use the modified light color
        },
      };
    case 'secondary':
      return {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.secondary.light,
        },
      };
    case 'light':
      return {
        backgroundColor: theme.palette.primary.light, // Use the modified light color
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.main,
        },
      };
    case 'dark':
      return {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.main,
        },
      };
    default:
      return {};
  }
};

export default theme;

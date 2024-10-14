// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#036635', // Main green color
      light: '#4CAF50', // Lighter green for hover or secondary actions
      dark: '#003300', // Darker green for disabled states
      contrastText: '#ffffff', // Text color on primary background
    },
    secondary: {
      main: '#FECC07', // Main yellow color
      light: '#FFF176', // Lighter yellow for hover or secondary actions
      dark: '#C6A700', // Darker yellow for disabled states
      contrastText: '#000000', // Text color on secondary background
    },
    // You can define more colors here as needed
    error: {
      main: '#f44336', // Main error color
    },
    warning: {
      main: '#ff9800', // Main warning color
    },
    info: {
      main: '#2196F3', // Main info color
    },
    success: {
      main: '#4CAF50', // Main success color
    },
  },
  shape: {
    borderRadius: 8, // Rounded corners globally
  },
  typography: {
    button: {
      textTransform: 'none', // Avoid uppercase transformation in buttons
    },
  },
});

// Styles for buttons based on variants
export const buttonStyles = (variant: 'primary' | 'secondary' | 'light' | 'dark') => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
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
        backgroundColor: theme.palette.primary.light,
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
      return {}; // Fallback to default styles
  }
};

export default theme;

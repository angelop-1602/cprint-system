// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#036635', // Green color
    },
    secondary: {
      main: '#FECC07', // Yellow color
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

export default theme;

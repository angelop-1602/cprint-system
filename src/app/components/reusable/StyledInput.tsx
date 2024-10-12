// components/StyledInput.tsx
import { TextField, styled } from '@mui/material';


const StyledInput = styled(TextField)(({ theme }) => ({
    backgroundColor: 'white',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    width: '100%', // Full width of parent container
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.grey[400],
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  }));
export default StyledInput;

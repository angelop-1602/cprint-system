import { styled } from '@mui/material/styles';

const StyledLink = styled('a')(({ theme }) => ({
  color: '#036635', // Change color to a vibrant green
  textDecoration: 'none', // Remove underline
  fontWeight: 'bold', // Make the text bold
  padding: '0px 1px', // Add some padding for better click area
  borderRadius: '4px', // Add rounded corners
  transition: 'color 0.1s, outline 0.1s', // Smooth transition for hover and outline effect
  display: 'inline-block', // Makes padding and background color work correctly
  '&:hover': {
    color: theme.palette.secondary.main,
    textDecoration:'underline',
  },
  '&:focus': {
    outline: '2px solid ' + theme.palette.primary.main,
    outlineOffset: '2px',
  },
  '&:active': {
    color: theme.palette.primary.dark,
  },
}));

export default StyledLink;

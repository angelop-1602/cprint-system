import { styled } from '@mui/material/styles';

const StyledLink = styled('a')(({ theme }) => ({
  color: '#036635', // Change color to a vibrant green
  textDecoration: 'underline', // Remove underline
  fontWeight: 'bold', // Make the text bold
  padding: '2px 8px', // Add some padding for better click area
  borderRadius: '4px', // Add rounded corners
  transition: 'color 0.1s', // Smooth transition for hover effect
  display: 'inline-block', // Makes padding and background color work correctly
 '&:hover':{
    color:theme.palette.secondary.main
 }
}));


export default StyledLink;

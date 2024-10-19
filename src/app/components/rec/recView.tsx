// components/Dashboard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';

interface BoxContent {
  title: string;
  content: string;
}

const boxes: BoxContent[] = [
  { title: 'Box 1', content: 'Content for Box 1' },
  { title: 'Box 2', content: 'Content for Box 2' },
  { title: 'Box 3', content: 'Content for Box 3' },
  { title: 'Box 4', content: 'Content for Box 4' },
  { title: 'Box 5', content: 'Content for Box 5' },
];

const CardComponent: React.FC<BoxContent> = ({ title, content }) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 2,
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      border: '1px solid #ccc',
      '&:hover': {
        boxShadow: 5,
        transform: 'scale(1.02)',
      },
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        {content}
      </Typography>
    </CardContent>
  </Card>
);

const RecView: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        {/* First Row: 3 Boxes */}
        {boxes.slice(0, 3).map((box, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <CardComponent title={box.title} content={box.content} />
          </Grid>
        ))}

        {/* Second Row: 1 Box */}
        <Grid item xs={12}>
          <CardComponent title={boxes[3].title} content={boxes[3].content} />
        </Grid>

        {/* Third Row: 1 Box */}
        <Grid item xs={12}>
          <CardComponent title={boxes[4].title} content={boxes[4].content} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecView;

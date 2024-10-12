// components/Dashboard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';

const Dashboard: React.FC = () => {
    const boxes = [
        { title: 'Box 1', content: 'Content for Box 1' },
        { title: 'Box 2', content: 'Content for Box 2' },
        { title: 'Box 3', content: 'Content for Box 3' },
        { title: 'Box 4', content: 'Content for Box 4' },
        { title: 'Box 5', content: 'Content for Box 5' },
    ];

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Grid container spacing={2}>
                {/* First Row: 3 Boxes */}
                <Grid item xs={12} sm={4}>
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
                                {boxes[0].title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                {boxes[0].content}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
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
                                {boxes[1].title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                {boxes[1].content}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
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
                                {boxes[2].title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                {boxes[2].content}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Second Row: 1 Box */}
                <Grid item xs={12}>
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
                                {boxes[3].title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                {boxes[3].content}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Third Row: 1 Box */}
                <Grid item xs={12}>
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
                                {boxes[4].title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                {boxes[4].content}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;

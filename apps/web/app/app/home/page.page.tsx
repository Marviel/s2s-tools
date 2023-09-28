import React, { CSSProperties } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// Styles to center the content
const centerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

const Home = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={centerStyle}>
        <Typography variant="h3" component="h1">Welcome to S2S-Helpers</Typography>
      </Box>
    </Container>
  );
};

export default Home;

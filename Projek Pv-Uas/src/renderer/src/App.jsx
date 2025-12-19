import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar'; 

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      
      <Container sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default App;
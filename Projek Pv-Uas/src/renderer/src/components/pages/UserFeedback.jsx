import React, { useState, useContext } from 'react';
import { AuthContext } from '../Auth';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';

export default function UserFeedback() {
  const [msg, setMsg] = useState('');
  const { sendFeedback } = useContext(AuthContext);

  const handleSend = async () => {
    if(!msg) return;
    await sendFeedback(msg);
    alert("Terima kasih atas saran Anda!");
    setMsg('');
  };

  return (
    <Box maxWidth={600} mx="auto">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Kotak Saran</Typography>
        <Typography>Silakan laporkan kerusakan fasilitas atau saran.</Typography>
        <TextField 
          fullWidth multiline rows={4} 
          label="Tulis pesan Anda disini..." 
          value={msg} 
          onChange={e => setMsg(e.target.value)} 
        />
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSend}>Kirim Pesan</Button>
      </Paper>
    </Box>  
  );
}
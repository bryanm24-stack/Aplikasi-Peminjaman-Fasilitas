import React, { useState, useContext } from 'react';
import { AuthContext } from '../Auth';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Typography, Alert, Box } from '@mui/material';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ fullName: '', username: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.fullName, formData.username, formData.password);
      navigate('/user/browse');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ minWidth: 350, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">Daftar Akun Baru</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Nama Lengkap" margin="normal" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
            <TextField fullWidth label="Username" margin="normal" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
            <TextField fullWidth label="Password" type="password" margin="normal" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            <Button fullWidth variant="contained" color="secondary" type="submit" sx={{ mt: 2 }}>Daftar Sekarang</Button>
          </form>
          <Typography align="center" sx={{ mt: 2 }}>
            Sudah punya akun? <Link to="/login">Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
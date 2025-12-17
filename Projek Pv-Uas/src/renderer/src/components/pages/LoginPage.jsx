import React, { useState, useContext } from 'react';
import { AuthContext } from '../Auth';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Typography, Alert, Box } from '@mui/material';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(username, password);
      // Redirect sesuai role
      if (user.role === 'admin') navigate('/admin/facilities');
      else navigate('/user/browse');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ minWidth: 350, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">Login SiPinjam</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Username" margin="normal" value={username} onChange={e => setUsername(e.target.value)} required />
            <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Masuk</Button>
          </form>
          <Typography align="center" sx={{ mt: 2 }}>
            Belum punya akun? <Link to="/register">Daftar</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
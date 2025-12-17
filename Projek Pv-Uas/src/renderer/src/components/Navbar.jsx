import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AuthContext } from './Auth';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Komponen kecil untuk tombol menu aktif
  const NavButton = ({ to, label }) => (
    <Button 
      color="inherit" 
      onClick={() => navigate(to)}
      sx={{ 
        borderBottom: location.pathname === to ? '2px solid white' : 'none',
        borderRadius: 0,
        fontWeight: location.pathname === to ? 'bold' : 'normal'
      }}
    >
      {label}
    </Button>
  );

  // Jika user belum login, jangan tampilkan Navbar (atau tampilkan polosan)
  if (!user) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistem Peminjaman Kampus
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Menu Khusus Admin */}
          {user.role === 'admin' && (
            <>
              <NavButton to="/admin/facilities" label="Fasilitas" />
              <NavButton to="/admin/loans" label="Persetujuan" />
              <NavButton to="/admin/feedbacks" label="Kritik Saran" />
            </>
          )}

          {/* Menu Khusus User */}
          {user.role === 'user' && (
            <>
              <NavButton to="/user/browse" label="Pinjam Baru" />
              <NavButton to="/user/my-loans" label="Riwayat Saya" />
              <NavButton to="/user/feedback" label="Tulis Saran" />
            </>
          )}

          <Button color="error" variant="contained" onClick={handleLogout} sx={{ ml: 2 }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
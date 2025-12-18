import React, { useContext } from 'react';
import { AuthContext } from '../Auth';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Chip, Box } from '@mui/material';

export default function UserMyLoans() {
  const { user, loans } = useContext(AuthContext);

  const myLoans = loans.filter(l => l.userId === user.id);

  const columns = [
    { field: 'date', headerName: 'Tanggal', width: 130 },
    { field: 'facilityName', headerName: 'Fasilitas', width: 200 },
    { field: 'reason', headerName: 'Keperluan', width: 250 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => {
        const color = params.value === 'approved' ? 'success' : params.value === 'rejected' ? 'error' : 'warning';
        return <Chip label={params.value} color={color} variant="outlined" />;
      }
    },
  ];

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <Typography variant="h4" gutterBottom>Riwayat Peminjaman Saya</Typography>
      <DataGrid rows={myLoans} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
    </Box>
  );
}
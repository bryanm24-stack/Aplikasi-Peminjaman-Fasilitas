import React, { useContext } from 'react';
import { AuthContext } from '../Auth';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Chip, Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function AdminLoans() {
  const { loans, updateLoanStatus } = useContext(AuthContext);

  const handleStatus = async (id, status) => {
    try {
      await updateLoanStatus(id, status);
    } catch (e) {
      alert(e.message); 
    }
  };

  const columns = [
    { field: 'date', headerName: 'Tanggal Pinjam', width: 120 },
    { field: 'userName', headerName: 'Peminjam', width: 150 },
    { field: 'facilityName', headerName: 'Fasilitas', width: 180 },
    { field: 'reason', headerName: 'Keperluan', width: 200 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => {
        const color = params.value === 'approved' ? 'success' : params.value === 'rejected' ? 'error' : 'warning';
        return <Chip label={params.value.toUpperCase()} color={color} size="small" />;
      }
    },
    {
      field: 'actions',
      headerName: 'Aksi Admin',
      width: 250,
      renderCell: (params) => (
        params.row.status === 'pending' && (
          <Box>
            <Button size="small" color="success" startIcon={<CheckCircleIcon />} onClick={() => handleStatus(params.row.id, 'approved')}>
              Terima
            </Button>
            <Button size="small" color="error" startIcon={<CancelIcon />} onClick={() => handleStatus(params.row.id, 'rejected')}>
              Tolak
            </Button>
          </Box>
        )
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>Persetujuan Peminjaman</Typography>
      <DataGrid rows={loans} columns={columns} pageSize={10} rowsPerPageOptions={[10]} disableSelectionOnClick />
    </Box>
  );
}
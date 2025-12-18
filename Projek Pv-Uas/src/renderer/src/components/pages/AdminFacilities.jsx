import React, { useContext, useState } from 'react';
import { AuthContext } from '../Auth';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminFacilities() {
  const { facilities, addFacility, deleteFacility } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', type: '', description: '' });

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nama Fasilitas', width: 200 },
    { field: 'type', headerName: 'Tipe', width: 130 },
    { field: 'description', headerName: 'Deskripsi', width: 300 },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<DeleteIcon />}
          onClick={() => handleDelete(params.row.id)}
        >
          Hapus
        </Button>
      ),
    },
  ];

  const handleDelete = async (id) => {
    if(window.confirm("Yakin hapus fasilitas ini?")) {
      try {
        await deleteFacility(id);
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const handleSave = async () => {
    await addFacility(newItem);
    setOpen(false);
    setNewItem({ name: '', type: '', description: '' });
  };

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Manajemen Fasilitas</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>+ Tambah Fasilitas</Button>
      </Box>
      
      <DataGrid rows={facilities} columns={columns} pageSize={5} rowsPerPageOptions={[5]} disableSelectionOnClick />

      {      }
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Tambah Fasilitas Baru</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Nama Fasilitas" fullWidth value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
          <TextField margin="dense" label="Tipe (Ruangan/Alat)" fullWidth value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})} />
          <TextField margin="dense" label="Deskripsi" fullWidth multiline rows={3} value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={handleSave} variant="contained">Simpan</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
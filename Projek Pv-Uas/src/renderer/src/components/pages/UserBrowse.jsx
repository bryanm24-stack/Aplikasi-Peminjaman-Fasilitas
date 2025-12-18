import React, { useContext, useState } from 'react';
import { AuthContext } from '../Auth';
import { Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';

export default function UserBrowse() {
  const { facilities, requestLoan } = useContext(AuthContext);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [form, setForm] = useState({ date: '', reason: '' });

  const handleBooking = async () => {
    try {
      await requestLoan(selectedFacility.id, form.date, form.reason);
      alert("Permintaan berhasil dikirim! Tunggu konfirmasi admin.");
      setSelectedFacility(null);
      setForm({ date: '', reason: '' });
    } catch (e) {
      alert(e.message); 
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Daftar Fasilitas Kampus</Typography>
      <Grid container spacing={3}>
        {facilities.map((fac) => (
          <Grid item xs={12} sm={6} md={4} key={fac.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5">{fac.name}</Typography>
                <Typography color="text.secondary" gutterBottom>{fac.type}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{fac.description}</Typography>
                <Button variant="contained" fullWidth onClick={() => setSelectedFacility(fac)}>
                  Pinjam Fasilitas Ini
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedFacility} onClose={() => setSelectedFacility(null)}>
        <DialogTitle>Pinjam: {selectedFacility?.name}</DialogTitle>
        <DialogContent>
          <TextField 
            margin="dense" 
            label="Tanggal Peminjaman" 
            type="date" 
            fullWidth 
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={e => setForm({...form, date: e.target.value})}
          />
          <TextField 
            margin="dense" 
            label="Alasan Peminjaman (Contoh: Rapat BEM)" 
            fullWidth 
            multiline rows={2}
            value={form.reason}
            onChange={e => setForm({...form, reason: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedFacility(null)}>Batal</Button>
          <Button onClick={handleBooking} variant="contained">Ajukan Peminjaman</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}